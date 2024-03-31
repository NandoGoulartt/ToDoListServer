import { Router } from "express";
import usersController from "../controllers/users";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/users/create", usersController.createUser);
router.get("/users", authMiddleware, usersController.getUsers);
router.get("/users/search", authMiddleware, usersController.getSearchUser);
router.get("/users/:id", authMiddleware, usersController.getUser);
router.delete("/users/:id", authMiddleware, usersController.deleteUser);
router.put("/users/:id", authMiddleware, usersController.updateUser);

export default router;
