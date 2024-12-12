import { PrismaClient } from "@prisma/client";
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config()

const prisma = new PrismaClient();

const redisPayload = {
    port: 6380,
    host: '127.0.0.1',
    password: process.env.REDIS_PASSWORD,
    db: 0
}

const redis = new Redis(redisPayload);

export async function connectToRedis(){
    redis.on('connect', ()=>{
        console.log("Redis connected...")
    })

    redis.on('error', (error)=>{
        console.log('Error connecting to redis:', error)
    })
}

export async function disconnectToRedis(){
    try {
        await redis.quit();
        console.log('Redis disconnected successfully!')
    } catch (error) {
        console.log('Error disconnecting from Redis:', error)
    }
}

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