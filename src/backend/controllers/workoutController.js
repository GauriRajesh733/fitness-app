import {
  getAllWorkoutsService,
  createWorkoutService,
  editWorkoutService,
  saveWorkoutMessageService,
} from "../services/workoutServices.js";

export async function getAllWorkouts(req, res) {
  try {
    console.log(req.user);
    // get current user authentication
    const workouts = await getAllWorkoutsService(req.user.username, req.query);
    res.json(workouts);
  } catch (err) {
    console.error("Error in controller getting workouts: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function createWorkout(req, res) {
  try {
    const username = req.user.username;
    const { workout_name, workout_exercises } = req.body;
    if (!workout_name || !workout_exercises || !username) {
      console.error("Missing fields");
      return res.status(400).json({ message: "Missing required fields." });
    }
    await createWorkoutService(
      username,
      req.body.workout_name,
      req.body.workout_exercises
    );
    return res.status(200).json({ message: "Workout successfully created." });
  } catch (err) {
    console.error("Error in controller creating workout: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function saveWorkoutMessage(req, res) {
  try {
    console.log(req.body);
    const username = req.user.username;
    if (!username) {
      return;
    }
    if (!req.body.workout_id) {
      console.error("Missing fields");
      return res.status(400).json({ message: "Missing required fields." });
    }
    await saveWorkoutMessageService(username, req.body.workout_id);
    return res.status(200).json({ message: "Workout successfully created." });
  } catch (err) {
    // if workout already saved ignore error
    if (err.code !== "23505") {
      console.error("Error in controller saving workout message: ", err);
      res.status(500).json({ error: "Error in controller" });
    }
  }
}

export async function updateWorkout(req, res) {
  try {
    const username = req.user.username;
    if (!username) {
      console.error("Need to login to update account.");
      return res
        .status(400)
        .json({ message: "Need to login to update account." });
    }

    const { old_name, new_name } = req.body;
    console.log(req.body);

    const editedWorkout = await editWorkoutService(username, req.body);
    return res.status(200).json(editedWorkout);
  } catch (err) {
    console.error("Error in controller editing workout: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}
