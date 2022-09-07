import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import appRoute from "./routes/app";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

app.use("/", appRoute);

app.listen(PORT, () => console.log(`⚡Server is running on http://localhost:${PORT}/`));
