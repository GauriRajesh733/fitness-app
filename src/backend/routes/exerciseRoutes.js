import express from "express";
import {
  getExercises,
  getExerciseByName,
  getMuscles,
  getCategories,
  getEquipment,
} from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/", getExercises);
router.get("/muscles", getMuscles);
router.get("/equipment", getEquipment);
router.get("/categories", getCategories);
router.get("/by-name/:name", getExerciseByName);

export default router;
