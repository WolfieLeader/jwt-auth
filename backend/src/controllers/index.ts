import { Request, Response, NextFunction } from "express";
import { getUsers, getUsersById } from "./get";
import { resetUsersTable } from "./actions";

export const sendWelcome = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Hello World" });
};

export { getUsers, getUsersById, resetUsersTable };
