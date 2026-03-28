import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { eventService } from '../services/event.service';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/response';
import { processUploadedFile } from '../middlewares/uploadMiddleware';
import { eventRepository } from '../repositories/event.repository';
import { eventCheckInService } from '../services/event-checkin.service';

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

  getPublicEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.getPublicEvent(req.params.id);
    ApiResponse.success(res, event, 'Event retrieved successfully');
  });

  listPublicEvents = asyncHandler(async (req: Request, res: Response) => {
    const result = await eventService.listPublicEvents({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      query: typeof req.query.q === 'string' ? req.query.q : undefined,
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      attendanceMode:
        req.query.attendanceMode === 'in_person' ||
        req.query.attendanceMode === 'online' ||
        req.query.attendanceMode === 'hybrid'
          ? req.query.attendanceMode
          : undefined,
      startDateFrom:
        typeof req.query.startDateFrom === 'string' ? req.query.startDateFrom : undefined,
      startDateTo: typeof req.query.startDateTo === 'string' ? req.query.startDateTo : undefined,
      sort:
        req.query.sort === 'latest' || req.query.sort === 'soonest' ? req.query.sort : undefined,
    });

    ApiResponse.success(res, result, 'Public events retrieved successfully');
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

  checkInByQr = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await eventCheckInService.checkInByQr({
      eventId: req.params.id,
      actorUserId: String(req.user._id),
      actorRole: req.user.role,
      qrCode: req.body.qrCode,
      source: req.body.source,
    });

    ApiResponse.success(
      res,
      result,
      result.alreadyCheckedIn ? 'Already checked in' : 'Check-in successful'
    );
  });

  undoCheckIn = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await eventCheckInService.undoCheckIn({
      eventId: req.params.id,
      actorUserId: String(req.user._id),
      actorRole: req.user.role,
      ticketId: req.body.ticketId,
    });

    ApiResponse.success(res, result, 'Check-in undone successfully');
  });

  getAttendance = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await eventCheckInService.getAttendance(
      req.params.id,
      String(req.user._id),
      req.user.role
    );

    ApiResponse.success(res, result, 'Attendance retrieved successfully');
  });
}

export const eventController = new EventController();
