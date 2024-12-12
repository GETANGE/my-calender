import { Response, Request, NextFunction } from "express";
import AppError from "../utils/AppError";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "../utils/Email";
import ApiFeatures from "../utils/ApiFeatures";
import Redis from "ioredis";

const prisma = new PrismaClient();

const redis = new Redis();

// get all events
export const getAllEvents = async (req: Request, res: Response, next:NextFunction) => {
    try {
        redis.get("AllEvents", (err, result)=>{
            if(err){
                console.log(err)
            }
        })

        const features = new ApiFeatures(prisma.event, req.query)
            .filtering()
            .sorting()
            .limiting()
            .pagination();

        const events = await features.execute();

        if(events.length < 1){
            return next(new AppError("No events found", 404));
        }

        
        res.status(200).json({
            status: 'success',
            results: events.length,
            data: {
                events
            }
        });
    } catch (error) {
        return next(new AppError("Error getting events", 500));
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
export const createEvent = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { title, description, startTime, endTime, collaborators, editSessions } = req.body;

        let createdBy = req.user.id; // this user is already logged in and is on the request.

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
            select: { email: true},
        });

        // Send notifications to each collaborator only if collaborators is a defined array
        if (Array.isArray(collaborators) && collaborators.length > 0 && creator) {
            try {
                for (const userId of collaborators) {
                    const user = await prisma.collaborator.findUnique({
                        where: { id: userId },
                        include: { user: { select: { name: true, email: true}}},
                    });

                    if (user) {
                        await sendMail({
                            email: user.user.email,
                            subject: "New Event Created",
                            name:user.user.name,
                            message: `A new event "${title}" has been created by user ${creator.email}.`,
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
/**
 * The one created the event is the one allowed to delete it
 */
export const deleteEvent = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Fetch the event along with its creator's ID to validate authorization
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: {
                createdBy: { select: { id: true } }
            }
        });

        // Validate if the event exists
        if (!event) {
            return next(new AppError("Event not found", 404));
        }

        // Check if the logged-in user is the creator of the event
        if (event.createdBy.id !== userId) {
            return next(new AppError("You are not authorized to delete this event", 403));
        }

        // Delete the event if authorization passes
        await prisma.event.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            status: 'Event deleted successfully',
            data: null
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        return next(new AppError("Failed to delete event", 500));
    }
};

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
            data: {
                title:req.body.title,
                description:req.body.description,
                startTime:req.body.startTime,
                endTime :req.body.endTime,
            }
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