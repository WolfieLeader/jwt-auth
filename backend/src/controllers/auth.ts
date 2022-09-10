import { Request, Response } from "express";
import mysql from "mysql2/promise";
import jsonwebtoken from "jsonwebtoken";
import {
  connectionSettings,
  secretKey,
  convertErrorToString,
  saltIt,
  compareSalt,
  hashIt,
  validateEmail,
  hasLettersDigitsSpacesOnly,
  formatNumberToString,
} from "../helpers";
import { UserSQL, UserJWT } from "../user";

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
    if (!hasLettersDigitsSpacesOnly(name)) {
      throw new Error("Name must contain only english letters, numbers and spaces");
    }
    if (password.length < 8 || password.length > 20) {
      throw new Error("Password must be between 8-20 characters");
    }
    if (!validateEmail(email)) {
      throw new Error("Invalid email");
    }

    const connection = await mysql.createConnection(connectionSettings);
    const [takenEmail] = await connection.execute("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (Array.isArray(takenEmail) && takenEmail.length > 0) {
      await connection.end();
      throw new Error("Email already exists");
    }
    await connection.execute(
      `INSERT INTO users(name,email,password,realPassword) 
      VALUES ('${name}','${email.toLowerCase()}','${saltIt(password)}','${password}');`
    );
    res.status(201).json({ message: "User created" });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Missing params");
    }
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid params");
    }
    if (!validateEmail(email)) {
      throw new Error("Invalid email");
    }
    const connection = await mysql.createConnection(connectionSettings);
    const [userResult] = await connection.execute("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (!Array.isArray(userResult)) {
      await connection.end();
      throw new Error("User not found");
    }
    if (Array.isArray(userResult) && userResult.length === 0) {
      await connection.end();
      throw new Error("User does not exist");
    }
    const [user] = userResult as UserSQL[];

    if (!compareSalt(user.password, password)) {
      await connection.end();
      throw new Error("Invalid password");
    }
    const userDetails: UserJWT = {
      id: user.id,
      name: user.name,
      hobbies: user.hobbies,
      netWorth: user.netWorth ? formatNumberToString(user.netWorth) : null,
      email: user.email,
    };
    const jwtKey = hashIt(secretKey);
    const token = jsonwebtoken.sign(userDetails, jwtKey, { expiresIn: "5m" });
    res.status(200).json({ user: userDetails, token: token });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};
