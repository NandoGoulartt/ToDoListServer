import { Request, Response } from "express";
import { IUsers } from "../models/users";
import bcrypt from "bcrypt";
import UsersRepository from "../models/usersModel";

async function create(req: Request, res: Response) {
  try {
    const userData = req.body as IUsers;
    const existingUser = await UsersRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Este email já está em uso." });
    }
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const newUser = await UsersRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    res.json({ message: "Usuário criado com sucesso.", user: newUser });
  } catch (error) {
    res.json(error);
  }
}

export default { create };
