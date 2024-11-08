import { PrismaClient } from "@prisma/client";
import AppError from "../utils/AppError";
import { NextFunction, Request, Response } from "express";


const prisma = new PrismaClient();

// get all edit sessions
export const getAllEditSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const editSessions = await prisma.editSession.findMany();

        if(editSessions.length < 1){
            return next(new AppError("No edit sessions found", 404));
        }

        res.status(200).json({
            status:'success',
            data: editSessions,
        })
    } catch (error) {
        next(new AppError("Error fetching edit sessions", 500));
    }
};

export const getSingleSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const editSession = await prisma.editSession.findUnique({
            where: { 
                id: parseInt(id) 
            },
            select:{   
                    event: { select: { title: true, description: true }},
                    user: { select: { name: true, email: true}},
                    changes: true
            }
        });

        if(!editSession){
            return next(new AppError("Edit session not found", 404));
        }

        res.status(200).json({
            status:'success',
            data: editSession,
        })
    } catch (error) {
        next(new AppError("Error fetching edit session", 500));
    }
}

// create session
export const startEditSession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId, userId } = req.body;
    
            // Check if the user or event already has an edit session
            const existingSession = await prisma.editSession.findFirst({
                where: {
                    OR: [
                        { eventId: eventId },
                        { userId: userId }
                    ]
                }
            });
    
            if (existingSession) {
                return next(new AppError('An active edit session already exists for this user or event.', 400));
            }
    
            // Create a new edit session
            const editSession = await prisma.editSession.create({
                data: {
                    eventId: eventId,
                    userId: userId,
                    startTime: new Date(),
                    changes: {} // Start with an empty log
                }
            });
    
            res.status(201).json({
                status: 'success',
                data: editSession,
            });
        } catch (error) {
            console.error("Error starting edit session", error);
            return next(new AppError('Failed to start edit session', 500));
        }
    };

export const endEditSession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sessionId } = req.params;
    
            const editSession = await prisma.editSession.update({
                where: { id: parseInt(sessionId) },
                data: {
                    endTime: new Date()
                }
            });
    
            res.status(200).json({
                status: 'success',
                data: editSession,
            });
        } catch (error) {
            console.error("Error ending edit session", error);
            return next(new AppError('Failed to end edit session', 500));
        }
};
export const updateEditSessionChanges = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sessionId } = req.params;
        const { newChanges } = req.body;

        const editSession = await prisma.editSession.update({
            where: { id: parseInt(sessionId) },
            data: {
                changes: newChanges 
            }
        });

        res.status(200).json({
            status: 'success',
            data: editSession,
        });
    } catch (error) {
        console.error("Error updating edit session changes", error);
        return next(new AppError('Failed to update edit session', 500));
    }
};