import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../middlewares/errorHandler';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidation } from '../../validations/auth.validation';

describe('authValidation', () => {
  const app = express();
  app.use(express.json());
  app.post('/validate-login', validateRequest(authValidation.login), (_req, res) => {
    res.status(200).json({ success: true });
  });
  app.use(errorHandler);

  it('fails when email is invalid', async () => {
    const response = await request(app)
      .post('/validate-login')
      .send({ email: 'invalid-email', password: 'Password1' })
      .expect(400);

    expect(response.body.message).toBe('Validation failed');
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'email',
        }),
      ])
    );
  });

  it('passes with valid login payload', async () => {
    await request(app)
      .post('/validate-login')
      .send({ email: 'valid@example.com', password: 'Password1' })
      .expect(200);
  });
});
