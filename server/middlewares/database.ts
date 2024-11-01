import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectToDatabase() {
    try {
        console.log("Connecting to the database...");
        await prisma.$connect();
        console.log("Database connection successful!");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

export async function disconnectDatabase() {
    try {
        console.log("Disconnecting from the database...");
        await prisma.$disconnect();
        console.log("Database disconnected successfully!");
    } catch (error) {
        console.error("Error disconnecting from the database:", error);
    }
}