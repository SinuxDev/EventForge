import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { adminService } from '../services/admin.service';
import { ApiResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

class AdminController {
  listUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.listUsers({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      q: req.query.q ? String(req.query.q) : undefined,
      role: req.query.role as 'attendee' | 'organizer' | 'admin' | undefined,
      isSuspended:
        typeof req.query.isSuspended === 'string' ? req.query.isSuspended === 'true' : undefined,
    });

    ApiResponse.success(res, result, 'Users retrieved successfully');
  });

  updateRole = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const updatedUser = await adminService.updateUserRole({
      actorUserId: String(req.user._id),
      targetUserId: req.params.id,
      role: req.body.role,
      reason: String(req.body.reason),
    });

    ApiResponse.success(res, updatedUser, 'User role updated successfully');
  });

  updateSuspension = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const updatedUser = await adminService.updateUserSuspension({
      actorUserId: String(req.user._id),
      targetUserId: req.params.id,
      isSuspended: req.body.isSuspended,
      reason: String(req.body.reason),
    });

    ApiResponse.success(
      res,
      updatedUser,
      req.body.isSuspended ? 'User suspended successfully' : 'User unsuspended successfully'
    );
  });

  listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.listAuditLogs({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      action:
        req.query.action === 'user.role.updated' ||
        req.query.action === 'user.suspension.updated' ||
        req.query.action === 'compliance.case.created' ||
        req.query.action === 'compliance.case.status.updated' ||
        req.query.action === 'admin.email.campaign.sent'
          ? req.query.action
          : undefined,
      targetUserId: typeof req.query.targetUserId === 'string' ? req.query.targetUserId : undefined,
      actorUserId: typeof req.query.actorUserId === 'string' ? req.query.actorUserId : undefined,
    });

    ApiResponse.success(res, result, 'Admin audit logs retrieved successfully');
  });
}

export const adminController = new AdminController();
