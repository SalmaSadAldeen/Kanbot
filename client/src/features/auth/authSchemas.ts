import { z } from 'zod';

// 1. مخطط تسجيل الدخول (Login Schema)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .max(80, 'Full name must not exceed 80 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(200, 'Password must not exceed 200 characters'),
});

// استخراج نوع البيانات من الـ Schema
export type RegisterFormData = z.infer<typeof registerSchema>;