import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { eventService } from '../services/event.service';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/response';
import { processUploadedFile } from '../middlewares/uploadMiddleware';
import { eventRepository } from '../repositories/event.repository';

class EventController {
  createDraft = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const event = await eventService.createDraft({
      organizerId: String(req.user._id),
      payload: req.body,
    });

    ApiResponse.created(res, event, 'Event draft created successfully');
  });

  updateEvent = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const currentEvent = await eventRepository.findByIdRaw(req.params.id);

    if (!currentEvent) {
      throw new AppError('Event not found', 404);
    }

    if (String(currentEvent.organizerId) !== String(req.user._id)) {
      throw new AppError('Forbidden: not your event', 403);
    }

    const event = await eventService.updateEvent({
      organizerId: String(req.user._id),
      eventId: req.params.id,
      payload: req.body,
    });

    ApiResponse.success(res, event, 'Event updated successfully');
  });

  publishEvent = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const event = await eventService.publishEvent({
      organizerId: String(req.user._id),
      eventId: req.params.id,
    });

    ApiResponse.success(res, event, 'Event published successfully');
  });

  getMyEvent = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const event = await eventService.getMyEvent(String(req.user._id), req.params.id);

    ApiResponse.success(res, event, 'Event retrieved successfully');
  });

  listMyEvents = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await eventService.listMyEvents(
      String(req.user._id),
      req.query.page ? Number(req.query.page) : 1,
      req.query.limit ? Number(req.query.limit) : 20
    );

    ApiResponse.success(res, result, 'Events retrieved successfully');
  });

  uploadCover = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.file) {
      throw new AppError('No image uploaded', 400);
    }

    const fileInfo = processUploadedFile(req.file);

    ApiResponse.success(
      res,
      {
        url: fileInfo.url,
        fileName: fileInfo.filename,
      },
      'Event cover uploaded successfully'
    );
  });
}

export const eventController = new EventController();
