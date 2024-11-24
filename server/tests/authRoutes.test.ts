import express, { Express } from 'express';
import request from 'supertest';
import { PrismaClient, $Enums, User } from '@prisma/client';
import http from 'http';
import userRoute from '../routes/userRoute';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

describe('User Authentication Flow', () => {
  let server: http.Server;
  let app: Express;
  let testUser: User;

  const randomEmail = () => `test-${uuidv4()}@example.com`;

  beforeAll(async () => {
    // Create a new Express app for testing
    app = express();

    // Middleware for request parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Add the user route to the test app
    app.use('/api/v1/users', userRoute);

    // Start the server for testing
    server = app.listen(9000);

    // Ensure a clean state before starting
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    // Create a test user before each test
    testUser = await prisma.user.create({
      data: {
        email: randomEmail(),
        name: 'Test User',
        password: 'test-password',
        phoneNumber: '+1234567890',
        role: $Enums.Role.USER,
        active: $Enums.Active.ACTIVE,
      },
    });
  });

  afterEach(async () => {
    // Clear users after each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Clean up test data and close the server
    await prisma.$disconnect();
    server.close();
  });

  describe('User Registration', () => {
    test('Should create a new user successfully', async () => {
      const response = await request(server)
        .post('/api/v1/users/signup')
        .send({
          email: randomEmail(),
          name: 'Test User',
          password: 'test-password',
          phoneNumber: '+1234567890',
          role: $Enums.Role.USER,
          active: $Enums.Active.ACTIVE,
        });

      expect(response.status).toBe(201);
    });

    test('Should prevent duplicate user registration', async () => {
      const response = await request(server)
        .post('/api/v1/users/signup')
        .send({
          email: testUser.email, // Duplicate email
          name: 'Test User',
          password: 'test-password',
          phoneNumber: '+1234567890',
          role: $Enums.Role.USER,
          active: $Enums.Active.ACTIVE,
        });

      expect(response.status).toBe(409);
    });
  });

  describe('User Login', () => {
    test('Should login successfully with valid credentials', async () => {
      const response = await request(server)
        .post('/api/v1/users/login')
        .send({
          email: testUser.email,
          password: 'test-password',
        });

      expect(response.status).toBe(200);
    });

    test('Should fail login with invalid credentials', async () => {
      const response = await request(server)
        .post('/api/v1/users/login')
        .send({
          email: testUser.email,
          password: 'wrong-password',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('User Management', () => {
    test('Should retrieve all users from the database', async () => {
      const response = await request(server).get('/api/v1/users');
      expect(response.status).toBe(200);
    });
  });

  describe('Forgot Password Flow', () => {
    test('Should send reset password email successfully', async () => {
      const response = await request(server)
        .post('/api/v1/users/forgotPassword')
        .send({
          email: testUser.email,
        });

      expect(response.status).toBe(200);
    });

    test('Should return 400 when email is not provided', async () => {
      const response = await request(server).post('/api/v1/users/forgotPassword').send({});

      expect(response.status).toBe(400);
    });

    test('Should return 404 when user is not found', async () => {
      const response = await request(server)
        .post('/api/v1/users/forgotPassword')
        .send({
          email: 'nonexistent@example.com',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('Password Reset Flow', () => {
    let resetToken: string;
    let hashedToken: string;

    beforeEach(async () => {
      // Generate reset token and hash it
      resetToken = crypto.randomBytes(32).toString('hex');
      hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Update test user with reset token
      await prisma.user.update({
        where: { email: testUser.email },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      });
    });

    test('Should reset password with valid token', async () => {
      const response = await request(server)
        .post(`/api/v1/users/reset-password/${resetToken}`)
        .send({
          password: 'new-password123',
        });

      expect(response.status).toBe(200);
      // Verify password reset
      const updatedUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(updatedUser?.passwordResetToken).toBeNull();
      expect(updatedUser?.passwordResetExpiresAt).toBeNull();
    });

    test('Should fail with invalid token', async () => {
      const response = await request(server)
        .post(`/api/v1/users/reset-password/invalidtoken`)
        .send({
          password: 'new-password123',
        });

      expect(response.status).toBe(401);
    });

    test('Should fail with expired token', async () => {
      await prisma.user.update({
        where: { email: testUser.email },
        data: {
          passwordResetExpiresAt: new Date(Date.now() - 1000),
        },
      });

      const response = await request(server)
        .post(`/api/v1/users/reset-password/${resetToken}`)
        .send({
          password: 'new-password123',
        });

      expect(response.status).toBe(401);
    });

    test('Should fail with missing password', async () => {
      const response = await request(server)
        .post(`/api/v1/users/reset-password/${resetToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    test('Should fail with invalid password format', async () => {
      const response = await request(server)
        .post(`/api/v1/users/reset-password/${resetToken}`)
        .send({
          password: '12345',
        });

      expect(response.status).toBe(400);
    });
  });
});
