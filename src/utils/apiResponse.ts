import { ApiResponse } from '@/interfaces/api-response.interface';
import { Response } from 'express';

const apiResponse = (res: Response, status: number, message: string, data: any = null, errors: any = null, meta: any = null): Response => {
  const jsonResponse: ApiResponse = {
    status,
    message,
    data,
  };

  // Only include `errors` if it's not null
  if (errors !== null && errors !== undefined) {
    jsonResponse.errors = errors;
  }

  // Only include `meta` if it's not null
  if (meta !== null && meta !== undefined) {
    jsonResponse.meta = meta;
  }

  return res.status(status).json(jsonResponse);
};

// Helper for 200 OK response
export const apiResponseOk = (res: Response, message = 'Success', data: any = null, meta: any = null): Response => {
  return apiResponse(res, 200, message, data, null, meta);
};

// Helper for 201 Created response
export const apiResponseCreated = (res: Response, message = 'Resource created successfully', data: any = null, meta: any = null): Response => {
  return apiResponse(res, 201, message, data, null, meta);
};

// Helper for 400 Bad Request response
export const apiResponseBadRequest = (res: Response, message = 'Bad Request', errors: any = null, meta: any = null): Response => {
  return apiResponse(res, 400, message, null, errors, meta);
};

// Helper for 404 Not Found response
export const apiResponseNotFound = (res: Response, message = 'Resource not found', errors: any = null, meta: any = null): Response => {
  return apiResponse(res, 404, message, null, errors, meta);
};

// Helper for 500 Internal Server Error response
export const apiResponseServerError = (res: Response, message = 'Internal server error', errors: any = null, meta: any = null): Response => {
  return apiResponse(res, 500, message, null, errors, meta);
};

// Helper for 409 Conflict response
export const apiResponseConflict = (res: Response, message = 'Conflict', errors: any = null, meta: any = null): Response => {
  return apiResponse(res, 409, message, null, errors, meta);
};
