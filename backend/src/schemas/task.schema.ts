import { z } from 'zod';

const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'] as const;

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ error: 'Title is required' })
      .min(1, 'Title cannot be empty')
      .max(255, 'Title must be at most 255 characters'),
    description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
  }),
});

export const listTasksSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined))
      .refine((v) => v === undefined || (Number.isInteger(v) && v > 0), {
        message: 'page must be a positive integer',
      }),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined))
      .refine((v) => v === undefined || (Number.isInteger(v) && v > 0), {
        message: 'limit must be a positive integer',
      }),
    status: z.enum(taskStatuses).optional(),
    search: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(255, 'Title must be at most 255 characters')
      .optional(),
    description: z
      .string()
      .max(1000, 'Description must be at most 1000 characters')
      .optional(),
    status: z.enum(taskStatuses).optional(),
  }),
});
