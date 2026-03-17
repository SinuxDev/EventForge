import { FilterQuery } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IUser, User } from '../models/user.model';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }

  async findByProvider(provider: string, providerId: string): Promise<IUser | null> {
    return this.model.findOne({ provider, providerId }).exec();
  }

  async findOneWithPassword(filter: FilterQuery<IUser>): Promise<IUser | null> {
    return this.model.findOne(filter).select('+password').exec();
  }
}

export const userRepository = new UserRepository();
