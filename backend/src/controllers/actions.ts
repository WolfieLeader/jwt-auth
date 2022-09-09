import { Request, Response, NextFunction } from "express";
import mysql from "mysql2/promise";
import connectionSettings from "../helpers/defaultSettings";
import { convertErrorToString } from "../helpers";

const loopThroughQueries = async (res: Response, queries: string[], sqlCondition: string, finalMessage: string) => {
  try {
    const connection = await mysql.createConnection(connectionSettings);
    let hasResults = false;
    for (const query of queries) {
      const [rows] = await connection.execute(query);
      if (query.includes(sqlCondition)) {
        res.status(200).json(rows);
        hasResults = true;
        break;
      }
    }
    if (!hasResults) {
      res.status(200).json({ message: finalMessage });
    }
    connection.end();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
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
    "SELECT * FROM users;",
  ];
  loopThroughQueries(res, queryString, "SELECT", "All users have been reset");
};
