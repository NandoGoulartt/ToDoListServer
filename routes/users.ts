import { Router } from "express";
import usersController from "../controllers/users";

const router = Router();

router.post("/users/create", usersController.create);

export default router;
