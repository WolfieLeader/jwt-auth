import express from "express";
import { getWelcome } from "../controllers";

const appRoute = express.Router();

appRoute.get("/", getWelcome);

export default appRoute;
