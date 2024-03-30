import { Request, Response } from "express";
import { IUsers } from "../models/users";
import bcrypt from "bcrypt";
import UsersRepository from "../models/usersModel";
import { getRolesId, create as createUsersRoles } from "./roles";

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

async function getAll(req: Request, res: Response) {
  const existingUser = await UsersRepository.findAll();
  res.json(existingUser);
}

export default { create, getAll };
