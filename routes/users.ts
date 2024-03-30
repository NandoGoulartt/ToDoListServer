import { Router } from "express";
import usersController from "../controllers/users";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/users/create", usersController.create);
router.get("/users", authMiddleware, usersController.getAll);

export default router;
