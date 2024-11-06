import { Response, Request, NextFunction } from "express";
import { PrismaClient, Role2 } from "@prisma/client";
import AppError from "../utils/AppError";

const prisma = new PrismaClient();

export const getAllCollaborations = async (req: Request, res: Response, next:NextFunction)=>{
    try {
        const collaborators = await prisma.collaborator.findMany({
            select: {
                event: {
                    select: {
                        title: true,
                        description: true,
                        startTime: true,
                        endTime: true,
                        createdBy: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });

        if(collaborators.length < 1){
            return next(new AppError("No collaborators found", 404));
        }

        res.status(200).json({
            status:'success',
            data: collaborators,
        })
    } catch (error) {
        console.log("Error getting all collaborators"+error);
        return next(new AppError("Error getting all collaborators", 404));
    }
}

export const getSingleCollaborator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const collaborator = await prisma.collaborator.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                event: {
                    select: {
                        title: true,
                        description: true,
                        startTime: true,
                        endTime: true,
                        createdBy: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                role: true
            }
        });

        if(!collaborator){
            return next(new AppError("Collaborator not found", 404));
        }

        res.status(200).json({
            status:'success',
            data: collaborator,
        })
    } catch (error) {
        console.log("Error getting single collaborator"+error);
        return next(new AppError("Error getting single collaborator", 404));
    }
}

export const createCollaborator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId , eventId, role } = req.body;

        if(!userId ||!eventId ){
            return next(new AppError("Missing required fields", 400));
        }

        const newCollaborator = await prisma.collaborator.create({
            data: {
                userId: parseInt(userId),
                eventId: parseInt(eventId),
                role: role as Role2
            }
        })

        res.status(201).json({
            status:'success',
            data: newCollaborator,
        })
    } catch (error) {
        console.log("Error creating collaborator"+error);
        return next(new AppError("Error creating collaborator", 500));
    }
}

export const updateCollaborator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if(!req.body){
            return next(new AppError("No data provided", 400));
        }
        
        const updatedCollaborator = await prisma.collaborator.update({
            where: {
                id: parseInt(id)
            },
            data: req.body
        })

        res.status(200).json({
            status:'success',
            data: updatedCollaborator,
        })
    } catch (error) {
        console.log("Error updating collaborator"+error);
        return next(new AppError("Error updating collaborator", 500));
    }
}

export const deleteCollaborator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const deletedCollaborator = await prisma.collaborator.delete({
            where: {
                id: parseInt(id)
            }
        });

        if(!deletedCollaborator){
            return next(new AppError("Collaborator not found", 404));
        }

        res.status(200).json({
            status:'success',
            message: 'Collaborator deleted successfully'
        })
    } catch (error) {
        console.log("Error deleting collaborator"+error);
        return next(new AppError("Error deleting collaborator", 500));
    }
}