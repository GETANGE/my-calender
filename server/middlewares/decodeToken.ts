import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
export const decodeTokenId = (token:string)=>{
    const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken.id;
}