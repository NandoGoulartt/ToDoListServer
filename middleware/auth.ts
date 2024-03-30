import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Token não informado!" });
    }

    const authorizationArray = authorization.split(" ");

    const [shema, token] = authorizationArray;

    if (authorizationArray.length !== 2 || shema !== "Bearer") {
      return res.status(401).json({ message: "Formato do Token invalido!" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return res
      .status(401)
      .json({ message: "Token de autenticação inválido ou expirado." });
  }
}
