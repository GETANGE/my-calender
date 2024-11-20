import nodemailer from 'nodemailer';
import AppError from './AppError';
import dotenv from 'dotenv'

dotenv.config();

// Options for the sendMail function
type Options = {
    from: any;
    email: string;
    subject: string;
    name: string; 
    message: string;
    otp?:any
};

// Email template generator
const emailTemplate = (name: string, message: string, otp?: number) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendery</title>
</head>
<body style="font-family: Arial, sans-serif; width: 100%;">
    <section style="width: 100%; background-color: #EAF0F3; padding: 40px; margin: 0 auto; max-width: 600px;">
        <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Calendery</h1>
        <p style="font-size: 16px; margin: 10px 0;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 14px; margin: 10px 0;">${message}</p>
        ${otp ? `<p style="font-size: 16px; margin: 10px 0;">Otp token: <strong>${otp}</strong></p>` : ''}
        <p style="font-size: 14px; margin: 10px 0;">Thank you for using Calendery!</p>
        <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 14px;">Your personal calendar, tailored just for you.</p>
            <p style="font-size: 14px; font-weight: bold;">Calendery</p>
        </div>
    </section>
</body>
</html>
`;

// Function to send an email
export const sendMail = async (options: Options) => {
    try {
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER || '',
                pass: process.env.MAILTRAP_PASSWORD || ''
            }
        });

        // Mail options
        const mailOptions = {
            from: options.from,
            to: options.email,
            subject: options.subject,
            html: emailTemplate(options.name, options.message, options?.otp),
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        // Return success message and info
        return { message: 'Email sent successfully', info };
    } catch (error) {
        return new AppError(`Failed to send email: ${(error as Error).message}`, 500);
    }
};
