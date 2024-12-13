import Queue from 'bull';
import dotenv from 'dotenv';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';

dotenv.config();

// Export server adapter for Bull Board
export const serverAdapter = new ExpressAdapter();

const redisOptions = {
    port: 6380,
    host: '127.0.0.1',
    password: process.env.REDIS_PASSWORD,
    db: 0,
};

// Export specific queues
export const emailQueue = new Queue('email', { redis: redisOptions });
export const smsQueue = new Queue('sms', { redis: redisOptions });

// Function to initialize queues and Bull Board
export const BullQueues = () => {
    serverAdapter.setBasePath('/api/v1/admin/queues');

    const queueList = [emailQueue, smsQueue]

    const queues = queueList.map(
        (queue) => new BullAdapter(queue)
    );

    createBullBoard({
        queues,
        serverAdapter:serverAdapter,
    });
};
