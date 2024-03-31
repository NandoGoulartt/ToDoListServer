import { Router } from "express";
import tasksController from "../controllers/tasks";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/task/create", authMiddleware, tasksController.createTask);

export default router;
