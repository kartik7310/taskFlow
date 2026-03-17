import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email address'),
    password: z.string({ message: 'Password is required' }),
  }),
});

export const refreshSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ message: 'Refresh token is required' }),
  }),
});

export const logoutSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().optional(),
  }),
});
