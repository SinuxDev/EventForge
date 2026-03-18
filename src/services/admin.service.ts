import { FilterQuery } from 'mongoose';
import { IUser, UserRole } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';

interface ListUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  role?: UserRole;
  isSuspended?: boolean;
}

interface UpdateRoleParams {
  actorUserId: string;
  targetUserId: string;
  role: UserRole;
}

interface UpdateSuspensionParams {
  actorUserId: string;
  targetUserId: string;
  isSuspended: boolean;
}

class AdminService {
  async listUsers(params: ListUsersParams) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    const filter: FilterQuery<IUser> = {};

    if (params.role) {
      filter.role = params.role;
    }

    if (typeof params.isSuspended === 'boolean') {
      filter.isSuspended = params.isSuspended;
    }

    if (params.q) {
      const keyword = params.q.trim();
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ];
    }

    return userRepository.findWithPagination(filter, page, limit, { createdAt: -1 });
  }

  async updateUserRole(params: UpdateRoleParams): Promise<IUser> {
    if (params.actorUserId === params.targetUserId) {
      throw new AppError('You cannot change your own role', 400);
    }

    const targetUser = await userRepository.findById(params.targetUserId);

    if (!targetUser) {
      throw new AppError('Target user not found', 404);
    }

    if (targetUser.role === 'admin' && params.role !== 'admin') {
      const adminCount = await userRepository.count({ role: 'admin' } as FilterQuery<IUser>);
      if (adminCount <= 1) {
        throw new AppError('Cannot demote the last admin', 400);
      }
    }

    targetUser.role = params.role;
    await targetUser.save();

    return targetUser;
  }

  async updateUserSuspension(params: UpdateSuspensionParams): Promise<IUser> {
    if (params.actorUserId === params.targetUserId) {
      throw new AppError('You cannot change your own suspension status', 400);
    }

    const targetUser = await userRepository.findById(params.targetUserId);

    if (!targetUser) {
      throw new AppError('Target user not found', 404);
    }

    if (targetUser.role === 'admin' && params.isSuspended) {
      const adminCount = await userRepository.count({ role: 'admin' } as FilterQuery<IUser>);
      if (adminCount <= 1) {
        throw new AppError('Cannot suspend the last admin', 400);
      }
    }

    targetUser.isSuspended = params.isSuspended;
    await targetUser.save();

    return targetUser;
  }
}

export const adminService = new AdminService();
