import { Request, Response } from "express";
import mysql from "mysql2/promise";
import { convertParamsToInt, connectionSettings, convertErrorToString } from "../helpers";

export const getSettings = (req: Request, res: Response) => {
  return res.status(200).json({ settings: connectionSettings });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const connection = await mysql.createConnection(connectionSettings);
    const [rows] = await connection.execute("SELECT * FROM users");
    res.status(200).json(rows);
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};

export const getUsersById = async (req: Request, res: Response) => {
  try {
    const ids = convertParamsToInt(req.params.id);
    if (ids === null) throw new Error("Invalid id");
    const connection = await mysql.createConnection(connectionSettings);
    const [rows] = await connection.execute(`SELECT * FROM users WHERE id IN (${ids.join(",")});`);
    res.status(200).json(rows);
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};
