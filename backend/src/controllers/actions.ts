import { Request, Response } from "express";
import mysql from "mysql2/promise";
import { formatNumber, saltIt, defaultUsers, convertErrorToString, connectionSettings } from "../helpers";

export const resetUsersTable = async (req: Request, res: Response) => {
  const mappedUsers = defaultUsers
    .map(
      (user) =>
        `('${user.name}',\
        ${user.netWorth ? formatNumber(user.netWorth) : null},\
        '${user.email.toLowerCase()}',\
        '${saltIt(user.password)}',\
        '${user.password}')`
    )
    .join(",");

  const queries = [
    //Remove all users
    "DROP TABLE IF EXISTS users;",
    //Create table
    `CREATE TABLE users(
        id INT AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        netWorth BIGINT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        realPassword VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
      )
      `,
    //Insert users
    `INSERT INTO users(name,netWorth,email,password,realPassword) VALUES ${mappedUsers};`,
    //Show all users
    "SELECT * FROM users;",
  ];

  try {
    const connection = await mysql.createConnection(connectionSettings);
    for (const query of queries) {
      const [rows] = await connection.execute(query);
      if (query.includes("SELECT")) {
        res.status(201).json(rows);
        break;
      }
    }
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: convertErrorToString(error) });
  }
};
