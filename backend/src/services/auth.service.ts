import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../utils/api-error.js';

export const registerUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Set refresh token expiry (7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: expiresAt,
    },
  });

  return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
};

export const logoutUser = async (refreshToken: string) => {
  const token = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!token) {
    throw new ApiError(404, 'Refresh token not found');
  }

  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });
};

export const refreshAccessToken = async (refreshToken: string) => {
  const tokenData = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenData) {
    throw new ApiError(404, 'Refresh token not found');
  }

  if (tokenData.revoked) {
    throw new ApiError(401, 'Refresh token has been revoked');
  }

  if (tokenData.expiresAt < new Date()) {
    throw new ApiError(401, 'Refresh token has expired');
  }

  const newAccessToken = generateAccessToken(tokenData.userId);
  return { accessToken: newAccessToken };
};
