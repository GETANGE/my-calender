import express from 'express';

import { endEditSession, getAllEditSessions, getSingleSession, startEditSession, updateEditSessionChanges } from '../controllers/editSession';

const router = express.Router();

router
        .route('/')
            .get(getAllEditSessions)
            .post(startEditSession)
router
        .route('/editSession/:id')
            .delete(endEditSession)
            .get(getSingleSession)
            .patch(updateEditSessionChanges);
export default router;