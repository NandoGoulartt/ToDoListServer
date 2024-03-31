import { Router } from "express";
import tasksController from "../controllers/tasks";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/tasks", authMiddleware, tasksController.getTasks);
router.get("/tasks/:id", authMiddleware, tasksController.getTask);
router.post("/tasks/create", authMiddleware, tasksController.createTask);
router.put("/tasks/:id", authMiddleware, tasksController.updateTask);
export default router;
