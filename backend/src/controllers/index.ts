import { Request, Response, NextFunction } from "express";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "airbnb",
});

export const getWelcome = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Hello World" });
};
const errorChecker = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else {
    console.log(error);
    return "Something went wrong";
  }
};

export const resetUsersTable = (req: Request, res: Response) => {
  const queryString = [
    //Remove all users
    "DROP TABLE IF EXISTS users;",
    //Create table
    `CREATE TABLE users( 
      id INT auto_increment, 
      email varchar(255) unique not null, 
      password varchar(255) not null, 
      primary key(id));`,
    //Insert users
    `INSERT INTO users(email,password) VALUES
      ('mark@meta.com','EvilCorp'),('bill@outlook.com','ImJustRich'),
      ('elon@tesla.com','Mars=Earth2.0'),('jeff@amazon.com','IOwnTheWorld');`,
    //Show all users
    "SELECT * FROM users WHERE email LIKE '%OO%';",
    "SELECT * FROM users;",
  ];

  //Make sure to use properly because it doesn't stop the execution
  let hasStopped = false;
  queryString.forEach((query) => {
    connection.query(query, (error, results) => {
      if (error && !hasStopped) {
        hasStopped = true;
        res.status(500).json({ error: errorChecker(error) });
      } else if (query.includes("SELECT") && !hasStopped) {
        hasStopped = true;
        res.status(200).json({ results });
      }
    });
  });
};

export const getUsers = (req: Request, res: Response) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    return res.status(200).json({ results });
  });
};

const checkParams = (x: string): number[] | null => {
  if (x.length === 0) {
    return null;
  }
  if (Number.isInteger(Number(x))) {
    return [Number(x)];
  }
  if (x.includes(",")) {
    const ids = x.split(",");
    const array = ids.filter((id) => Number.isInteger(Number(id)));
    const numbers = array.map((id) => Number(id));
    return numbers;
  }
  return null;
};

export const getUsersById = (req: Request, res: Response) => {
  const { id } = req.params;
  const ids = checkParams(id);
  if (ids === null) {
    return res.status(400).json({ error: "Invalid id" });
  }
  connection.query(`SELECT * FROM users WHERE id IN (${ids.join(",")})`, (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    return res.status(200).json({ results });
  });
};
