/**
 * 認証ミドルウェア
 * フロントから送られてきたトークンを検証し、
 * 正しい場合はリクエストオブジェクトにユーザー情報を追加する
 * 不正な場合はエラーレスポンスを返す (401エラー)
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '@/shared/response/sendResponse';

export type AuthRequest = Request & { user?: string | jwt.JwtPayload };

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
    sendError(res, 401, [`Invalid Token: ${error}`]);
  }
};
