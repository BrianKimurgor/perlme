// src/services/auth.service.ts
import { UserRepository } from "../repositories/user.repository.js";
import { CryptoUtil } from "../utils/crypto.util.js";
import { User, CreateUserData, UserProfile, LoginData, AuthResponse } from "../types/user.types";

export class AuthService {
  constructor(private userRepo = new UserRepository()) {}

  async register(data: CreateUserData): Promise<User> {
    const hashedPassword = await CryptoUtil.hashPassword(data.password);
    const userData = {
      ...data,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.userRepo.create(userData);
  }

  async login(data: LoginData): Promise<AuthResponse | null> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) return null;

    const isValid = await CryptoUtil.comparePassword(
      data.password,
      user.password
    );
    if (!isValid) return null;

    // Generate token
    const token = CryptoUtil.generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return user profile (without password) and token
    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: userProfile,
      token,
    };
  }

  // Add to your AuthService class
  async getProfile(token: string): Promise<UserProfile | null> {
    try {
      const payload = CryptoUtil.verifyToken(token);
      const user = await this.userRepo.findById(payload.userId);

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      return null;
    }
  }
}
