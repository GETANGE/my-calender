import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3
});

export const uploadImage = async (file:any) => {
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
        const imageUrl = `${process.env.AWS_ENDPOINT_URL_S3}/restless-lake-6993/${fileName}`;
        
        return { imageUrl:imageUrl, imageKey: fileName }; // Return URL and key to store in database
    } catch (error) {
        console.log("S3 Upload Error:", error);
        return null; 
    }
};

export const deleteImage = async (imageKey:string)=>{
    try {
        const deleteParams = {
            Bucket: "restless-lake-6993",
            Key: imageKey
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log("Old image deleted successfully")
    } catch (error) {
        console.log("S3 Delete Error:", error);
    }
}