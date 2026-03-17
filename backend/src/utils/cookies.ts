import { Request, Response } from 'express';
import env from '../config/env.js';

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
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
