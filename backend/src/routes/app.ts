import express from "express";
import { getSettings, getUsers, getUsersById, resetUsersTable, createUser } from "../controllers";

const appRoute = express.Router();

appRoute.get("/", getSettings);
appRoute.post("/reset", resetUsersTable);
appRoute.get("/users", getUsers);
appRoute.get("/users/:id", getUsersById);
appRoute.post("/users", createUser);

export default appRoute;
