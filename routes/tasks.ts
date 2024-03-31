import { Router } from "express";
import tasksController from "../controllers/tasks";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/tasks", authMiddleware, tasksController.getTasks);
router.post("/tasks/create", authMiddleware, tasksController.createTask);

export default router;
