import { Request, Response } from "express";
import UsersRepository from "../models/usersModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRolesRepository from "../models/userRolesModel";
import rolesModel from "../models/rolesModel";

async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "É obrigatório fornecer o email e a senha para fazer login.",
    });
  }

  try {
    const user = await UsersRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "Nenhum usuário com esse email foi encontrado.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.dataValues.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const userRoles = await UserRolesRepository.findAll({
      where: { user_id: user.dataValues.id },
    });

    const rolesIds = userRoles.map((userRole) => userRole.dataValues.role_id);
    const rolesData = await rolesModel.findAll({
      where: { id: rolesIds },
    });
    const roles = rolesData.map((role) => role.dataValues.name);
    const token = jwt.sign(
      { userId: user.dataValues.id, email: user.dataValues.email, roles },
      process.env.JWT_SECRET || "palavraSecreta",
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Logado com sucesso." });
  } catch (error) {
    console.error("Erro durante o login:", error);
    res.status(500).json({ message: "Ocorreu um erro durante o login." });
  }
}

export default { login };
