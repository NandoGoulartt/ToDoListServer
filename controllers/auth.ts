import { Request, Response } from "express";
import UsersRepository from "../models/usersModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "É obrigatório fornecer o email e a senha para fazer login.",
      });
    }
    const user = await UsersRepository.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Nenhum usuário com esse email foi encontrado." });
    }
    const validPassword = await bcrypt.compare(
      password,
      user.dataValues.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { userId: user.dataValues.id, email: user.dataValues.email },
      process.env.JWT_SECRET || "palavraSecreta",
      { expiresIn: "1h" }
    );
    res.json({ token, message: "Logado com sucesso." });
  } catch (error) {
    res.json(error);
  }
}

export default { login };
