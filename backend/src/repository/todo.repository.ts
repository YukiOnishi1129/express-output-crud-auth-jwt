import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '@/config/appDataSource';
import { Todo } from '@/domain/entity/todo.entity';
import { HttpError } from '@/shared/errors/httpError';

export const findAllTodo = async (options?: FindManyOptions<Todo>) => {
  const db = AppDataSource.getInstance();
  const todoRepository = db.getRepository(Todo);
  try {
    return await todoRepository.find(options);
  } catch (error) {
    console.error(error);
    throw new HttpError(500, `Failed to find todo: ${error}`);
  }
};

export const findTodoById = async (id: number) => {
  const db = AppDataSource.getInstance();
  const todoRepository = db.getRepository(Todo);
  try {
    return await todoRepository.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new HttpError(500, `Failed to find todo: ${error}`);
  }
};

export const createTodo = async (todo: Todo) => {
  const db = AppDataSource.getInstance();
  const todoRepository = db.getRepository(Todo);
  try {
    return await todoRepository.save(todo);
  } catch (error) {
    console.error(error);
    throw new HttpError(500, `Failed to create todo: ${error}`);
  }
};

export const updateTodo = async (todo: Todo) => {
  const db = AppDataSource.getInstance();
  const todoRepository = db.getRepository(Todo);
  try {
    return await todoRepository.save(todo);
  } catch (error) {
    console.error(error);
    throw new HttpError(500, `Failed to update todo: ${error}`);
  }
};

export const deleteTodo = async (id: number) => {
  const db = AppDataSource.getInstance();
  const todoRepository = db.getRepository(Todo);
  try {
    return await todoRepository.delete(id);
  } catch (error) {
    console.error(error);
    throw new HttpError(500, `Failed to delete todo: ${error}`);
  }
};
