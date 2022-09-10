import { Request, Response, NextFunction } from "express";
import mysql from "mysql2/promise";
import jsonwebtoken from "jsonwebtoken";
import { connectionSettings, convertErrorToString, hashIt, hasLettersDigitsSpacesOnly, secretKey } from "../helpers";
import { UserSQL, UserJWT } from "../user";

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new Error("Missing token");
    }
    if (typeof token !== "string") {
      throw new Error("Invalid token");
    }
    const jwtKey = hashIt(secretKey);
    const decoded = jsonwebtoken.verify(token, jwtKey);
    res.locals.user = decoded as UserJWT;
    next();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};

export const changeName = async (req: Request, res: Response) => {
  try {
    const { user } = res.locals;
    const { name } = req.body;
    if (!user) {
      throw new Error("User not found");
    }
    if (!name) {
      throw new Error("Missing params");
    }
    if (typeof name !== "string") {
      throw new Error("Invalid params");
    }
    if (name.length < 4 || name.length > 20) {
      throw new Error("Name must be between 4-20 characters");
    }
    if (!hasLettersDigitsSpacesOnly(name)) {
      throw new Error("Name must contain only english letters, numbers and spaces");
    }
    const connection = await mysql.createConnection(connectionSettings);
    await connection.execute(`UPDATE users SET name = '${name}' WHERE id = ${user.id};`);
    res.locals.user.name = name;
    const [userSQL] = await connection.execute(`SELECT * FROM users WHERE id = ${user.id};`);
    const [userObj] = userSQL as UserSQL[];
    res.status(200).json({ user: userObj });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};
