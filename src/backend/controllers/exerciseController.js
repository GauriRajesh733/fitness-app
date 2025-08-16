import {
  getExercisesService,
  getExerciseByNameService,
  getMusclesService,
  getCategoriesService,
  getEquipmentService,
} from "../services/exerciseServices.js";

export async function getExercises(req, res) {
  try {
    const exercises = await getExercisesService(req.query);
    res.json(exercises);
  } catch (err) {
    console.error("Error in controller getting filtered exercises: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function getExerciseByName(req, res) {
  try {
    const exercise = await getExerciseByNameService(req.params.name);
    res.json(exercise);
  } catch (err) {
    console.error("Error in controller getting exercise by name: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function getMuscles(req, res) {
  try {
    const muscles = await getMusclesService();
    res.json(muscles);
  } catch (err) {
    console.error("Error in controller getting muscles: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await getCategoriesService();
    res.json(categories);
  } catch (err) {
    console.error("Error in controller getting categories: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function getEquipment(req, res) {
  try {
    const equipment = await getEquipmentService();
    res.json(equipment);
  } catch (err) {
    console.error("Error in controller getting equipment: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}
