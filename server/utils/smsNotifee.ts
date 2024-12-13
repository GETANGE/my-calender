import AfricasTalking from "africastalking";
import dotenv from 'dotenv';
import AppError from "./AppError";
import { smsQueue } from "../cron-jobs/bullQueues";

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

smsQueue.process(async (job)=>{
    const { phoneNumber, message, from }=job.data;

    try {
        console.log(`Processing sms job for ${phoneNumber}`);

        const result = await sendSMS(
            phoneNumber,
            message,
            from
        );

        console.log(`Sms sent successfully:`, result)
    } catch (error:any) {
        console.log(`Failed to send sms for ${phoneNumber}:`, error.message);
        throw error;
    }
})