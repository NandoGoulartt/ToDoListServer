import { Request, Response } from "express";

async function login(req: Request, res: Response) {
  res.json({ message: "Logado!" });
}

export default { login };
