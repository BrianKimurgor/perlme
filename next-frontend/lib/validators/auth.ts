import { z } from 'zod'

/* ─────────────────────────────
   Step 1: Account Information
   (NO refine here)
───────────────────────────── */
export const registerStep1Schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
})

/* ─────────────────────────────
   Step 2: Profile Information
───────────────────────────── */
export const registerStep2Schema = z.object({
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    return age >= 18
  }, 'You must be at least 18 years old'),
})

/* ─────────────────────────────
   Step 3: Preferences
───────────────────────────── */
export const registerStep3Schema = z.object({
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  orientation: z.enum([
    'STRAIGHT',
    'GAY',
    'LESBIAN',
    'BISEXUAL',
    'PANSEXUAL',
    'QUEER',
    'OTHER',
  ]),
})

/* ─────────────────────────────
   Step 4: Bio & Photos
───────────────────────────── */
export const registerStep4Schema = z.object({
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
  avatarUrl: z.string().optional(),
  coverPhotoUrl: z.string().optional(),
})

/* ─────────────────────────────
   Final Registration Schema
   (merge FIRST, refine LAST)
───────────────────────────── */
export const registerSchema = registerStep1Schema
  .merge(registerStep2Schema)
  .merge(registerStep3Schema)
  .merge(registerStep4Schema)
  .extend({
    role: z.enum(['REGULAR', 'PREMIUM']).default('REGULAR'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })

/* ─────────────────────────────
   Types
───────────────────────────── */
export type RegisterStep1Schema = z.infer<typeof registerStep1Schema>
export type RegisterStep2Schema = z.infer<typeof registerStep2Schema>
export type RegisterStep3Schema = z.infer<typeof registerStep3Schema>
export type RegisterStep4Schema = z.infer<typeof registerStep4Schema>
export type RegisterFormValues = z.infer<typeof registerSchema>

/* ─────────────────────────────
   Login Schema
───────────────────────────── */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const verifyEmailSchema = z.object({
  code: z.string().length(8, 'Verification code must be 8 digits')
})

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>
