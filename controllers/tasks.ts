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

async function getTasks(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    let tasks;
    if (req.userRoles) {
      if (!req.userRoles.includes("ADMIN")) {
        tasks = await TasksRepository.findAll({
          where: { user_id: userId },
        });
      } else {
        tasks = await TasksRepository.findAll();
      }
      return res.json(tasks);
    }
  } catch (error) {
    console.error("Erro ao obter todas as tarefas:", error);
    res.status(500).json({ error: "Erro ao obter todas as tarefas." });
  }
}

export default {
  createTask,
  getTasks,
};
