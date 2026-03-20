import { FilterQuery } from 'mongoose';
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
}

export const eventRepository = new EventRepository();
