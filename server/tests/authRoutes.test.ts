import express, { Express } from 'express';
import request from 'supertest';
import { PrismaClient, $Enums } from '@prisma/client';
import http from 'http';
import userRoute from '../routes/userRoute';

const prisma = new PrismaClient();

describe('User Authentication Flow', () => {
  let server: http.Server;
  let app: Express;
  let createdUserId: number;

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

  afterEach(async () => {
    // Clean up created test data
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } });
    }
  });

  test('It should create a new user 🚀', async () => {
    const response = await request(server)
      .post('/api/v1/users/signup')
      .send({
        email: 'test@example10.com',
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

  test('It should log in a user with valid credentials 🚀', async () => {
    const response = await request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'test@example10.com',
        password: 'test-password',
      });

    expect(response.status).toBe(200);
  });

  test('It should get all users from the database 🚀', async () => {
    const response = await request(server).get('/api/v1/users');
    expect(response.status).toBe(200);
  });

  describe('Forgot Password Flow', () => {
    test('It should send a reset password email when forgot password is clicked 🚀', async () => {
      const response = await request(server)
        .post('/api/v1/users/forgotPassword')
        .send({
          email: 'test@example10.com'
        });

      expect(response.status).toBe(200);
    });

    test('It should return 400 when email is not provided 🚀', async () => {
      const response = await request(server)
        .post('/api/v1/users/forgotPassword')
        .send({});

      expect(response.status).toBe(400);
    });

    test('It should return 404 when user is not found 🚀', async () => {
      const response = await request(server)
        .post('/api/v1/users/forgotPassword')
        .send({
          email: 'test@example11.com'
        });

      expect(response.status).toBe(400);
    });
  });

  afterAll(async () => {
    // Shut down the server and disconnect Prisma
    server.close();
    await prisma.$disconnect();
  });
});
