import { Client } from "pg";
import "dotenv/config"; // load .env

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

await client.connect();

async function seedAllMuscles() {
  let allMuscles = [];

  async function fetchAllMuscles(url) {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        for (const muscle of data.results) {
          if (muscle.id && (muscle.name_en || muscle.name)) {
            allMuscles.push({
              id: muscle.id,
              name: muscle.name_en ? muscle.name_en : muscle.name,
              image: muscle.image_url_main,
            });
          }
        }
      })
      .catch((e) => console.error("An Error Occurred: ", e));
  }

  await fetchAllMuscles("https://wger.de/api/v2/muscle/");

  console.log(`All ${allMuscles.length} muscles have been fetched.`);

  for (const muscle of allMuscles) {
    try {
      await client.query(
        `INSERT INTO muscles (id, name, image)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
        [muscle.id, muscle.name, muscle.image]
      );
    } catch (error) {
      console.error(
        `An error occurred while inserting muscle ${muscle.id}: ${error}`
      );
    }
  }

  await client.end();
  console.log(`All ${allMuscles.length} muscles have been inserted.`);
}

await seedAllMuscles();
