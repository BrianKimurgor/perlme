import { Response } from 'express';
import { ApiResponse } from '../types/common.types';

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  error?: any,
  statusCode: number = 400
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

export const notFoundResponse = (
  res: Response,
  message: string = 'Resource not found'
): Response<ApiResponse> => {
  return errorResponse(res, message, undefined, 404);
};

export const unauthorizedResponse = (
  res: Response,
  message: string = 'Unauthorized access'
): Response<ApiResponse> => {
  return errorResponse(res, message, undefined, 401);
};

export const forbiddenResponse = (
  res: Response,
  message: string = 'Forbidden access'
): Response<ApiResponse> => {
  return errorResponse(res, message, undefined, 403);
};

export const internalServerErrorResponse = (
  res: Response,
  message: string = 'Internal server error',
  error?: any
): Response<ApiResponse> => {
  return errorResponse(res, message, error, 500);
};

