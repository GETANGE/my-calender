import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express';
import AppError from './AppError';

dotenv.config();

// simulate the token sent from the request.
export const simulateToken = async (req: Request, res: Response, next:NextFunction)=>{
    let token ;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next ( new AppError("You are not logged in", 401));
    }

    return token;
}

export const decodeTokenId = (token:string)=>{

    const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!);
    
    return decodedToken.id;
}