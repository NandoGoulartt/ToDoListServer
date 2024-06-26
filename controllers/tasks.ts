import { Response } from "express";
import TasksRepository from "../models/tasksModel";
import { AuthRequest } from "../middleware/auth";

async function createTask(req: AuthRequest, res: Response) {
  try {
    const { title, priority, deadline } = req.body;

    if (!title || !priority || !deadline) {
      return res
        .status(400)
        .json({ error: "Título e prioridade são obrigatórios." });
    }

    const newTask = await TasksRepository.create({
      title,
      priority,
      prazo: deadline
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro ao criar tarefa." });
  }
}

async function getTasks(req: AuthRequest, res: Response) {
  try {
    let tasks;
    tasks = await TasksRepository.findAll();
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

    res.json(task);
  } catch (error) {
    console.error("Erro ao obter tarefa por ID:", error);
    res.status(500).json({ error: "Erro ao obter tarefa por ID." });
  }
}

async function updateTask(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, priority, prazo } = req.body;

    const task = await TasksRepository.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    await task.update({ title, priority, prazo });
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

async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const task = await TasksRepository.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    await task.destroy();
    res.json({ message: "Tarefa excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ error: "Erro ao excluir tarefa." });
  }
}

export default {
  createTask,
  getTasks,
  getTask,
  updateTask,
  completeTask,
  deleteTask,
};
