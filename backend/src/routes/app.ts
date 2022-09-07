import express from "express";
import { getWelcome, getUsers, resetUsersTable, getUsersById } from "../controllers";

const appRoute = express.Router();

appRoute.get("/", getWelcome);
appRoute.get("/reset", resetUsersTable);
appRoute.get("/users", getUsers);
appRoute.get("/users/:id", getUsersById);

export default appRoute;
