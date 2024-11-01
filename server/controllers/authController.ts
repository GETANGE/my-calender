import { Response, Request, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from "../utils/AppError";
import { uploadImage } from './../utils/imageBucket'
import dotenv from 'dotenv'

dotenv.config();

const prisma = new PrismaClient();

// Register a user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const imageUrl = await uploadImage(req.file);
        // console.log("Uploaded Image "+imageUrl);

        // if (!imageUrl) {
        //     return next(new AppError("Error uploading image to S3.", 401));
        // }

        const { name, email, password, passwordConfirm } = req.body as {
            name: string;
            email: string;
            password: string;
            passwordConfirm: string;
        };

        if (password !== passwordConfirm) {
            return next(new AppError("Passwords do not match", 400));
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                name:name,
                email:email,
                // imageUrl:imageUrl,
                password:hashedPassword
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: process.env.EXPIRES });

        res.status(201).json({
            status: "success",
            token: token,
            data: newUser
        });
    } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes('email')) {
            return next(new AppError("Email address already exists", 409));
        }

        console.log(error)
        return next(new AppError("Error creating user", 500));
    }
};