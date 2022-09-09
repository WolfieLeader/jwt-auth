import { Request, Response, NextFunction } from "express";
import mysql from "mysql2/promise";
import connectionSettings from "../helpers/defaultSettings";
import { convertErrorToString, convertParamsToInt } from "../helpers";

const getHelper = async (res: Response, sql: string) => {
  try {
    const connection = await mysql.createConnection(connectionSettings);
    const [rows] = await connection.execute(sql);
    res.status(200).json(rows);
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};
export const getUsers = (req: Request, res: Response) => {
  getHelper(res, "SELECT * FROM users");
};

export const getUsersById = async (req: Request, res: Response) => {
  const ids = convertParamsToInt(req.params.id);
  if (ids === null) return res.status(400).json({ error: "Invalid id" });
  getHelper(res, `SELECT * FROM users WHERE id IN (${ids.join(",")});`);
};
