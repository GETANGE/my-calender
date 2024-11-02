import nodemailer from 'nodemailer';
import AppError from './AppError';

// send mail function
type Options={
    from: string;
    email: string;
    subject: string;
    text: string;
}
export const sendMail =async function (options:Options){
    let transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });
        
        // mail options
        const mailOptions = {
            from: options.from,
            to: options.email,
            subject: options.subject,
            text: options.text
        }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(new AppError('Failed to send email', 500));
            } else {
                resolve({ message: 'Email sent successfully', info });
            }
        });
    });
}