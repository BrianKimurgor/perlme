import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getUserByEmailService,
  registerUserService,
  updateUserPasswordService,
  updateVerificationStatusService,
  generateAndSetNewConfirmationCode,
} from "./Auth.service";
import { registerUserValidator, loginUserValidator } from "../Validators/Auth.validator";
import { sendNotificationEmail } from "../Middlewares/GoogleMailer";
import { TInsertUser } from "../drizzle/schema";

// --------------------------- HELPERS ---------------------------
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined!");
  return secret;
};

// 🌈 Base Email Template (layout matches deletion email)
export const baseEmailTemplate = (
  title: string,
  message: string,
  buttonText?: string,
  buttonLink?: string
) => `
<html>
  <body style="font-family:'Poppins',Arial,sans-serif;background-color:#E8EAF6;padding:40px;">
    <div style="max-width:640px;margin:auto;background:#fff;padding:32px;border-radius:18px;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,0.08);">

      <h2 style="margin-bottom:20px;color:#5E35B1;">${title}</h2>

      <p style="font-size:15px;line-height:1.6;color:#4A148C;">
        ${message}
      </p>

      ${buttonText && buttonLink
        ? `<a href="${buttonLink}" style="display:inline-block;margin-top:20px;padding:12px 28px;background:#7E57C2;color:white;border-radius:10px;text-decoration:none;font-weight:500;">${buttonText}</a>`
        : ""
      }

      <hr style="margin:30px 0;border:none;border-top:1px solid #D1C4E9;">

      <p style="font-size:14px;color:#999;line-height:1.6;">
        💜 With love,<br><strong>The PerlMe Team</strong><br>&copy; ${new Date().getFullYear()} PerlMe
      </p>

    </div>
  </body>
</html>
`;

// --------------------------- REGISTER ---------------------------
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const parseResult = registerUserValidator.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({ error: parseResult.error.issues });

    const userData = parseResult.data;
    const existingUser = await getUserByEmailService(userData.email);
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const confirmationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const validRoles = ["REGULAR", "CREATOR", "MODERATOR", "ADMIN"];
    const userRole =
      userData.role && validRoles.includes(userData.role)
        ? userData.role
        : "REGULAR";

    const newUserPayload: TInsertUser = {
      username: userData.username,
      email: userData.email,
      passwordHash: hashedPassword,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      orientation: userData.orientation,
      bio: userData.bio ?? null,
      avatarUrl: userData.avatarUrl ?? null,
      coverPhotoUrl: userData.coverPhotoUrl ?? null,
      confirmationCode,
      confirmationCodeExpiresAt,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: userRole,
    };

    const newUser = await registerUserService(newUserPayload);

    // ✉️ Welcome & Verification Email
    const subject = "💜 Welcome to PerlMe — Verify Your Email!";
    const message = `
      Hey <strong>${userData.username}</strong>, welcome to <strong>PerlMe</strong>! 💫<br><br>
      To activate your account, use the 6-digit verification code below (valid for <strong>10 minutes</strong>):
      <div style="font-size:36px;font-weight:bold;color:#8E24AA;margin:20px 0;">${confirmationCode}</div>
      Enter this code in the app to verify your account and join our lovely community 💞
    `;
    const html = baseEmailTemplate("Welcome to PerlMe 💌", message);

    await sendNotificationEmail(userData.email, subject, userData.username, html);
    res.status(201).json({
      message: `User registered successfully as ${userRole}. Please verify your email 💌`,
      user: newUser,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message || "Failed to register user" });
  }
};

// --------------------------- LOGIN ---------------------------
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const parseResult = loginUserValidator.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({ error: parseResult.error.issues });

    const { email, passwordHash } = parseResult.data;
    const user = await getUserByEmailService(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isVerified)
      return res.status(403).json({ error: "Please verify your email first 💌" });

    const passwordValid = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!passwordValid)
      return res.status(401).json({ error: "Incorrect password" });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const token = jwt.sign(payload, getJWTSecret(), { expiresIn: "1h" });

    res.status(200).json({
      message: "Welcome back to PerlMe 💜",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Login failed" });
  }
};

