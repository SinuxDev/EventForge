import { Response } from 'express';

// object covers any JSON-serialisable value while avoiding the broad `any`
type ResponseData = object | string | number | boolean | null;

interface SuccessResponse {
  status: 'success';
  message?: string;
  data?: ResponseData;
  meta?: ResponseData;
}

export class ApiResponse {
  static success(
    res: Response,
    data?: ResponseData,
    message?: string,
    statusCode: number = 200,
    meta?: ResponseData
  ): Response {
    const response: SuccessResponse = {
      status: 'success',
      ...(message && { message }),
      ...(data !== undefined && { data }),
      ...(meta !== undefined && { meta }),
    };

    return res.status(statusCode).json(response);
  }

  static created(
    res: Response,
    data?: ResponseData,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
