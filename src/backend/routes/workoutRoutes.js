import express from "express";
import {
  getAllWorkouts,
  createWorkout,
  updateWorkout,
  saveWorkoutMessage
} from "../controllers/workoutController.js";
import { authenticateToken } from "../middleware/authentication.js";
const router = express.Router();

router.get("/", authenticateToken, getAllWorkouts);
router.post("/", authenticateToken, createWorkout);
router.post("/message", authenticateToken, saveWorkoutMessage);
router.put("/", authenticateToken, updateWorkout);

export default router;
