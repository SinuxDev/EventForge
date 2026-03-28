import mongoose, { FilterQuery } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IRsvp, Rsvp } from '../models/rsvp.model';

class RsvpRepository extends BaseRepository<IRsvp> {
  constructor() {
    super(Rsvp);
  }

  async findByEventAndUser(eventId: string, userId: string): Promise<IRsvp | null> {
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    return this.model
      .findOne({
        event: new mongoose.Types.ObjectId(eventId),
        user: new mongoose.Types.ObjectId(userId),
      } as FilterQuery<IRsvp>)
      .exec();
  }

  async countRegisteredByEvent(eventId: string): Promise<number> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return 0;
    }

    return this.model
      .countDocuments({
        event: new mongoose.Types.ObjectId(eventId),
        status: 'registered',
      } as FilterQuery<IRsvp>)
      .exec();
  }

  async countWaitlistedByEvent(eventId: string): Promise<number> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return 0;
    }

    return this.model
      .countDocuments({
        event: new mongoose.Types.ObjectId(eventId),
        status: 'waitlisted',
      } as FilterQuery<IRsvp>)
      .exec();
  }

  async listByUser(userId: string): Promise<IRsvp[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }

    return this.model
      .find({ user: new mongoose.Types.ObjectId(userId) } as FilterQuery<IRsvp>)
      .sort({ createdAt: -1 })
      .populate('event')
      .exec();
  }

  async listByEvent(eventId: string): Promise<IRsvp[]> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return [];
    }

    return this.model
      .find({ event: new mongoose.Types.ObjectId(eventId) } as FilterQuery<IRsvp>)
      .sort({ createdAt: 1 })
      .exec();
  }

  async findByIdOwnedByUser(rsvpId: string, userId: string): Promise<IRsvp | null> {
    if (!mongoose.Types.ObjectId.isValid(rsvpId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    return this.model
      .findOne({
        _id: new mongoose.Types.ObjectId(rsvpId),
        user: new mongoose.Types.ObjectId(userId),
      } as FilterQuery<IRsvp>)
      .exec();
  }

  async findFirstWaitlisted(eventId: string): Promise<IRsvp | null> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return null;
    }

    return this.model
      .findOne({
        event: new mongoose.Types.ObjectId(eventId),
        status: 'waitlisted',
      } as FilterQuery<IRsvp>)
      .sort({ waitlistPosition: 1, createdAt: 1 })
      .exec();
  }
}

export const rsvpRepository = new RsvpRepository();
