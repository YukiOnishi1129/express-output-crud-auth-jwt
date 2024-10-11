// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '@/shared/response/sendResponse';

type AuthRequest = Request & { user?: string | jwt.JwtPayload };

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    sendError(res, 401);
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = verified;
    next();
  } catch (error) {
    sendError(res, 400, [`Invalid Token: ${error}`]);
  }
};
