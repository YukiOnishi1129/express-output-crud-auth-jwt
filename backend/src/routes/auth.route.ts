/**
 * 認証関係のルーティングをまとめて定義
 */
import { Router } from 'express';
import {
  signInHandler,
  signUpHandler,
  validateSignIn,
  validateSignUp,
} from '@/controller/auth.controller';

const authRouter = Router();

// ルーティング設定時にバリデーションを設定
authRouter.post('/signup', validateSignUp, signUpHandler);
authRouter.post('/signin', validateSignIn, signInHandler);

export default authRouter;
