import { Request, Response, NextFunction } from "express";
import mysql from "mysql2";
import connectionSettings from "../helpers/defaultSettings";
import { convertErrorToString, convertParamsToInt } from "../helpers";

export const getUsers = (req: Request, res: Response) => {
  const connection = mysql.createConnection(connectionSettings);
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    return res.status(200).json({ results });
  });
  connection.end();
};

export const getUsersById = (req: Request, res: Response) => {
  const connection = mysql.createConnection(connectionSettings);
  const { id } = req.params;
  const ids = convertParamsToInt(id);
  if (ids === null) {
    return res.status(400).json({ error: "Invalid id" });
  }
  connection.query(`SELECT * FROM users WHERE id IN (${ids.join(",")})`, (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    return res.status(200).json({ results });
  });
  connection.end();
};
