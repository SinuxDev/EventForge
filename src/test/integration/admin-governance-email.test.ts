import request from 'supertest';
import app from '../../app';
import { User } from '../../models/user.model';
import { emailService } from '../../services/email.service';
import './setup';

describe('Admin governance email integration', () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'ChangeMe123';

  async function loginAsAdmin(): Promise<string> {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(200);

    return response.body.data.accessToken as string;
  }

  beforeEach(async () => {
    await User.create({
      name: 'Platform Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      provider: 'credentials',
    });
  });

  it('sends a role change email after updating a user role', async () => {
    const sendTextEmailSpy = jest
      .spyOn(emailService, 'sendTextEmail')
      .mockResolvedValue({ messageId: 'role-email-message-id' });

    const targetUser = await User.create({
      name: 'Role Target',
      email: 'role-target@example.com',
      password: 'Password1',
      role: 'attendee',
      provider: 'credentials',
    });

    const accessToken = await loginAsAdmin();

    const response = await request(app)
      .patch(`/api/v1/admin/users/${String(targetUser._id)}/role`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        role: 'organizer',
        reason: 'Promoted to organizer for event management',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'User role updated successfully',
      data: {
        email: 'role-target@example.com',
        role: 'organizer',
      },
    });

    expect(sendTextEmailSpy).toHaveBeenCalledTimes(1);
    expect(sendTextEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'role-target@example.com',
        subject: 'Your EventForge role was updated to Organizer',
      })
    );

    const updatedUser = await User.findById(targetUser._id).lean();
    expect(updatedUser?.role).toBe('organizer');
  });

  it('sends a suspension email after suspending a user', async () => {
    const sendTextEmailSpy = jest
      .spyOn(emailService, 'sendTextEmail')
      .mockResolvedValue({ messageId: 'suspension-email-message-id' });

    const targetUser = await User.create({
      name: 'Suspension Target',
      email: 'suspension-target@example.com',
      password: 'Password1',
      role: 'attendee',
      provider: 'credentials',
    });

    const accessToken = await loginAsAdmin();

    const response = await request(app)
      .patch(`/api/v1/admin/users/${String(targetUser._id)}/suspension`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        isSuspended: true,
        reason: 'Suspended for repeated policy violations',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'User suspended successfully',
      data: {
        email: 'suspension-target@example.com',
        isSuspended: true,
      },
    });

    expect(sendTextEmailSpy).toHaveBeenCalledTimes(1);
    expect(sendTextEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'suspension-target@example.com',
        subject: 'Your EventForge account has been suspended',
      })
    );

    const updatedUser = await User.findById(targetUser._id).lean();
    expect(updatedUser?.isSuspended).toBe(true);
  });

  it('sends a reactivation email after unsuspending a user', async () => {
    const sendTextEmailSpy = jest
      .spyOn(emailService, 'sendTextEmail')
      .mockResolvedValue({ messageId: 'reactivation-email-message-id' });

    const targetUser = await User.create({
      name: 'Reactivated User',
      email: 'reactivated@example.com',
      password: 'Password1',
      role: 'attendee',
      provider: 'credentials',
      isSuspended: true,
    });

    const accessToken = await loginAsAdmin();

    const response = await request(app)
      .patch(`/api/v1/admin/users/${String(targetUser._id)}/suspension`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        isSuspended: false,
        reason: 'Appeal approved after review',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'User unsuspended successfully',
      data: {
        email: 'reactivated@example.com',
        isSuspended: false,
      },
    });

    expect(sendTextEmailSpy).toHaveBeenCalledTimes(1);
    expect(sendTextEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'reactivated@example.com',
        subject: 'Your EventForge account has been reactivated',
      })
    );

    const updatedUser = await User.findById(targetUser._id).lean();
    expect(updatedUser?.isSuspended).toBe(false);
  });
});
