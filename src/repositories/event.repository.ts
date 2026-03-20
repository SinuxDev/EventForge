import mongoose, { FilterQuery } from 'mongoose';
import { BaseRepository } from './base.repository';
import { Event, IEvent } from '../models/event.model';

class EventRepository extends BaseRepository<IEvent> {
  constructor() {
    super(Event);
  }

  async findOwnedByUser(eventId: string, organizerId: string): Promise<IEvent | null> {
    return this.model
      .findOne({
        _id: eventId,
        organizerId,
      } as FilterQuery<IEvent>)
      .exec();
  }

  async findMine(organizerId: string, page: number, limit: number) {
    return this.findWithPagination({ organizerId } as FilterQuery<IEvent>, page, limit, {
      createdAt: -1,
    });
  }

  async findOverlappingEvent(params: {
    organizerId: string;
    startDateTime: Date;
    endDateTime: Date;
    excludeEventId?: string;
  }): Promise<IEvent | null> {
    const organizerObjectId = new mongoose.Types.ObjectId(params.organizerId);

    const query: FilterQuery<IEvent> = {
      organizerId: organizerObjectId,
      status: { $ne: 'cancelled' },
      startDateTime: { $lt: params.endDateTime },
      endDateTime: { $gt: params.startDateTime },
    };

    if (params.excludeEventId && mongoose.Types.ObjectId.isValid(params.excludeEventId)) {
      query._id = {
        $ne: new mongoose.Types.ObjectId(params.excludeEventId),
      } as unknown as IEvent['_id'];
    }

    return this.model.findOne(query).exec();
  }

  async findByIdRaw(eventId: string): Promise<IEvent | null> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return null;
    }

    return this.model.findById(new mongoose.Types.ObjectId(eventId)).exec();
  }
}

export const eventRepository = new EventRepository();
