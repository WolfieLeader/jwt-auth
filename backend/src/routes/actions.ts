import express from "express";
import { authToken, changeName } from "../controllers";

const actionsRoute = express.Router();

actionsRoute.use(authToken);
actionsRoute.post("/name", changeName);

export default actionsRoute;
