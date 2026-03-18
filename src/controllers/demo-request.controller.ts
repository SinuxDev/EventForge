import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { DemoRequest } from '../models/demo-request.model';
import { ApiResponse } from '../utils/response';

class DemoRequestController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const createdDemoRequest = await DemoRequest.create(req.body);

    ApiResponse.created(res, createdDemoRequest, 'Demo request submitted successfully');
  });
}

export const demoRequestController = new DemoRequestController();
