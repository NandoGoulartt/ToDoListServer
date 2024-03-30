import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userRoles?: string[];
}

interface DecodedToken extends JwtPayload {
  userId: string;
  userRoles: string[];
}

export function authMiddleware(
  req: AuthRequest,
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
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "palavraSecreta"
    ) as DecodedToken;

    req.userId = decodedToken.userId;
    req.userRoles = decodedToken.roles;

    next();
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return res
      .status(401)
      .json({ message: "Token de autenticação inválido ou expirado." });
  }
}
