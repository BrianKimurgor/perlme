import { Router } from "express";
import { 
  registerUser,
  loginUser,
  passwordReset,
  updatePassword,
  emailVerification,
  resendVerificationEmail,
} from "./Auth.controller";

export const authRouter = Router();

// -------------------- AUTH ROUTES --------------------

// Register a new user
authRouter.post("/auth/register", registerUser);

// Login user
authRouter.post("/auth/login", loginUser);

// Send password reset email
authRouter.post("/auth/password-reset", passwordReset);

// Reset password using token
authRouter.put("/auth/reset/:token", updatePassword);

// Verify email using confirmation code
authRouter.put("/auth/verify-email", emailVerification);

// Resend verification code
authRouter.post("/auth/resend-verification", resendVerificationEmail);
