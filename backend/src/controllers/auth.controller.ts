import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { catchAsync } from '../utils/catch-async.js';

import env from '../config/env.js';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = env.NODE_ENV === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // Use 'none' for cross-site if production, else 'lax'
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await authService.registerUser(email, password);
  
  setAuthCookies(res, data.accessToken, data.refreshToken);

  res.status(201).json({
    success: true,
    user: data.user,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await authService.loginUser(email, password);
  
  setAuthCookies(res, data.accessToken, data.refreshToken);

  res.status(200).json({
    success: true,
    user: data.user,
  });
});

export const getMe = catchAsync(async (req: any, res: Response) => {
  const user = await authService.getUserById(req.user.userId);
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ success: false, message: 'Refresh token missing' });
    return;
  }

  const data = await authService.refreshAccessToken(refreshToken);
  
  setAuthCookies(res, data.accessToken, data.refreshToken);

  res.status(200).json({
    success: true,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await authService.logoutUser(refreshToken);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
