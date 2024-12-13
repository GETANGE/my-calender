import { Response, Request, NextFunction } from "express";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppError from "../utils/AppError";
import { generataEmailValidator, generateResetToken } from "../middlewares/resetToken";
import dotenv from 'dotenv'
import { sendMail } from "../utils/Email";
import { emailQueue } from "../cron-jobs/bullQueues";
import { decodeTokenId, simulateToken } from "../utils/decodeToken";

dotenv.config();

const prisma = new PrismaClient();

// Register a user
export const createUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { name, email, password,role, phoneNumber } = req.body as {
            name: string;
            email: string;
            role: string;
            password: string;
            phoneNumber: string;
        };

        // check if the email already exists
        const userEmail = await prisma.user.findUnique({ where: {
            email: email
        }})

        if(userEmail){
            return next(new AppError("This user already exists in our system", 409))
        }

        // send email validation Token
        const { randomToken, hashedRandomToken, emailTokenExpiresAt } = generataEmailValidator();

        //send email to the newUser
        await emailQueue.add({
            email:email,
            subject: "Email verification",
            from: process.env.EMAIL_ADDRESS,
            name:name,
            message: `Please verify your mail by copying the OTP token below to complete the process`,
            otp:`${randomToken}`
        })

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name:name,
                email:email,
                phoneNumber:phoneNumber,
                role: role as Role,
                password:hashedPassword,
                hashedRandomToken:hashedRandomToken,
                emailTokenExpiresAt:new Date (emailTokenExpiresAt)
            }
        });

        req.newUser= newUser;

        res.status(201).json({
            status: "Email token validation sent",
            data: newUser
        });

    } catch (error: any) {
        console.log(error)
        return next(new AppError("Error creating user", 500));
    }
};

// verify if the email submited is correct
export const verifyEmail = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        // get the token from the params
        const hashedToken:string= crypto.createHash('sha256').update(req.params.emailToken).digest('hex');

        if(!hashedToken){
            return next(new AppError("Please provide a valid OTP verification token", 403))
        }
        
        // find the token in the database
        const newUser = await prisma.user.findFirst({
            where: {
                hashedRandomToken: hashedToken,
                emailTokenExpiresAt:{
                    gt: new Date()
                }
            }
        })

        if(!newUser){
            return next( new AppError("Invalid or expired OTP token", 403))
        }

        // update user data
        await prisma.user.update({
            where: {
                id:newUser.id
            },
            data: {
                hashedRandomToken: null,
                emailTokenExpiresAt: null
            }
        })

        // assign JWT token
        const Token = jwt.sign({id:newUser.id}, process.env.JWT_SECRET!, {expiresIn: process.env.EXPIRES})

        res.status(200).json({
            status:'Email verified successfully',
            token:Token,
            data: newUser
        })
    } catch (error) {
        return next(new AppError("Error verifying email", 500))
    }
}

// login users
export const loginUser = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const { email, password } = req.body as {
            email:string;
            password:string;
        }

        if(!email || !password){
            return next(new AppError("Please provide email and password", 400));
        }

        const user:any = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user){
            return next(new AppError("This user does not exist", 404));
        }

        if(user.active === "INACTIVE"){
            return next(new AppError("Your account is not activated yet.", 403));
        }

        //compare if password match
        const match = await bcrypt.compare(password, user.password);

        if (!match || !user) {
            return next(new AppError("Invalid email or password", 401));
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.EXPIRES });

        res.status(200).json({
            status: "success",
            token: token,
            data: user
        });
    } catch (error) {
        console.log(error)
        return next(new AppError("Error logging in user", 500));
    }
}

// protecting routes
export const protectRoute = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = await simulateToken(req, res, next);

        if(!token){
            return next(new AppError("Token not verified", 401));
        }

        const decodedId = decodeTokenId(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decodedId
            }
        });

        if (!user) {
            return next(new AppError("User no longer exists", 401));
        }

        req.user = user; // the current user is placed on the request and can be accessed anywhere
        next();
    } catch (error) {
        console.log(error)
        return next(new AppError("Invalid token", 401));
    }
};

// Restrict (Authorizations )
export const restrictTo = (...roles:string[])=>{
    return (req: any, res: Response, next: NextFunction) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError("You do not have the required permissions", 403));
        }
        next();
    }
}

// Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const { email } = req.body as {
            email: string;
        }

        if (!email) {
            return next(new AppError("Please provide an email address", 400));
        }

        const user: any = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return next(new AppError("No user found with that email address", 404));
        }

        const { resetToken, passwordResetExpiresAt, passwordResetToken } = generateResetToken();

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordResetToken: passwordResetToken,
                passwordResetExpiresAt: new Date(passwordResetExpiresAt)
            }
        })

        const otpToken:any = resetToken;

        // Send email with reset URL
        try {
            await emailQueue.add({
                email: user.email,
                subject: "Reset your password",
                from: process.env.EMAIL_ADDRESS!,
                name: user.name, 
                message: `You are receiving this email because you (or someone else) have requested a password reset. Please copy the OTP token below to complete the process:`,
                otp:`${otpToken}`
            });
            
            res.status(200).json({
                status: "success",
                message: "Reset password email sent"
            });
        } catch (error) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    passwordResetToken: null,
                    passwordResetExpiresAt: null
                }
            })
        }
    }catch(error){
        console.log(error)
        return next(new AppError("Error sending password reset email", 500));
    }
}

// reset the forgotten password
export const resetPassword = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.otp).digest('hex');

        if(!hashedToken) {
            return next(new AppError("Please provide a valid OTP token", 401));
        }

        let currentDate = new Date ();

        const user: any = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpiresAt : {
                    gt: currentDate
                }
            }

        })

        if(!user){
            return next(new AppError("Invalid or expired OTP token", 401));
        }

        const { password } = req.body as {
            password: string;
        }

        if(!password){
            return next(new AppError("Please provide a new password", 400));
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpiresAt: null
            }
        })

        // generate a token for the user
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.EXPIRES });

        res.status(200).json({
            status: "success",
            token: token,
            message: "Password reset successful"
        });
    } catch (error) {
        console.log("Token verification failed", error)
        return next(new AppError("Token verification failed", 401));
    }
}

// update password
export const updatePassword = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where :{
                id:req.user.id
            }
        });

        if(!user){
            return next(new AppError("User not found", 404));
        }
        const { currentPassword, newPassword } = req.body as {
            currentPassword: string;
            newPassword: string;
        };

        // compare the current password and the new password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if(!isMatch){
            return next(new AppError("Your current password is wrong", 401));
        }

        // hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword
            }
        });
        
        res.status(200).json({
            status: "success",
            message: "Password updated successfully"
        });
    } catch (error) {
        console.log("Error updating password", error);
        return next(new AppError("Error updating password", 500));
    }
}