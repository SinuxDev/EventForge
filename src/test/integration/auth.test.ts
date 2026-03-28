import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import { User } from '../../models/user.model';
import './setup';

describe('Auth API integration', () => {
  describe('POST /api/v1/auth/login', () => {
    it('returns 400 when payload is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: '' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Validation failed',
      });
    });

    it('returns 401 for wrong credentials', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1',
        provider: 'credentials',
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'WrongPassword1' })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('returns tokens and user data for valid credentials', async () => {
      await User.create({
        name: 'Valid User',
        email: 'valid@example.com',
        password: 'Password1',
        provider: 'credentials',
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'valid@example.com', password: 'Password1' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user).toMatchObject({
        email: 'valid@example.com',
        role: 'attendee',
      });
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('returns 401 when bearer token is missing', async () => {
      const response = await request(app).get('/api/v1/auth/me').expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Authorization token is required',
      });
    });

    it('returns current user when bearer token is valid', async () => {
      const user = await User.create({
        name: 'Current User',
        email: 'current@example.com',
        password: 'Password1',
        provider: 'credentials',
      });

      const token = jwt.sign(
        {
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET as string,
        {
          subject: String(user._id),
          expiresIn: '1h',
        }
      );

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Current user retrieved successfully',
      });
      expect(response.body.data).toMatchObject({
        email: 'current@example.com',
      });
    });
  });
});
