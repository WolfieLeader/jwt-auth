import { Request, Response } from "express";
import mysql from "mysql2/promise";
import { connectionSettings, convertErrorToString, saltIt, validateEmail } from "../helpers";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error("Missing params");
    }
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid params");
    }
    if (name.length < 4 || name.length > 20) {
      throw new Error("Name must be between 4-20 characters");
    }
    if (name.match(/[^a-zA-Z0-9]/g)) {
      throw new Error("Name must only contain letters and numbers");
    }
    if (password.length < 8 || password.length > 20) {
      throw new Error("Password must be between 8-20 characters");
    }
    if (validateEmail(email) === false) {
      throw new Error("Invalid email");
    }

    const connection = await mysql.createConnection(connectionSettings);
    const isEmailTaken = await connection.execute("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (Array.isArray(isEmailTaken[0]) && isEmailTaken[0].length > 0) {
      throw new Error("Email already exists");
    }
    await connection.execute(
      `INSERT INTO users(name,email,password,realPassword) 
      VALUES ('${name}','${email.toLowerCase()}','${saltIt(password)}','${password}');`
    );
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};
