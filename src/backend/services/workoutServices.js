import pool from "../db/db.js";
import fsPromises from "fs/promises";
import { getByUsernameService } from "./userServices.js";
import { getExerciseByNameService } from "./exerciseServices.js";
export async function getAllWorkoutsService(username, queryParams) {
  let query = "";
  try {
    query += await fsPromises.readFile("src/backend/db/workouts.sql", "utf-8");
  } catch (err) {
    console.error("Error reading file", err);
  }

  let user = await getByUsernameService(username);
  let result;
  // only query by workout id
  if (queryParams.workout_id) {
    query += " WHERE w.id = $1 GROUP BY w.id, u.id;";
    result = pool.query(query, [queryParams.workout_id]);
  }
  // only query by user id
  else {
    query += " WHERE u.id = $1 GROUP BY w.id, u.id;";
    result = pool.query(query, [user.id]);
  }

  // query database
  return (await result).rows;
}

export async function createWorkoutService(
  username,
  workout_name,
  workout_exercises
) {
  let user = await getByUsernameService(username);

  // create workout with given name
  let query = "INSERT INTO workouts (name) VALUES ($1) RETURNING *;";
  let result = await pool.query(query, [workout_name]);

  // get workout id
  const workout_id = result.rows[0].id;
  // add workouts to current user's workouts
  query = "INSERT INTO user_workouts (user_id, workout_id) VALUES ($1, $2);";
  result = await pool.query(query, [user.id, workout_id]);

  // add each exercise to the workout
  workout_exercises.forEach(async (exercise) => {
    if (
      !exercise.exercise_name ||
      !exercise.exercise_sets ||
      !exercise.exercise_reps
    ) {
      console.error("Insufficient exercise information.");
      return res
        .status(400)
        .json({ message: "Missing required fields for exercise." });
    }

    let exercise_id = (await getExerciseByNameService(exercise.exercise_name))
      .id;

    query =
      "INSERT INTO workout_exercises (exercise_id, workout_id, sets, repetitions) VALUES ($1, $2, $3, $4)";
    await pool.query(query, [
      exercise_id,
      workout_id,
      exercise.exercise_sets,
      exercise.exercise_reps,
    ]);
  });
}

export async function saveWorkoutMessageService(username, originalWorkoutId) {
  const userId = (await getByUsernameService(username)).id;
  const originalWorkout = await pool.query(
    "SELECT * FROM workouts WHERE id = $1",
    [originalWorkoutId]
  );

  // create workout with given name
  let result = await pool.query(
    "INSERT INTO workouts (name) VALUES ($1) RETURNING *;",
    [originalWorkout.rows[0].name]
  );

  // get workout id
  const workoutId = result.rows[0].id;

  // add workouts to current user's workouts
  result = await pool.query(
    "INSERT INTO user_workouts (user_id, workout_id) VALUES ($1, $2);",
    [userId, workoutId]
  );

  // add exercises to workout
  await pool.query(
    `INSERT INTO workout_exercises (workout_id, exercise_id, sets, repetitions)
      SELECT $1, exercise_id, sets, repetitions FROM workout_exercises WHERE workout_id=$2`,
    [workoutId, originalWorkoutId]
  );
}

export async function editWorkoutService(
  username,
  { old_name: oldName, new_name: newName }
) {
  console.log("username: ", username);
  if (oldName && newName) {
    const query =
      "UPDATE workouts SET name = $1 WHERE id IN (SELECT uw.workout_id FROM user_workouts uw JOIN users u ON uw.user_id = u.id " +
      "JOIN workouts w ON w.id = uw.workout_id WHERE w.name = $2 AND u.username = $3);";

    await pool.query(query, [newName, oldName, username]);
  }
}
