import { Request, Response } from "express";
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
    if (!req.userRoles!.includes("ADMIN")) {
      tasks = await TasksRepository.findAll({
        where: { user_id: userId },
      });
    } else {
      tasks = await TasksRepository.findAll();
    }
    return res.json(tasks);
  } catch (error) {
    console.error("Erro ao obter todas as tarefas:", error);
    res.status(500).json({ error: "Erro ao obter todas as tarefas." });
  }
}

async function getTask(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const task = await TasksRepository.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    if (
      task.dataValues.user_id != req.userId &&
      !req.userRoles!.includes("ADMIN")
    ) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para acessar esta tarefa." });
    }

    res.json(task);
  } catch (error) {
    console.error("Erro ao obter tarefa por ID:", error);
    res.status(500).json({ error: "Erro ao obter tarefa por ID." });
  }
}

async function updateTask(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, priority } = req.body;

    const task = await TasksRepository.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    if (
      task.dataValues.user_id != req.userId &&
      !req.userRoles!.includes("ADMIN")
    ) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para alterar esta tarefa." });
    }

    await task.update({ title, priority });
    res.json(task);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ error: "Erro ao atualizar tarefa." });
  }
}

async function completeTask(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const task = await TasksRepository.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    if (task.dataValues.completed == true) {
      return res.status(400).json({ error: "Tarefa já esta finalizada." });
    }

    if (
      task.dataValues.user_id != req.userId &&
      !req.userRoles!.includes("ADMIN")
    ) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para finalizar esta tarefa." });
    }

    await task.update({ completed: true });
    res.json({ task: task, message: "Tarefa finalizada com sucesso." });
  } catch (error) {
    console.error("Erro ao finalizada tarefa:", error);
    res.status(500).json({ error: "Erro ao finalizada tarefa." });
  }
}

export default {
  createTask,
  getTasks,
  getTask,
  updateTask,
  completeTask,
};
