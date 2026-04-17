import mongoose, { FilterQuery, QueryOptions } from 'mongoose';
import { BaseRepository } from './base.repository';
import { ITicket, Ticket } from '../models/ticket.model';

class TicketRepository extends BaseRepository<ITicket> {
  constructor() {
    super(Ticket);
  }

  async findByRsvpId(rsvpId: string, options: QueryOptions = {}): Promise<ITicket | null> {
    if (!mongoose.Types.ObjectId.isValid(rsvpId)) {
      return null;
    }

    return this.model
      .findOne({ rsvp: new mongoose.Types.ObjectId(rsvpId) } as FilterQuery<ITicket>)
      .setOptions(options)
      .exec();
  }

  async countCheckedInByEvent(eventId: string, options: QueryOptions = {}): Promise<number> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return 0;
    }

    return this.model
      .countDocuments({
        event: new mongoose.Types.ObjectId(eventId),
        isCheckedIn: true,
      } as FilterQuery<ITicket>)
      .setOptions(options)
      .exec();
  }

  async findByQrCodeAndEvent(
    eventId: string,
    qrCode: string,
    options: QueryOptions = {}
  ): Promise<ITicket | null> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return null;
    }

    return this.model
      .findOne({
        event: new mongoose.Types.ObjectId(eventId),
        qrCode,
      } as FilterQuery<ITicket>)
      .setOptions(options)
      .exec();
  }

  async findByShortCodeAndEvent(
    eventId: string,
    shortCode: string,
    options: QueryOptions = {}
  ): Promise<ITicket | null> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return null;
    }

    return this.model
      .findOne({
        event: new mongoose.Types.ObjectId(eventId),
        shortCode: shortCode.trim().toUpperCase(),
      } as FilterQuery<ITicket>)
      .setOptions(options)
      .exec();
  }

  async findByIdAndEvent(
    ticketId: string,
    eventId: string,
    options: QueryOptions = {}
  ): Promise<ITicket | null> {
    if (!mongoose.Types.ObjectId.isValid(ticketId) || !mongoose.Types.ObjectId.isValid(eventId)) {
      return null;
    }

    return this.model
      .findOne({
        _id: new mongoose.Types.ObjectId(ticketId),
        event: new mongoose.Types.ObjectId(eventId),
      } as FilterQuery<ITicket>)
      .setOptions(options)
      .exec();
  }
}

export const ticketRepository = new TicketRepository();
