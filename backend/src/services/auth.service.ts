// src/services/auth.service.js
import { UserRepository } from "../repositories/user.repository.js";
import { CryptoUtil } from "../utils/crypto.util.js";

export class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(data) {
    const hashedPassword = await CryptoUtil.hashPassword(data.password);
    
    const user = await this.userRepo.create({
      username: data.username,
      email: data.email,
      passwordHash: hashedPassword,
      dateOfBirth: data.dateOfBirth,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      coverPhotoUrl: data.coverPhotoUrl,
    });

    const token = CryptoUtil.generateToken({
      userId: user.id,
      email: user.email
    });

    // Return AuthResponse structure
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio || undefined,
        avatarUrl: user.avatarUrl || undefined,
        coverPhotoUrl: user.coverPhotoUrl || undefined,
        dateOfBirth: user.dateOfBirth,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  }

  async login(data) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) return null;

    const isValid = await CryptoUtil.comparePassword(
      data.password,
      user.passwordHash
    );
    if (!isValid) return null;

    const token = CryptoUtil.generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio || undefined,
        avatarUrl: user.avatarUrl || undefined,
        coverPhotoUrl: user.coverPhotoUrl || undefined,
        dateOfBirth: user.dateOfBirth,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  }

  async getProfile(userId) {
    return this.userRepo.findById(userId);
  }
}
