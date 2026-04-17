import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  familyId: string;
  revokedAt?: Date;
  replacedByTokenHash?: string;
  expiresAt: Date;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [128, 'tokenHash cannot exceed 128 characters'],
    },
    familyId: {
      type: String,
      required: true,
      trim: true,
      maxlength: [128, 'familyId cannot exceed 128 characters'],
    },
    revokedAt: {
      type: Date,
    },
    replacedByTokenHash: {
      type: String,
      trim: true,
      maxlength: [128, 'replacedByTokenHash cannot exceed 128 characters'],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastUsedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v;
        delete ret.tokenHash;
        delete ret.replacedByTokenHash;
        return ret;
      },
    },
  }
);

refreshTokenSchema.index({ userId: 1, familyId: 1, revokedAt: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
