import { Router } from 'express';
import {
  signInHandler,
  signUpHandler,
  validateSignIn,
  validateSignUp,
} from '@/controller/auth.controller';

const authRouter = Router();

authRouter.post('/signup', validateSignUp, signUpHandler);
authRouter.post('/signin', validateSignIn, signInHandler);

export default authRouter;
