// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { CreateUserData, LoginData } from '../types/user.types';
import { successResponse, errorResponse } from '../utils/response.util.js';
import { CryptoUtil } from '../utils/crypto.util.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserData = req.body;
      const user = await authService.register(userData);
      return successResponse(res, 'User registered successfully', user, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginData = req.body;
      const authResponse = await authService.login(loginData);
      
      if (!authResponse) {
        return errorResponse(res, 'Invalid credentials', null, 401);
      }
      
      return successResponse(res, 'Login successful', {
        user: authResponse.user,
        token: authResponse.token
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return errorResponse(res, 'Authorization token required', null, 401);
      }

      const payload = CryptoUtil.verifyToken(token);
      const user = await authService.getProfile(payload.userId);
      
      if (!user) {
        return errorResponse(res, 'User not found', null, 404);
      }

      return successResponse(res, 'Profile retrieved', user);
    } catch (error) {
      next(error);
    }
  }
}