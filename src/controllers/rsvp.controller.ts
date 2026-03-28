import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/response';
import { rsvpService } from '../services/rsvp.service';

class RsvpController {
  submitRsvp = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await rsvpService.submitRsvp({
      eventId: req.params.id,
      userId: String(req.user._id),
      formResponses: req.body.formResponses,
    });

    ApiResponse.created(res, result, 'RSVP created');
  });

  listMyRsvps = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const rsvps = await rsvpService.listMyRsvps(String(req.user._id));
    ApiResponse.success(res, rsvps, 'RSVPs retrieved successfully');
  });

  cancelRsvp = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await rsvpService.cancelRsvp(req.params.id, String(req.user._id));
    ApiResponse.success(res, result, 'RSVP cancelled successfully');
  });

  getMyTicket = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const ticket = await rsvpService.getMyTicket(req.params.id, String(req.user._id));
    ApiResponse.success(res, ticket, 'Ticket retrieved successfully');
  });
}

export const rsvpController = new RsvpController();
