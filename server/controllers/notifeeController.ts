import { NextFunction, Request, Response } from 'express';
import { sendSMS } from '../utils/smsNotifee';
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

export const  triggerNotifications = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        // Logic to trigger notifications goes here
        //  SMS and Socket.io notifications
        
        // STEP1: Get the collaborator and creator's data from the collaborator Model
        const collaborator = await prisma.collaborator.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            // STEP2: Get the creator user profile data.
            select: {
                event: {
                    select: {
                        createdBy: {
                            select: {
                                name: true,
                                phoneNumber: true
                            }
                        }
                    }
                },
            // STEP3: Get the collaborator user profile data.
                user: {
                    select: {
                        name: true,
                        phoneNumber: true
                    }
                }
            }
        });
        // STEP4: Prepare the SMS message with the necessary data (e.g., collaborator's name, event details, etc.)
        // STEP5: Use the sendSMS function to send the SMS to the collaborator and creator.
        // STEP6: Use Socket.io to notify the collaborator and creator about the new notification.

        const { phoneNumber, message } = req.body;

        try {
            await sendSMS(phoneNumber, message);

            res.status(200).json({
                status:'success',
                message: 'SMS sent successfully'
            })
        } catch (error) {
            console.log(new AppError("Error sending sms", 401))
        }

        res.status(200).json({ message: 'Notifications triggered successfully' });
    } catch (error) {
        next(error);
    }
}