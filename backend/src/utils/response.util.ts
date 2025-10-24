export const successResponse = (
  res,
  message,
  data,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (
  res,
  message,
  error,
  statusCode = 400
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

export const notFoundResponse = (
  res,
  message = 'Resource not found'
) => {
  return errorResponse(res, message, undefined, 404);
};

export const unauthorizedResponse = (
  res,
  message = 'Unauthorized access'
) => {
  return errorResponse(res, message, undefined, 401);
};

export const forbiddenResponse = (
  res,
  message = 'Forbidden access'
) => {
  return errorResponse(res, message, undefined, 403);
};

export const internalServerErrorResponse = (
  res,
  message = 'Internal server error',
  error
) => {
  return errorResponse(res, message, error, 500);
};
