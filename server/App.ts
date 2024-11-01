import express, { Express, NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { connectToDatabase, disconnectDatabase } from "./middlewares/database";
import dotenv from "dotenv";
import AppError from './utils/AppError';
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

import userRoute from './routes/userRoute'

// Middleware
app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRoute)

// Root route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to the My Calendar API",
        version: "1.0.0"
    });
});

// Handling undefined routes
app.use("*", (req: Request, res: Response, next:NextFunction) => {
    return next(new AppError(`This route is not yet defined`, 401));
});

// Global error handler
interface CustomError extends ErrorRequestHandler {
    statusCode?: number;
    status?: string;
    message: string;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    res.status(statusCode).json({
        message: err.message,
        status: status
    });
});

// Start server and connect to database
async function startServer() {
    await connectToDatabase(); // Establish database connection
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
    console.log("\nGracefully shutting down...");
    await disconnectDatabase();
    process.exit(0);
});

startServer().catch(async (error) => {
    console.error("Error starting server:", error);
    await disconnectDatabase();
    process.exit(1);
});