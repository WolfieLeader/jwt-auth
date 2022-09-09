import { User } from "../user";

export const connectionSettings = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "airbnb",
};

export const defaultUsers: User[] = [
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
