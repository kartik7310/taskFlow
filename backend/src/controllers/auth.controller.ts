import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { catchAsync } from '../utils/catch-async.js';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.registerUser(email, password);
  res.status(201).json({
    success: true,
    data: { id: user.id, email: user.email },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await authService.loginUser(email, password);
  res.status(200).json({
    success: true,
    ...data,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const data = await authService.refreshAccessToken(refreshToken);
  res.status(200).json({
    success: true,
    ...data,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logoutUser(refreshToken);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
