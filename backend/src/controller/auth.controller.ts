import { check, validationResult } from 'express-validator';
import { RequestHandler } from 'express';
import { HttpError } from '@/shared/errors/httpError';
import { sendError, sendSuccess } from '@/shared/response/sendResponse';
import {
  SignInParam,
  SignUpParam,
  signIn,
  signUp,
} from '@/service/auth.service';

export const validateSignUp = [
  check('username')
    .notEmpty()
    .withMessage('username must not be empty')
    .isLength({ max: 20 })
    .withMessage('username must not exceed 20 characters'),
  check('email')
    .notEmpty()
    .withMessage('email must not be empty')
    .isEmail()
    .withMessage('email must be a valid email address'),
  check('password')
    .notEmpty()
    .withMessage('password must not be empty')
    .isLength({ min: 8, max: 20 })
    .withMessage('password must be between 8 and 20 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Password must contain only alphanumeric characters'),
];

export const validateSignIn = [
  check('email')
    .notEmpty()
    .withMessage('email must not be empty')
    .isEmail()
    .withMessage('email must be a valid email address'),
  check('password')
    .notEmpty()
    .withMessage('password must not be empty')
    .isLength({ min: 8, max: 20 })
    .withMessage('password must be between 8 and 20 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Password must contain only alphanumeric characters'),
];

export const signUpHandler: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((error) => error.msg as string);
    sendError(res, 400, errorMessage);
    return;
  }
  const param: SignUpParam = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const token = await signUp(param);
    sendSuccess(res, 201, token);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      sendError(res, error.statusCode, [error.message]);
      return;
    }
    sendError(res, 500);
  }
};

export const signInHandler: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((error) => error.msg as string);
    sendError(res, 400, errorMessage);
    return;
  }
  const param: SignInParam = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const token = await signIn(param);
    sendSuccess(res, 200, token);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      sendError(res, error.statusCode, [error.message]);
      return;
    }
    sendError(res, 500);
  }
};
