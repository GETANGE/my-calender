import express from 'express'

import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '../controllers/eventController';

const router = express.Router()

router
    .route('/')
            .get(getAllEvents)
            .post(createEvent)

router
    .route('/:id')
            .get(getEvent)
            .patch(updateEvent)
            .delete(deleteEvent)
export default router;