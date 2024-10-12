/**
 * Todo関係のルーティングをまとめて定義
 */

import { Router } from 'express';

import {
  validateTodoById,
  validateCreateTodo,
  validateUpdateTodo,
  validateDeleteTodo,
  getTodoListHandler,
  getTodoByIdHandler,
  createNewTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
} from '@/controller/todo.controller';
import { authMiddleware } from '@/middleware/authMiddleware';

const todoRouter = Router();

// ルーティング設定時にバリデーションを設定: validateTodoById など
// ルーティング設定時に認証ミドルウェアを設定: authMiddleware
todoRouter.get('/', authMiddleware, getTodoListHandler);
todoRouter.get('/:id', authMiddleware, validateTodoById, getTodoByIdHandler);
todoRouter.post('/', authMiddleware, validateCreateTodo, createNewTodoHandler);
todoRouter.put('/:id', authMiddleware, validateUpdateTodo, updateTodoHandler);
todoRouter.delete(
  '/:id',
  authMiddleware,
  validateDeleteTodo,
  deleteTodoHandler,
);

export default todoRouter;
