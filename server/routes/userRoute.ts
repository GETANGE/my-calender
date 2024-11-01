import express from 'express';
import multer from 'multer';

import { getAllUsers, getUser } from '../controllers/userController';
import { createUser } from '../controllers/authController';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage })

router.get('/', getAllUsers);
router.post('/signup',upload.single('file'), createUser);
router.get('/:id', getUser);

export default router;