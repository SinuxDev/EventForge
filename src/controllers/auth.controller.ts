import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/response';

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.registerWithCredentials(req.body);
    ApiResponse.created(res, result, 'Account created successfully');
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.loginWithCredentials(req.body);
    ApiResponse.success(res, result, 'Login successful');
  });

  socialLogin = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.upsertSocialUser(req.body);
    ApiResponse.success(res, result, 'Social login successful');
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refreshAccessToken({
      refreshToken: req.body.refreshToken,
    });

    ApiResponse.success(res, result, 'Token refreshed successfully');
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout({
      refreshToken: req.body.refreshToken,
    });

    ApiResponse.success(res, null, 'Logged out successfully');
  });

  logoutAll = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    await authService.logoutAll(String(req.user._id));
    ApiResponse.success(res, null, 'Logged out from all sessions successfully');
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = String(req.user._id);
    const user = await authService.getCurrentUser(userId);

    ApiResponse.success(res, user, 'Current user retrieved successfully');
  });

  upgradeRole = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = String(req.user._id);
    const result = await authService.upgradeRole({
      userId,
      role: req.body.role,
    });

    ApiResponse.success(res, result, 'Role upgraded successfully');
  });
}

export const authController = new AuthController();
