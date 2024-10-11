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

const todoRouter = Router();

todoRouter.get('/', getTodoListHandler);
todoRouter.get('/:id', validateTodoById, getTodoByIdHandler);
todoRouter.post('/', validateCreateTodo, createNewTodoHandler);
todoRouter.put('/:id', validateUpdateTodo, updateTodoHandler);
todoRouter.delete('/:id', validateDeleteTodo, deleteTodoHandler);

export default todoRouter;
