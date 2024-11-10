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
export const sendSMS = async (to: string, message: string) => {
    try {
        const response = await sms.send({
            to: [to],
            message: message,
            from: "My-calender"
        });

        return response;
    } catch (error) {
        console.log("Error sending SMS:", error);
        return (new AppError("Error sending SMS:", 403));
    }
};
