import { NextFunction, Response, Request } from "express";
import AppError from "../utils/AppError";
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient();

// get all users from the database
export const getAllUsers = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const users = await Prisma.user.findMany();

        if(users.length < 1){
            return next(new AppError("No users found", 404))
        }

        res.status(200).json({
            status: "success",
            data: users
        })
    } catch (error) {
        return next(new AppError("Error getting users", 401))
    }
}

// getting a single user
export const getUser = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if(!user){
            return next(new AppError("User not found", 404))
        }

        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (error) {
        return next(new AppError("Error getting user", 401))
    }
}