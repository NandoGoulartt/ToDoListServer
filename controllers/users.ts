import { Request, Response } from "express";
import { IUsers } from "../models/users";
import bcrypt from "bcrypt";
import UsersRepository from "../models/usersModel";
import { getRolesId, create as createUsersRoles } from "./roles";
import { AuthRequest } from "../middleware/auth";
import userRolesModel from "../models/userRolesModel";
import { Op } from "sequelize";

async function create(req: Request, res: Response) {
  try {
    const userData = req.body as IUsers;
    const existingUser = await UsersRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Este email já está em uso." });
    }

    if (!userData.roles || userData.roles.length === 0) {
      return res.status(400).json({
        message:
          "É necessário passar pelo menos uma função (role) ao criar um usuário.",
      });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const newUser = await UsersRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const roleIds = await getRolesId(userData.roles);
    for (const role of roleIds) {
      await createUsersRoles(newUser.dataValues.id, role);
    }
    newUser.dataValues.roles = roleIds;
    res.json({ message: "Usuário criado com sucesso.", user: newUser });
  } catch (error) {
    res.json(error);
  }
}

async function getUsers(req: Request, res: Response) {
  const existingUser = await UsersRepository.findAll();
  res.json(existingUser);
}

async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await UsersRepository.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter detalhes do usuário." });
  }
}

async function getSearchUser(req: Request, res: Response) {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "'name' não informado." });
    }
    const users = await UsersRepository.findAll({
      where: { name: { [Op.like]: `${name}%` } },
    });

    if (users) {
      res.json(users);
    } else {
      res.status(404).json({ error: "Usuários não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter usuários." });
  }
}

async function deleteUser(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const user = await UsersRepository.findByPk(id);
    if (req.userRoles) {
      if (id != req.userId && !req.userRoles.includes("ADMIN")) {
        return res
          .status(401)
          .json({ error: "Você não tem permissão para excluir este usuário." });
      }
      if (user) {
        await userRolesModel.destroy({ where: { user_id: id } });
        await user.destroy();
        return res.json({ message: "Usuário excluído com sucesso." });
      } else {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
    }
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return res.status(500).json({ error: "Erro ao excluir usuário." });
  }
}

async function updateUser(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await UsersRepository.findByPk(id);
    if (req.userRoles) {
      if (id != req.userId && !req.userRoles.includes("ADMIN")) {
        return res
          .status(401)
          .json({ error: "Você não tem permissão para excluir este usuário." });
      }
      if (user) {
        const updatedUserData = { name, email, password };
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updatedUserData.password = hashedPassword;
        }
        await user.update(updatedUserData);
        res.json(user);
      } else {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
    }
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return res.status(500).json({ error: "Erro ao excluir usuário." });
  }
}

export default {
  create,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  getSearchUser,
};
