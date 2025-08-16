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

async function seedAllCategories() {
  let allCategories = [];

  async function fetchAllCategories(url) {
    await fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        for (const category of data.results) {
          allCategories.push({
            id: category.id,
            name: category.name,
          });
        }
      })
      .catch((e) => console.error("An Error Occurred: ", e));
  }

  await fetchAllCategories("https://wger.de/api/v2/exercisecategory/");

  console.log(`All ${allCategories.length} categories have been fetched.`);

  for (const category of allCategories) {
    try {
      await client.query(
        `INSERT INTO exercise_category (id, name)
       VAL
       UES ($1, $2)
       ON CONFLICT (id) DO NOTHING`,
        [category.id, category.name]
      );
    } catch (error) {
      console.error(
        `An error occurred while inserting exercise category ${exercise.id}`
      );
    }
  }

  await client.end();
  console.log(`All ${allCategories.length} categories have been inserted.`);
}

await seedAllCategories();
