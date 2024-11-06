import { Response, Request, NextFunction } from "express";
import AppError from "../utils/AppError";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "../utils/Email";
import { decodeTokenId } from "../middlewares/decodeToken";

const prisma = new PrismaClient();

// get all events
export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await prisma.event.findMany();

        if(events.length < 1){
            return next(new AppError("No events found", 404));
        }

        res.status(200).json({
            status: "success",
            data: events,
        });
    } catch (error) {
        next(new AppError("Failed to get events", 500));
    }
};

//get single event
export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { 
                id: parseInt(id) 
            },
            include:{
                createdBy: {
                    select: {
                        name: true,
                        email: true,
                        imageUrl: true
                    },
                },
                collaborators: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                imageUrl: true
                            },
                        },
                        role: true
                    },
                },
                editSessions: true
            }
        });

        if(!event){
            return next(new AppError("Event not found", 404));
        }

        res.status(200).json({
            status: 'success',
            data: event,
        });
    } catch (error) {
        console.log("Error getting event", error);
        return next(new AppError("Failed to get event", 500));
    }
};

// create new event
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token; // mutated

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError("You are not logged in", 401));
        }

        const eventCreatorId = decodeTokenId(token);
        
        const { title, description, startTime, endTime, collaborators, editSessions } = req.body;

        let createdBy = eventCreatorId;

        // Create the event
        const newEvent = await prisma.event.create({
            data: {
                title:title,
                description: description,
                startTime: startTime,
                endTime : endTime,
                createdBy: {
                    connect: { id: createdBy }
                },
                collaborators: Array.isArray(collaborators) && collaborators.length > 0
                    ? { connect: collaborators.map((collaboratorId: number) => ({ id: collaboratorId })) }
                    : undefined,
                editSessions: Array.isArray(editSessions) && editSessions.length > 0
                    ? { connect: editSessions.map((editSessionId: number) => ({ id: editSessionId }))}
                    : undefined,
            }
        });

        // Fetch creator's email address
        const creator = await prisma.user.findUnique({
            where: { id: createdBy },
            select: {
                email: true,
            },
        });

        // Send notifications to each collaborator only if collaborators is a defined array
        if (Array.isArray(collaborators) && collaborators.length > 0 && creator) {
            try {
                for (const userId of collaborators) {
                    const user = await prisma.collaborator.findUnique({
                        where: { id: userId },
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    });

                    if (user) {
                        await sendMail({
                            email: user.user.email,
                            subject: "New Event Created",
                            text: `A new event "${title}" has been created by user ${creator.email}.`,
                            from: creator.email,
                        });
                    }
                }
            } catch (error) {
                console.log("Error sending mail notification", error);
            }
        }

        res.status(201).json({
            status: 'success',
            data: newEvent,
        });
    } catch (error) {
        console.log("Error creating event", error);
        return next(new AppError("Failed to create event", 500));
    }
};

// delete event
export const deleteEvent = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const { id } = req.params;

        const deletedEvent = await prisma.event.delete({
            where: {
                id: parseInt(id)
            }
        });

        if(!deletedEvent){
            return next(new AppError("Event not found", 404));
        }

        res.status(200).json({
            status:'success',
            data: deletedEvent,
        });
    } catch (error) {
        console.log("Error deleting event", error);
        return next(new AppError("Failed to delete event", 500));
    }
}

// update event
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const eventId = await prisma.event.findUnique({
            where: { 
                id: parseInt(id) 
            }
        })

        if(!eventId){
            return next(new AppError("Event not found", 404));
        }

        const updatedEvent = await prisma.event.update({
            where: {
                id: parseInt(id)
            },
            data: req.body
        })

        res.status(200).json({
            status:'success',
            data: updatedEvent,
        });
    }catch(error){
        console.log("Error updating event", error);
        return next(new AppError("Failed to update event", 500));
    }
}