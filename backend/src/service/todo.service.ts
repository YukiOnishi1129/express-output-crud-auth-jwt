import { FindManyOptions, Like } from 'typeorm';

import {
  findAllTodo,
  findTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '@/repository/todo.repository';
import { Todo } from '@/domain/entity/todo.entity';
import { HttpError } from '@/shared/errors/httpError';

export type GetTodoListParam = {
  keyword?: string;
};

export const getTodoList = async ({ keyword }: GetTodoListParam) => {
  const options: FindManyOptions = {};
  if (keyword) {
    options.where = {
      title: Like(`%${keyword}%`),
    };
  }
  return await findAllTodo(options);
};

export const getTodoById = async (id: number) => {
  const todo = await findTodoById(id);
  if (!todo) {
    throw new HttpError(404, 'Todo not found');
  }
  return todo;
};

export type CreateNewTodoParam = {
  title: string;
  content: string;
};

export const createNewTodo = async ({ title, content }: CreateNewTodoParam) => {
  const newTodo = new Todo();
  newTodo.title = title;
  newTodo.content = content;
  return await createTodo(newTodo);
};

export type UpdateExistingTodoParam = {
  id: number;
  title: string;
  content: string;
};

export const updateExistingTodo = async ({
  id,
  title,
  content,
}: UpdateExistingTodoParam) => {
  const todo = await findTodoById(id);
  if (!todo) {
    throw new HttpError(404, 'Todo not found');
  }
  todo.title = title;
  todo.content = content;
  return await updateTodo(todo);
};

export const deleteExistingTodo = async (id: number) => {
  const todo = await findTodoById(id);
  if (!todo) {
    throw new HttpError(404, 'Todo not found');
  }
  return await deleteTodo(id);
};
