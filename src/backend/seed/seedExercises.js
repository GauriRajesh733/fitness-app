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

async function seedAllExercises() {
  let allExercises = [];

  async function fetchAllExercises(url) {
    await fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        // get exercises on current page
        const exercises = data.results;
        for (const exercise of exercises) {
          const translation = exercise.translations?.find(
            (t) =>
              t.language == 2 &&
              t.name?.trim() &&
              t.description?.replace(/<[^>]*>/g, "").trim()
          );

          if (translation) {
            allExercises.push({
              id: exercise.id,
              name: translation.name,
              description: translation.description
                .replace(/<[^>]*>/g, "")
                .trim(),
            });
          }
        }

        // go to next page
        if (data.next) {
          return await fetchAllExercises(data.next);
        } else {
          return allExercises;
        }
      })
      .catch((e) => console.error("An Error Occurred: ", e));
  }

  await fetchAllExercises("https://wger.de/api/v2/exerciseinfo/");

  console.log(`All ${allExercises.length} have been fetched.`);

  for (const exercise of allExercises) {
    try {
      await client.query(
        `INSERT INTO exercises (id, name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
        [exercise.id, exercise.name, exercise.description]
      );
    } catch (error) {
      console.error(
        `An error occurred while inserting exercise ${exercise.id}`
      );
    }
  }
  console.log(`All ${allExercises.length} have been inserted.`);
}

await seedAllExercises();

// update exercise categories
async function seedExerciseCategories() {
  let exerciseCategories = [];

  async function fetchExerciseCategories(url) {
    await fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        // get exercises on current page
        const exercises = data.results;
        for (const exercise of exercises) {
          exerciseCategories.push({
            id: exercise.id,
            category: exercise.category,
            muscles: exercise.muscles,
            equipment: exercise.equipment,
          });
        }

        // go to next page
        if (data.next) {
          return await fetchExerciseCategories(data.next);
        } else {
          return exerciseCategories;
        }
      })
      .catch((e) => console.error("An Error Occurred: ", e));
  }
  await fetchExerciseCategories("https://wger.de/api/v2/exercise");

  console.log(
    `All ${exerciseCategories.length} exercises and categories have been fetched.`
  );

  for (const exercise of exerciseCategories) {
    const exerciseExists = await client.query(
      `SELECT 1 FROM exercises WHERE id = $1`,
      [exercise.id]
    );

    if (exerciseExists.rowCount > 0) {
      try {
        // update exercise category
        await client.query(
          `UPDATE exercises 
        SET category_id = $2 WHERE id = $1
       `,
          [exercise.id, exercise.category]
        );
        // add to exercise muscles table
        if (exercise.muscles) {
          for (const muscle_id of exercise.muscles) {
            await client.query(
              `INSERT INTO exercise_muscles (exercise_id, muscle_id)
       VALUES ($1, $2)
       ON CONFLICT (exercise_id, muscle_id) DO NOTHING`,
              [exercise.id, muscle_id]
            );
          }
        }

        // add to exercise equipment table
        if (exercise.equipment) {
          for (const equipment_id of exercise.equipment) {
            await client.query(
              `INSERT INTO exercise_equipment (exercise_id, equipment_id)
       VALUES ($1, $2)
       ON CONFLICT (exercise_id, equipment_id) DO NOTHING`,
              [exercise.id, equipment_id]
            );
          }
        }
      } catch (error) {
        console.error(
          `An error occurred while updating exercise cateory for exercise ${exercise.id}: ${error}`
        );
        console.log(exerciseCategories.muscles);
      }
    }
  }

  await client.end();
  console.log(
    `All ${exerciseCategories.length} exercise categories have been updated.`
  );
}

await seedExerciseCategories();
