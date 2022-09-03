import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // for parsing application/json (Have no idea if should use BodyParser instead)
app.use(cors());

app.use(morgan("dev"));

import appRoute from "./routes/app";

app.use("/", appRoute);

app.listen(PORT, () => console.log(`⚡Server is running on http://localhost:${PORT}/`));
