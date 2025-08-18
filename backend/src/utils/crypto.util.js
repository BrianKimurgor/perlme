import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export class CryptoUtil {
  static async hashPassword(password) {
    return bcrypt.hash(password, config.bcryptSaltRounds);
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  static generateToken(payload) {
    return jwt.sign(
      payload, 
      config.jwtSecret, 
      { 
        expiresIn: config.jwtExpiresIn 
      }
    );
  }

  static verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
  }
}
