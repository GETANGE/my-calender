import express, { Express } from 'express';
import request from 'supertest';
import { PrismaClient, $Enums } from '@prisma/client';
import http from 'http';
import userRoute from '../routes/userRoute';

const prisma = new PrismaClient();

describe('Create and Log in User', () => {
    let server: http.Server;
    let app: Express;
    let createdUserId: number | null = null;

    beforeAll((done) => {
        // Create a new Express app for testing
        app = express();

        // Middleware for testing
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Add the user route to the test app
        app.use('/api/v1/users', userRoute);

        // Start the server on a random port
        server = app.listen(0, () => {
            console.log('Test server started');
            done();
        });
    });

    afterAll(async () => {
        // Shut down the server and disconnect Prisma
        server.close();
        await prisma.$disconnect();
    });

    afterEach(async () => {
        // Clean up created test data
        if (createdUserId) {
            await prisma.user.delete({ where: { id: createdUserId } });
            createdUserId = null;
        }
    });

    test('It should create a new user', async () => {
        const response = await request(server)
            .post('/api/v1/users/signup')
            .send({
                email: 'test@example9.com',
                name: 'Test User',
                password: 'test-password',
                phoneNumber: '+1234567890',
                role: $Enums.Role.USER,
                active: $Enums.Active.ACTIVE,
            });

        expect(response.status).toBe(201);

        // Store the created user's ID for cleanup
        createdUserId = response.body.id;
    });

    test('It should log in a user with valid credentials', async () => {
        const response = await request(server)
            .post('/api/v1/users/login')
            .send({
                email: 'test@example9.com',
                password: 'test-password',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
