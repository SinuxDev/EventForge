import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import { User } from '../../models/user.model';
import './setup';

describe('Auth API integration', () => {
  describe('POST /api/v1/auth/register', () => {
    it('preserves user-entered email format while trimming spaces', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Email Preserve User',
          email: '  Aung.Yee+events@gmail.com  ',
          password: 'Password1',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toMatchObject({
        email: 'Aung.Yee+events@gmail.com',
      });

      const savedUser = await User.findOne({ email: 'Aung.Yee+events@gmail.com' })
        .select('+emailCanonical')
        .lean();

      expect(savedUser).toBeTruthy();
      expect(savedUser?.emailCanonical).toBe('aung.yee+events@gmail.com');
    });
  });

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

    it('authenticates case-insensitively using canonical email', async () => {
      await User.create({
        name: 'Case User',
        email: 'Aung.Yee@gmail.com',
        password: 'Password1',
        provider: 'credentials',
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'aung.yee@gmail.com', password: 'Password1' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toMatchObject({
        email: 'Aung.Yee@gmail.com',
      });
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('refreshes tokens and invalidates previous refresh token', async () => {
      await User.create({
        name: 'Refresh User',
        email: 'refresh@example.com',
        password: 'Password1',
        provider: 'credentials',
      });

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'refresh@example.com', password: 'Password1' })
        .expect(200);

      const oldRefreshToken = loginResponse.body.data.refreshToken as string;

      const refreshResponse = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(200);

      expect(refreshResponse.body.success).toBe(true);
      expect(refreshResponse.body.data).toHaveProperty('accessToken');
      expect(refreshResponse.body.data).toHaveProperty('refreshToken');
      expect(refreshResponse.body.data.refreshToken).not.toBe(oldRefreshToken);

      await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('revokes refresh token and prevents further refresh', async () => {
      await User.create({
        name: 'Logout User',
        email: 'logout@example.com',
        password: 'Password1',
        provider: 'credentials',
      });

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'logout@example.com', password: 'Password1' })
        .expect(200);

      const refreshToken = loginResponse.body.data.refreshToken as string;

      await request(app).post('/api/v1/auth/logout').send({ refreshToken }).expect(200);

      await request(app).post('/api/v1/auth/refresh').send({ refreshToken }).expect(401);
    });
  });

  describe('POST /api/v1/auth/logout-all', () => {
    it('revokes all active refresh tokens for the authenticated user', async () => {
      await User.create({
        name: 'Logout All User',
        email: 'logout-all@example.com',
        password: 'Password1',
        provider: 'credentials',
      });

      const firstLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'logout-all@example.com', password: 'Password1' })
        .expect(200);

      const secondLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'logout-all@example.com', password: 'Password1' })
        .expect(200);

      const accessToken = firstLogin.body.data.accessToken as string;
      const refreshTokenOne = firstLogin.body.data.refreshToken as string;
      const refreshTokenTwo = secondLogin.body.data.refreshToken as string;

      await request(app)
        .post('/api/v1/auth/logout-all')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200);

      await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: refreshTokenOne })
        .expect(401);

      await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: refreshTokenTwo })
        .expect(401);
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
