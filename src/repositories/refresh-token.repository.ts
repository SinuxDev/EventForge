import mongoose from 'mongoose';
import { BaseRepository } from './base.repository';
import { IRefreshToken, RefreshToken } from '../models/refresh-token.model';

interface CreateRefreshTokenInput {
  userId: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
}

class RefreshTokenRepository extends BaseRepository<IRefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  async createToken(input: CreateRefreshTokenInput): Promise<IRefreshToken> {
    return this.create({
      userId: new mongoose.Types.ObjectId(input.userId),
      tokenHash: input.tokenHash,
      familyId: input.familyId,
      expiresAt: input.expiresAt,
    } as Partial<IRefreshToken>);
  }

  async findActiveByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return this.model
      .findOne({
        tokenHash,
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      })
      .exec();
  }

  async findByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return this.model.findOne({ tokenHash }).exec();
  }

  async revokeByHash(tokenHash: string, replacedByTokenHash?: string): Promise<void> {
    await this.model
      .updateOne(
        { tokenHash, revokedAt: { $exists: false } },
        {
          $set: {
            revokedAt: new Date(),
            ...(replacedByTokenHash ? { replacedByTokenHash } : {}),
          },
        }
      )
      .exec();
  }

  async revokeFamily(familyId: string): Promise<void> {
    await this.model
      .updateMany(
        { familyId, revokedAt: { $exists: false } },
        {
          $set: {
            revokedAt: new Date(),
          },
        }
      )
      .exec();
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return;
    }

    await this.model
      .updateMany(
        {
          userId: new mongoose.Types.ObjectId(userId),
          revokedAt: { $exists: false },
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        }
      )
      .exec();
  }

  async markUsed(tokenHash: string): Promise<void> {
    await this.model.updateOne({ tokenHash }, { $set: { lastUsedAt: new Date() } }).exec();
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
