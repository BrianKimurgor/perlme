import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// -------------------- TYPES --------------------
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender?: "MALE" | "FEMALE" | "NON_BINARY" | "OTHER";
  orientation?:
  | "STRAIGHT"
  | "GAY"
  | "LESBIAN"
  | "BISEXUAL"
  | "ASEXUAL"
  | "PANSEXUAL"
  | "OTHER";
  bio?: string;
  avatarUrl?: string | null;
  coverPhotoUrl?: string | null;
  visibility?: "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";
  role?: "REGULAR" | "CREATOR" | "MODERATOR" | "ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  user: any;
  accessToken?: string;
  refreshToken?: string;
}


// -------------------- API --------------------
// -------------------- API --------------------
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.88.113:3000/api/",
  }),
  tagTypes: ["Auth"],

  endpoints: (builder) => ({
    // Register
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (payload) => ({
        url: "auth/register",
        method: "POST",
        body: payload,
      }),
    }),

    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (payload) => ({
        url: "auth/login",
        method: "POST",
        body: payload,
      }),
    }),

    // Send password reset email
    requestPasswordReset: builder.mutation<{ message: string }, { email: string }>({
      query: (payload) => ({
        url: "auth/password-reset",
        method: "POST",
        body: payload,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<{ message: string }, { token: string; newPassword: string }>({
      query: ({ token, newPassword }) => ({
        url: `auth/reset/${token}`,
        method: "PUT",
        body: { password: newPassword },
      }),
    }),

    // Verify email (updated)
    verifyEmail: builder.mutation<{ message: string }, { email: string; confirmationCode: string }>({
      query: (payload) => ({
        url: "auth/verify-email",
        method: "PUT",
        body: payload,
      }),
    }),

    // Resend verification (unchanged)
    resendVerification: builder.mutation<{ message: string }, { email: string }>({
      query: (payload) => ({
        url: "auth/resend-verification",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

// -------------------- HOOKS --------------------
export const {
  useRegisterMutation,
  useLoginMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;

