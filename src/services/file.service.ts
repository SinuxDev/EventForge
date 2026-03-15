import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { s3, s3Config } from '../config/aws.config';
import { uploadConfig } from '../config/storage.config';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

class FileService {
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (uploadConfig.isProduction) {
        await this.deleteFromS3(fileUrl);
      } else {
        await this.deleteFromLocal(fileUrl);
      }
      logger.info(`File deleted successfully: ${fileUrl}`);
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw new AppError('Failed to delete file', 500);
    }
  }

  private async deleteFromS3(fileUrl: string): Promise<void> {
    const key = this.extractS3KeyFromUrl(fileUrl);

    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });

    await s3.send(command);
  }

  private async deleteFromLocal(fileUrl: string): Promise<void> {
    const filename = path.basename(fileUrl);
    const filePath = path.join(uploadConfig.uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  private extractS3KeyFromUrl(url: string): string {
    const urlParts = url.split('.com/');
    return urlParts[1] || url;
  }

  async optimizeImage(
    filePath: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
    } = {}
  ): Promise<Buffer> {
    const { width = 800, height, quality = 80 } = options;

    return await sharp(filePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toBuffer();
  }

  async createThumbnail(filePath: string, width: number = 200): Promise<Buffer> {
    return await sharp(filePath)
      .resize(width, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 70 })
      .toBuffer();
  }

  getFileUrl(filename: string): string {
    if (uploadConfig.isProduction) {
      return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/uploads/${filename}`;
    } else {
      return `/uploads/${filename}`;
    }
  }

  async getFileMetadata(
    fileUrl: string
  ): Promise<HeadObjectCommandOutput | { ContentLength: number; LastModified: Date }> {
    if (uploadConfig.isProduction) {
      const key = this.extractS3KeyFromUrl(fileUrl);

      const command = new HeadObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
      });

      return await s3.send(command);
    } else {
      const filename = path.basename(fileUrl);
      const filePath = path.join(uploadConfig.uploadDir, filename);

      if (!fs.existsSync(filePath)) {
        throw new AppError('File not found', 404);
      }

      const stats = fs.statSync(filePath);
      return {
        ContentLength: stats.size,
        LastModified: stats.mtime,
      };
    }
  }

  async uploadBuffer(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
    if (uploadConfig.isProduction) {
      const command = new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: `uploads/${filename}`,
        Body: buffer,
        ContentType: mimetype,
        ACL: s3Config.acl,
      });

      await s3.send(command);
      return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/uploads/${filename}`;
    } else {
      const filePath = path.join(uploadConfig.uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      return this.getFileUrl(filename);
    }
  }
}

export const fileService = new FileService();
