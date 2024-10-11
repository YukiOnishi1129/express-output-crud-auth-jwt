import { Router } from 'express';
import { signUpHandler, validateSignUp } from '@/controller/auth.controller';

const authRouter = Router();

authRouter.post('/signup', validateSignUp, signUpHandler);

export default authRouter;
