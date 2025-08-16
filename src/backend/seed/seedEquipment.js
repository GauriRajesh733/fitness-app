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

async function seedAllEquipment() {
  let allEquipment = [];

  async function fetchAllEquipment(url) {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        for (const equipment of data.results) {
          allEquipment.push({
            id: equipment.id,
            name: equipment.name,
          });
        }
      })
      .catch((e) => console.error("An Error Occurred: ", e));
  }

  await fetchAllEquipment("https://wger.de/api/v2/equipment");

  console.log(`All ${allEquipment.length} equipment have been fetched.`);

  for (const equipment of allEquipment) {
    try {
      await client.query(
        `INSERT INTO equipment (id, name)
       VALUES ($1, $2)
       ON CONFLICT (id) DO NOTHING`,
        [equipment.id, equipment.name]
      );
    } catch (error) {
      console.error(
        `An error occurred while inserting equipment ${equipment.id}: ${error}`
      );
    }
  }

  await client.end();
  console.log(`All ${allEquipment.length} equipment have been inserted.`);
}

await seedAllEquipment();
