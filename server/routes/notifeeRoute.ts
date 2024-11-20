import express from 'express';

import { triggerNotifications } from '../controllers/notifeeController';

const router = express.Router();

router.route('/').post(triggerNotifications)

export default router;