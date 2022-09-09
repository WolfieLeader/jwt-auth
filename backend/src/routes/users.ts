import express from "express";
import { getUsers, getUsersById, createUser, loginUser } from "../controllers";

const usersRoute = express.Router();

usersRoute.get("/", getUsers);
usersRoute.post("/", createUser);
usersRoute.get("/:id", getUsersById);
usersRoute.post("/login", loginUser);

export default usersRoute;
