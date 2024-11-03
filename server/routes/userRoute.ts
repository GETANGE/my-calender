import express from 'express';
import multer from 'multer';

import { getAllUsers, getUser } from '../controllers/userController';
import { createUser, forgotPassword, loginUser, protectRoute, resetPassword, restrictTo, updatePassword } from '../controllers/authController';
import AppError from '../utils/AppError';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: { fileSize: 200 * 1024 }, // setting limit to 200KB,
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            return cb(new AppError('Only image files are allowed!', 401));
        }else{
            cb(null, true);  // accept the file
        }
        
    }
})

router.get('/',protectRoute,restrictTo("ADMIN"),getAllUsers);
router.post('/signup', upload.single('file'), createUser);
router.post('/login', loginUser)
router.post('/forgotPassword', forgotPassword)
router.patch('/updatePassword', updatePassword)

router.get('/:id', getUser);
router.patch('/resetPassword/:otp',protectRoute, resetPassword)

export default router;