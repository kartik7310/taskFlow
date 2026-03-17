import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { catchAsync } from '../utils/catch-async.js';

import env from '../config/env.js';
import { setAuthCookies } from '../utils/cookies.js';

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

  const isSecure = env.COOKIE_SECURE === "true";
  const cookieOptions = {
    httpOnly: true,
    secure: isSecure,
    sameSite: (isSecure ? 'none' : 'lax') as 'none' | 'lax',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
