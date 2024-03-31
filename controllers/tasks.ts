import { Response } from "express";
import TasksRepository from "../models/tasksModel";
import { AuthRequest } from "../middleware/auth";

async function createTask(req: AuthRequest, res: Response) {
  try {
    const { title, priority } = req.body;

    if (!title || !priority) {
      return res
        .status(400)
        .json({ error: "Título e prioridade são obrigatórios." });
    }

    const userId = req.userId;

    const newTask = await TasksRepository.create({
      title,
      priority,
      user_id: userId,
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro ao criar tarefa." });
  }
}

export default {
  createTask,
};
