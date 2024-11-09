import { NextFunction, Response, Request } from "express";
import AppError from "../utils/AppError";
import { Active, PrismaClient } from '@prisma/client'
import { deleteImage, uploadImage } from "../utils/imageBucket";
import { decodeTokenId, simulateToken } from "../utils/decodeToken";
import ApiFeatures from "../utils/ApiFeatures";

const Prisma = new PrismaClient();

const filteredObj = function(obj: { [x: string]: any; }, ...allowedFields: string[]){
    let newObj:any = {};
    Object.keys(obj).forEach((key)=>{
        if(allowedFields.includes(key)){
            newObj[key] = obj[key];
        }
    })
    return newObj;
}

// get all users from the database
export const getAllUsers = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const features = new ApiFeatures(Prisma.user, req.query)
                        .filtering()
                        .pagination()
                        .limiting()
                        .sorting();

        const users = await features.execute();

        if(users.length < 1){
            return next(new AppError("No users found", 404))
        }

        res.status(200).json({
            status: "success",
            data: users
        })
    } catch (error) {
        console.log(error)
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

// deleting a user completely
export const deleteUser = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if(!user){
            return next(new AppError("User not found", 404))
        }

        await Prisma.user.delete({
            where: {
                id: user.id
            }
        })

        res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        })
    } catch (error) {
        return next(new AppError("Error deleting user", 401))
    }
}

// deactivating a user
export const deactivateUser = async(req:Request, res:Response, next:NextFunction)=>{
    try {

        const token = await simulateToken(req, res, next)

        if(!token ){
            return next(new AppError("Token verification failed", 401));
        }

        const userId = decodeTokenId(token);

        const user = await Prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        });

        if(!user){
            return next(new AppError("User not found", 404))
        }

        await Prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                active: Active.INACTIVE
            }
        })

        res.status(200).json({
            status: "success",
            message: "User deactivated successfully"
        })
    } catch (error) {
        return next(new AppError("Error deactivating user", 401))
    }
}

// activating a user
export const activateUser = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if(!user){
            return next(new AppError("User not found", 404))
        }

        await Prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                active: Active.ACTIVE
            }
        })

        res.status(200).json({
            status: "success",
            message: "User activated successfully"
        })
    } catch (error) {
        return next(new AppError("Error activating user", 401))
    }
}

// updating user details
export const updateUser = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const {password, passwordConfirm} = req.body as {
            password:string;
            passwordConfirm:string;
        }

        if(password || passwordConfirm) {
            return next(new AppError("This route is not defined for password resetting", 401))
        }

        const filteredBody = filteredObj(req.body, 'name', 'email');

        await Prisma.user.update({
            where: {
                id: parseInt(req.user.id)
            },
            data: filteredBody
        })
    } catch (error) {
        console.log("The error is", error);
        return next(new AppError("Error updating user", 401))
    }
}

// updating profile pictures
export const updateProfilePicture = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = await simulateToken(req, res, next);

        if(!token){
            return next(new AppError("Token not verified", 401));
        }

        const decodedId = decodeTokenId(token);

        const user = await Prisma.user.findUnique({
            where: { id: decodedId }
        });

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        // If the user has an existing image, delete it first
        if (user.imageUrl) {
            const oldImageKey:any = user.imageUrl.split('/').pop(); // Get the image key from the URL
            await deleteImage(oldImageKey);
        }

        // Upload the new image
        const { imageUrl } = await uploadImage(req.file) as {
            imageUrl: string;
        };

        if (!imageUrl) {
            return next(new AppError("Error uploading image", 500));
        }

        // Update user's profile with the new image URL
        await Prisma.user.update({
            where: { id: decodedId },
            data: { imageUrl: imageUrl }
        });

        res.status(200).json({
            status: "success",
            message: "Profile picture updated successfully"
        });
    } catch (error: any) {
        console.log("Error updating profile picture", error);
        return next(new AppError("Error updating profile", 500));
    }
};