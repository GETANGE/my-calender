import express from 'express';

import { 
    createCollaborator, 
    deleteCollaborator, 
    getAllCollaborations, 
    getSingleCollaborator, 
    updateCollaborator 
} from '../controllers/collaborators';

const router = express.Router();

router
    .route('/')
        .get(getAllCollaborations)
        .post(createCollaborator)

router
    .route('/:id')
        .get(getSingleCollaborator)
        .patch(updateCollaborator)
        .delete(deleteCollaborator)
export default router;