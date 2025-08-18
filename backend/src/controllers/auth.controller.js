// src/controllers/auth.controller.js
import { AuthService } from "../services/auth.service.js";
import { CryptoUtil } from "../utils/crypto.util.js";
import { errorResponse, successResponse } from "../utils/response.util.js";

const authService = new AuthService();

export class AuthController {
  // Register new user
  async register(req, res, next) {
    try {
      const userData = req.body;

      const user = await authService.register(userData);

      return successResponse(res, "User registered successfully", user, 201);
    } catch (error) {
      return next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const loginData = req.body;

      const authResponse = await authService.login(loginData);

      if (!authResponse) {
        return errorResponse(res, "Invalid credentials", null, 401);
      }

      return successResponse(res, "Login successful", authResponse);
    } catch (error) {
      return next(error);
    }
  }

  // Get logged in user profile
  async getProfile(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return errorResponse(res, "Authorization token required", null, 401);
      }

      const payload = CryptoUtil.verifyToken(token);
      const user = await authService.getProfile(payload.userId);

      if (!user) {
        return errorResponse(res, "User not found", null, 404);
      }

      return successResponse(res, "Profile retrieved", user);
    } catch (error) {
      return next(error);
    }
  }
}
