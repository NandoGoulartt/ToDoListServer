import { Request, Response } from "express";

async function create(req: Request, res: Response) {
  res.json({ message: "User criado!" });
}

export default { create };
