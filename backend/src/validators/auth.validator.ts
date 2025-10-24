// src/validators/auth.validator.js
import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().required("Name is required").min(2).max(50),
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required").min(6),
  age: yup.number().optional().min(0).max(120),
  bio: yup.string().optional().max(500),
});

export const loginSchema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required"),
});
