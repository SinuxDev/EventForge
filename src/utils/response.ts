import { Response } from 'express';

interface SuccessResponse {
  status: 'success';
  message?: string;
  data?: any;
  meta?: any;
}

export class ApiResponse {
  static success(
    res: Response,
    data?: any,
    message?: string,
    statusCode: number = 200,
    meta?: any
  ): Response {
    const response: SuccessResponse = {
      status: 'success',
      ...(message && { message }),
      ...(data && { data }),
      ...(meta && { meta }),
    };

    return res.status(statusCode).json(response);
  }

  static created(
    res: Response,
    data?: any,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
