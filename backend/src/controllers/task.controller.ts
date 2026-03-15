import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import * as taskService from '../services/task.service.js';
import type { TaskStatus } from '../services/task.service.js';
import { catchAsync } from '../utils/catch-async.js';
import { ApiError } from '../utils/api-error.js';

export const create = catchAsync(async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  const task = await taskService.createTask(req.user!.userId, title, description);
  res.status(201).json({ success: true, data: task });
});

export const list = catchAsync(async (req: AuthRequest, res: Response) => {
  const { page, limit, status, search } = req.query;
  const result = await taskService.getTasks(req.user!.userId, {
    page: page ? parseInt(String(page)) : undefined,
    limit: limit ? parseInt(String(limit)) : undefined,
    status: status as TaskStatus,
    search: search as string,
  });
  res.status(200).json({ success: true, ...result });
});

export const get = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskService.getTaskById(req.user!.userId, String(req.params.id));
  if (!task) throw new ApiError(404, 'Task not found');
  res.status(200).json({ success: true, data: task });
});

export const update = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskService.updateTask(req.user!.userId, String(req.params.id), req.body);
  res.status(200).json({ success: true, data: task });
});

export const remove = catchAsync(async (req: AuthRequest, res: Response) => {
  await taskService.deleteTask(req.user!.userId, String(req.params.id));
  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

export const toggle = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskService.toggleTaskStatus(req.user!.userId, String(req.params.id));
  res.status(200).json({ success: true, data: task });
});
