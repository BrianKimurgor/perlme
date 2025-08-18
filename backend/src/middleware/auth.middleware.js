// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { errorResponse } from '../utils/response.util.js';

export const authMiddleware = (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return errorResponse(res, 'Authorization header missing', null, 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return errorResponse(res, 'Token missing', null, 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid token', err, 401);
  }
};
