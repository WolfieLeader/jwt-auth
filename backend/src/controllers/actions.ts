import { Request, Response } from "express";
import mysql from "mysql2/promise";
import connectionSettings from "../helpers/defaultSettings";
import { convertErrorToString, formatNumber } from "../helpers";
import { saltIt } from "../helpers/encrypt";
import { User } from "../user";

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
  const users: User[] = [
    {
      name: "Mark Zuckerberg",
      netWorth: "57.7B",
      email: "mark@meta.com",
      password: "EvilCorp",
    },
    {
      name: "Bill Gates",
      netWorth: "107.4B",
      email: "bill@outlook.com",
      password: "ImJustRich",
    },
    {
      name: "Elon Musk",
      netWorth: "259.8B",
      email: "elon@tesla.com",
      password: "Mars=Earth2.0",
    },
    {
      name: "Jeff Bezos",
      netWorth: "152.9B",
      email: "jeff@amazon.com",
      password: "IOwnTheWorld",
    },
  ];

  const queryString = [
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
    `INSERT INTO users(name,netWorth,email,password,realPassword) 
    VALUES ${users.map((user) => {
      return `('${user.name}',\
      ${user.netWorth ? formatNumber(user.netWorth) : null},\
      '${user.email}',\
      '${saltIt(user.password)}',\
      '${user.password}')`;
    })}`,
    //Show all users
    "SELECT * FROM users;",
  ];
  loopThroughQueries(res, queryString, "SELECT", "All users have been reset");
};
