import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { appealRequestService } from '../services/appeal-request.service';
import { ApiResponse } from '../utils/response';

class AppealRequestController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const createdAppeal = await appealRequestService.create(req.body);

    ApiResponse.created(
      res,
      {
        referenceCode: createdAppeal.referenceCode,
        status: createdAppeal.status,
        createdAt: createdAppeal.createdAt,
      },
      'Appeal submitted successfully'
    );
  });
}

export const appealRequestController = new AppealRequestController();
