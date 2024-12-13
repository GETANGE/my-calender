// import { emailQueue } from './bullQueues';
// import { sendMail } from './../utils/Email';

// emailQueue.process(async (job) => {
//     try {
//         const { from, email, subject, name, message, otp } = job.data;

//         console.log('Processing job:', job.data); // Log job details

//         // Use Nodemailer to send the email
//         const result = await sendMail({ 
//             from, 
//             email, 
//             subject, 
//             name,
//             message, 
//             otp 
//         });
//         console.log(`Email sent to ${email}:`, result);
//     } catch (error:any) {
//         console.error(`Failed to send email to ${job.data.email}:`, error.message);
//         throw error; // Mark the job as failed
//     }
// });
