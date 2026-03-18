import mongoose, { Document, Schema } from 'mongoose';

type DemoSource = 'public-website' | 'authenticated-website';

export interface IDemoRequest extends Document {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  teamSize: string;
  useCase: string;
  source: DemoSource;
  createdAt: Date;
  updatedAt: Date;
}

const demoRequestSchema = new Schema<IDemoRequest>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    workEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    company: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    teamSize: {
      type: String,
      required: true,
      trim: true,
    },
    useCase: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 180,
    },
    source: {
      type: String,
      enum: ['public-website', 'authenticated-website'],
      default: 'public-website',
    },
  },
  {
    timestamps: true,
  }
);

export const DemoRequest = mongoose.model<IDemoRequest>('DemoRequest', demoRequestSchema);
