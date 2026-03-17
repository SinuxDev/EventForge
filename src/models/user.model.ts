import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'attendee' | 'organizer' | 'admin';
export type AuthProvider = 'credentials' | 'google' | 'github';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  provider: AuthProvider;
  providerId?: string;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      select: false,
      validate: {
        validator(this: IUser, value: string | undefined) {
          if (this.provider !== 'credentials') {
            return true;
          }
          return Boolean(value && value.length >= 8);
        },
        message: 'Password is required for credential-based users',
      },
    },
    role: {
      type: String,
      enum: ['attendee', 'organizer', 'admin'],
      default: 'attendee',
    },
    avatar: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
    },
    providerId: {
      type: String,
      trim: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ provider: 1, providerId: 1 }, { sparse: true });

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword: string) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
