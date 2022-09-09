import { Request, Response, NextFunction } from "express";
import mysql from "mysql2";
import connectionSettings from "../helpers/defaultSettings";
import { convertErrorToString } from "../helpers";

export const resetUsersTable = (req: Request, res: Response) => {
  const connection = mysql.createConnection(connectionSettings);
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

  //Make sure to use properly because it doesn't stop the execution
  let hasStopped = false;
  queryString.forEach((query) => {
    connection.query(query, (error, results) => {
      if (error && !hasStopped) {
        hasStopped = true;
        res.status(500).json({ error: convertErrorToString(error) });
      } else if (query.includes("SELECT") && !hasStopped) {
        hasStopped = true;
        res.status(200).json({ results });
      }
    });
  });
  connection.end();
};
