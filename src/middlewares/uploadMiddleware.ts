import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export interface UploadedFileInfo {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  fieldName?: string;
}

export const processUploadedFile = (file: Express.Multer.File): UploadedFileInfo => {
  const fileUrl =
    (file as Express.Multer.File & { location?: string }).location || `/uploads/${file.filename}`;

  return {
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: fileUrl,
    fieldName: file.fieldname,
  };
};

export const processUploadedFiles = (files: Express.Multer.File[]): UploadedFileInfo[] => {
  return files.map(processUploadedFile);
};

export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) {
    throw new AppError('No file uploaded', 400);
  }
  next();
};

export const validateSingleFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }
  next();
};

export const validateMultipleFiles = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    throw new AppError('No files uploaded', 400);
  }
  next();
};
