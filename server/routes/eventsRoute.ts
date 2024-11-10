import express from 'express'

import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '../controllers/eventController';
import { protectRoute } from '../controllers/authController';

const router = express.Router()

router
    .route('/')
            .get(getAllEvents)
            .post(protectRoute,createEvent)

router
    .route('/:id')
            .get(getEvent)
            .patch(protectRoute,updateEvent)
            .delete(protectRoute,deleteEvent)
export default router;