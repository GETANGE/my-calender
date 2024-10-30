import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});