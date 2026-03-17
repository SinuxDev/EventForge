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

  me = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization token is required', 401);
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const { userId } = authService.verifyAccessToken(token);
    const user = await authService.getCurrentUser(userId);

    ApiResponse.success(res, user, 'Current user retrieved successfully');
  });
}

export const authController = new AuthController();
