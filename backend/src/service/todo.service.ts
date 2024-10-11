import { FindManyOptions, Like } from 'typeorm';

import {
  findAllTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  findTodoOne,
} from '@/repository/todo.repository';
import { Todo } from '@/domain/entity/todo.entity';
import { HttpError } from '@/shared/errors/httpError';

export type GetTodoListParam = {
  userId?: number;
  keyword?: string;
};

export const getTodoList = async ({ userId, keyword }: GetTodoListParam) => {
  const options: FindManyOptions = {};

  if (userId) {
    options.where = {
      userId: userId,
    };
  }
  if (keyword) {
    options.where = {
      ...options.where,
      title: Like(`%${keyword}%`),
    };
  }

  return await findAllTodo(options);
};

export type GetTodoByIdParam = {
  id: number;
  userId?: number;
};

export const getTodoById = async ({ id, userId }: GetTodoByIdParam) => {
  const options: FindManyOptions<Todo> = {
    where: {
      id,
    },
  };

  if (userId) {
    options.where = {
      ...options.where,
      userId,
    };
  }

  const todo = await findTodoOne(options);
  if (!todo) {
    throw new HttpError(404, 'Todo not found');
  }
  return todo;
};

export type CreateNewTodoParam = {
  userId?: number;
  title: string;
  content: string;
};

export const createNewTodo = async ({
  userId,
  title,
  content,
}: CreateNewTodoParam) => {
  if (!userId) {
    new HttpError(400, 'User not found');
    return;
  }
  const newTodo = new Todo();
  newTodo.title = title;
  newTodo.content = content;
  newTodo.userId = userId;
  return await createTodo(newTodo);
};

export type UpdateExistingTodoParam = {
  id: number;
  userId?: number;
  title: string;
  content: string;
};

export const updateExistingTodo = async ({
  id,
  userId,
  title,
  content,
}: UpdateExistingTodoParam) => {
  const options: FindManyOptions<Todo> = {
    where: {
      id,
    },
  };

  if (userId) {
    options.where = {
      ...options.where,
      userId,
    };
  }
  const todo = await findTodoOne(options);
  if (!todo) {
    throw new HttpError(404, 'Todo not found');
  }
  todo.title = title;
  todo.content = content;
  return await updateTodo(todo);
};

export type DeleteExistingTodoParam = {
  id: number;
  userId?: number;
};

export const deleteExistingTodo = async ({
  id,
  userId,
}: DeleteExistingTodoParam) => {
  const options: FindManyOptions<Todo> = {
    where: {
      id,
    },
  };

  if (userId) {
    options.where = {
      ...options.where,
      userId,
    };
  }
  const todo = await findTodoOne(options);
  if (!todo) {
    throw new HttpError(404, 'Todo not found');
  }
  return await deleteTodo(id);
};
