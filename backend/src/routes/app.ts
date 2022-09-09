import express from "express";
import { sendWelcome, getUsers, getUsersById, resetUsersTable } from "../controllers";

const appRoute = express.Router();

appRoute.get("/", sendWelcome);
appRoute.post("/reset", resetUsersTable);
appRoute.get("/users", getUsers);
appRoute.get("/users/:id", getUsersById);

export default appRoute;
