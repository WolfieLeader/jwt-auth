import { Request, Response,NextFunction } from "express";

export const getWelcome = (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
};
