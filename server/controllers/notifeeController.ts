import { NextFunction, Request, Response } from 'express';
import { sendSMS } from '../utils/smsNotifee';
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';
import { sendMail } from '../utils/Email';
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient();

export const triggerNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch collaborator and related details
        const collaborator = await prisma.collaborator.findUnique({
            where: {
                id: parseInt(req.body.id),
            },
            select: {
                event: {
                    select: {
                        createdBy: {
                            select: {
                                name: true,
                                phoneNumber: true,
                                email:true
                            },
                        },
                        title: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        phoneNumber: true,
                        email:true
                    },
                },
            },
        });

        if (!collaborator) {
            return next(new AppError("Collaborator not found", 404));
        }

        // Prepare the SMS message
        const { user, event } = collaborator;
        const sms = `Your event "${event?.title}" created by ${event?.createdBy?.name} is about to start in the next 10 minutes.`;

        // Send SMS to collaborator and creator
        try {
            if (user?.phoneNumber) {
                await sendSMS(user.phoneNumber, sms);

                await sendMail({
                    email: user.email,
                    subject: "Reminder",
                    name:user.name,
                    message: sms,
                    from: process.env.EMAIL_ADDRESS,
                });
            }

            if (event?.createdBy?.phoneNumber) {
                await sendSMS(event.createdBy.phoneNumber, sms);

                await sendMail({
                    email: user.email,
                    subject: "Reminder",
                    name:user.name,
                    message: sms,
                    from: process.env.EMAIL_ADDRESS,
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Notifications sent successfully',
            });
        } catch (error) {
            console.error("Error sending SMS:", error);
            return next(new AppError("Error sending SMS", 500));
        }
    } catch (error) {
        next(error);
    }
};
