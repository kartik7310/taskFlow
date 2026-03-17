import { Request, Response } from 'express';
import env from '../config/env.js';

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const isSecure = env.COOKIE_SECURE === "true";

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'none' : 'lax', // Use 'none' for cross-site if production, else 'lax'
        maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
