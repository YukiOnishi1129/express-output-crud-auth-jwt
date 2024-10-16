import { RequestHandler } from 'express';
import { check, validationResult } from 'express-validator';

import { JwtPayload } from 'jsonwebtoken';
import { sendSuccess, sendError } from '@/shared/response/sendResponse';
import {
  getTodoList,
  getTodoById,
  GetTodoListParam,
  createNewTodo,
  CreateNewTodoParam,
  updateExistingTodo,
  UpdateExistingTodoParam,
  deleteExistingTodo,
  GetTodoByIdParam,
  DeleteExistingTodoParam,
} from '@/service/todo.service';
import { HttpError } from '@/shared/errors/httpError';
import { AuthRequest } from '@/middleware/authMiddleware';

type UserJwtPayload = JwtPayload & {
  id: number;
  email: string;
};

export const validateTodoById = [
  check('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
];

export const validateCreateTodo = [
  check('title')
    .notEmpty()
    .withMessage('title must not be empty')
    .isLength({ max: 30 })
    .withMessage('title must not exceed 30 characters'),
  check('content').notEmpty().withMessage('content must not be empty'),
];

export const validateUpdateTodo = [
  check('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  check('title')
    .notEmpty()
    .withMessage('title must not be empty')
    .isLength({ max: 30 })
    .withMessage('title must not exceed 30 characters'),
  check('content').notEmpty().withMessage('content must not be empty'),
];

export const validateDeleteTodo = [
  check('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
];

export const getTodoListHandler: RequestHandler = async (req, res) => {
  const param: GetTodoListParam = {};

  const { keyword } = req.query;
  if (keyword && typeof keyword === 'string') {
    param.keyword = keyword;
  }

  const token = (req as AuthRequest).user;
  if (token && typeof token !== 'string') {
    const userJwtPayload = token as UserJwtPayload;
    param.userId = userJwtPayload.id;
  }

  try {
    const todoList = await getTodoList(param);
    sendSuccess(res, 200, todoList);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      sendError(res, error.statusCode, [error.message]);
      return;
    }
    sendError(res, 500);
  }
};

export const getTodoByIdHandler: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((error) => error.msg as string);
    sendError(res, 400, errorMessage);
    return;
  }

  const param: GetTodoByIdParam = {
    id: Number(req.params.id),
  };

  const token = (req as AuthRequest).user;
  if (token && typeof token !== 'string') {
    const userJwtPayload = token as UserJwtPayload;
    param.userId = userJwtPayload.id;
  }

  try {
    const todo = await getTodoById(param);
    sendSuccess(res, 200, todo);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      sendError(res, error.statusCode, [error.message]);
      return;
    }
    sendError(res, 500);
  }
};

export const createNewTodoHandler: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((error) => error.msg as string);
    sendError(res, 400, errorMessage);
    return;
  }
  const param: CreateNewTodoParam = {
    title: req.body.title,
    content: req.body.content,
  };

  const token = (req as AuthRequest).user;
  if (token && typeof token !== 'string') {
    const userJwtPayload = token as UserJwtPayload;
    param.userId = userJwtPayload.id;
  }

  try {
    const todo = await createNewTodo(param);
    sendSuccess(res, 201, todo);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      sendError(res, error.statusCode, [error.message]);
      return;
    }
    sendError(res, 500);
  }
};

export const updateTodoHandler: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((error) => error.msg as string);
    sendError(res, 400, errorMessage);
    return;
  }
  const param: UpdateExistingTodoParam = {
    id: Number(req.params.id),
    title: req.body.title,
    content: req.body.content,
  };

  const token = (req as AuthRequest).user;
  if (token && typeof token !== 'string') {
    const userJwtPayload = token as UserJwtPayload;
    param.userId = userJwtPayload.id;
  }

  try {
    const todo = await updateExistingTodo(param);
    sendSuccess(res, 200, todo);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      sendError(res, error.statusCode, [error.message]);
      return;
    }
    sendError(res, 500);
  }
};

export const deleteTodoHandler: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((error) => error.msg as string);
    sendError(res, 400, errorMessage);
    return;
  }

  const param: DeleteExistingTodoParam = {
    id: Number(req.params.id),
  };

  const token = (req as AuthRequest).user;
  if (token && typeof token !== 'string') {
    const userJwtPayload = token as UserJwtPayload;
    param.userId = userJwtPayload.id;
  }
  try {
    await deleteExistingTodo(param);
    sendSuccess(res, 204);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      sendError(res, error.statusCode, [error.message]);
      return;
    }
    sendError(res, 500);
  }
};
