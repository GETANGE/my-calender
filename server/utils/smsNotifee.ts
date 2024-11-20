import AfricasTalking from "africastalking";
import dotenv from 'dotenv';
import AppError from "./AppError";

dotenv.config();

// Initialize AfricasTalking SDK with  API credentials
const credentials:any = {
    apiKey: process.env.AFRICASTALKING_API,
    username: process.env.AFRICASTALKING_USERNAME,
};

const africasTalking = AfricasTalking(credentials);

const sms = africasTalking.SMS;

// send SMS 
export const sendSMS = async (phoneNumber: string, message: string, from?: string) => {
    try {
        const payload: any = {
            to: [phoneNumber],
            message: message,
        };

        if (from) {
            payload.from = from; // Add `from` only if provided
        }

        const response = await sms.send(payload);

        return response;
    } catch (error) {
        console.log("Error sending SMS:", error);
        throw new AppError("Error sending SMS", 403);
    }
};