// --------------------------- PASSWORD RESET ---------------------------
export const passwordReset: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await getUserByEmailService(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = jwt.sign({ email: user.email }, getJWTSecret(), { expiresIn: "1h" });
    const resetLink = `${process.env.FRONTEND_URL}reset-password/${resetToken}`;

    const subject = "🔐 Reset Your PerlMe Password";
    const message = `
      Hi <strong>${user.username}</strong>,<br>
      Click below to securely reset your password.<br>
      This link will expire in <strong>1 hour</strong> for your security.
    `;
    const html = baseEmailTemplate("Reset Your Password 🔒", message, "Reset Password", resetLink);

    await sendNotificationEmail(email, subject, user.username, html);
    res.status(200).json({ message: "Password reset email sent successfully 💌" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Password reset failed" });
  }
};

// --------------------------- UPDATE PASSWORD ---------------------------
export const updatePassword: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password)
      return res.status(400).json({ error: "Token and password required" });

    const payload = jwt.verify(token, getJWTSecret()) as { email: string };
    const user = await getUserByEmailService(payload.email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await updateUserPasswordService(user.email, hashedPassword);

    const subject = "✅ Your PerlMe Password Was Changed";
    const message = `
      Hey <strong>${user.username}</strong>, your password has been successfully updated!<br>
      If this wasn’t you, please reset your password immediately.
    `;
    const html = baseEmailTemplate("Password Updated Successfully 💪", message);

    await sendNotificationEmail(user.email, subject, user.username, html);
    res.status(200).json({ message: "Password updated successfully 💪" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Invalid or expired token" });
  }
};

// --------------------------- EMAIL VERIFICATION ---------------------------
export const emailVerification: RequestHandler = async (req, res) => {
  try {
    const { email, confirmationCode } = req.body;
    const user = await getUserByEmailService(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.confirmationCode !== confirmationCode)
      return res.status(400).json({ error: "Invalid verification code" });

    if (
      user.confirmationCodeExpiresAt &&
      new Date() > new Date(user.confirmationCodeExpiresAt)
    ) {
      return res.status(400).json({
        error: "Verification code expired ⏰. Please request a new one.",
      });
    }

    await updateVerificationStatusService(user.email, true, null);

    const subject = "🎉 Your Email is Verified — Welcome to PerlMe!";
    const message = `
      Hi <strong>${user.username}</strong>, your email has been successfully verified 💜<br>
      You can now log in and start exploring connections on PerlMe!
    `;
    const html = baseEmailTemplate("Email Verified Successfully 💌", message, "Go to PerlMe", `${process.env.FRONTEND_URL}login`);

    await sendNotificationEmail(user.email, subject, user.username, html);
    res.status(200).json({ message: "Email verified successfully 💜" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Email verification failed" });
  }
};

// --------------------------- RESEND VERIFICATION EMAIL ---------------------------
export const resendVerificationEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await getUserByEmailService(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ error: "Email already verified" });

    const newCode = await generateAndSetNewConfirmationCode(email);

    const subject = "🔁 New Verification Code for PerlMe";
    const message = `
      Hey <strong>${user.username}</strong>,<br>
      Here’s your new 6-digit verification code (valid for <strong>10 minutes</strong>):<br>
      <div style="font-size:36px;font-weight:bold;color:#8E24AA;margin:20px 0;">${newCode}</div>
      Please verify your email to activate your account 💜
    `;
    const html = baseEmailTemplate("Your New Verification Code 💫", message);

    await sendNotificationEmail(email, subject, user.username, html);
    res.status(200).json({ message: "Verification email resent successfully 💌" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to resend verification email" });
  }
};
