import bcrypt from 'bcrypt';

export const hashPassword = async (password:any) => {
    const saltRounds = 10; 
    const salt = await bcrypt.genSalt(saltRounds); // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt); 
    return hashedPassword;
};
