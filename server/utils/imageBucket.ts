import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3
});

export const uploadImage = async (file: any) => {
    try {
        const fileName = `image-${Date.now()}-${file.originalname}`;

        const uploadParams = {
            Bucket: "restless-lake-6993",
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // Construct the image URL
        const imageUrl = `${process.env.AWS_ENDPOINT_URL_S3}/${"restless-lake-6993"}/${fileName}`;
        
        return imageUrl; // Returning the full URL to the image
    } catch (error) {
        console.log("S3 Upload Error:", error);
        return null; 
    }
};