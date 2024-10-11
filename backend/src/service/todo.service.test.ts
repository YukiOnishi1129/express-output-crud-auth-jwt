import bcrypt from 'bcryptjs';
import { AppDataSource } from '@/config/appDataSource';
import { Todo } from '@/domain/entity/todo.entity';
import { User } from '@/domain/entity/user.entity';

import {
  createNewTodo,
  deleteExistingTodo,
  getTodoById,
  getTodoList,
  updateExistingTodo,
} from '@/service/todo.service';
import { HttpError } from '@/shared/errors/httpError';

describe('【Service Test Todo】 ', () => {
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const userRepo = AppDataSource.getInstance().getRepository(User);
    await userRepo.save({
      id: 1,
      name: 'takeshi',
      email: 'takeshi@gmail.com',
      password: hashedPassword,
    });
    await userRepo.save({
      id: 2,
      name: 'hanako',
      email: 'hanako@gmail.com',
      password: hashedPassword,
    });
  });

  afterEach(async () => {
    const todoRepo = AppDataSource.getInstance().getRepository(Todo);
    const userRepo = AppDataSource.getInstance().getRepository(User);
    await todoRepo.delete({});
    await userRepo.delete({});
  });

  describe('【getTodoList】', () => {
    it('Success: get 0 data', async () => {
      const todoList = await getTodoList({});
      expect(todoList).toEqual([]);
    });
    it('Success: get data', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo1',
        content: 'This is a test todo item1.',
      });
      await todoRepo.save({
        id: 2,
        userId: 1,
        title: 'Test Todo2',
        content: 'This is a test todo item2.',
      });
      await todoRepo.save({
        id: 3,
        userId: 2,
        title: 'Test Todo2',
        content: 'This is a test todo item2.',
      });

      const todoList = await getTodoList({ userId: 1 });
      expect(todoList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            userId: 1,
            title: 'Test Todo1',
            content: 'This is a test todo item1.',
          }),
          expect.objectContaining({
            id: 2,
            userId: 1,
            title: 'Test Todo2',
            content: 'This is a test todo item2.',
          }),
        ]),
      );
    });
    it('Success: get data with keyword', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });
      await todoRepo.save({
        id: 2,
        userId: 1,
        title: 'eest Todo2',
        content: 'This is a test todo item2.',
      });
      await todoRepo.save({
        id: 3,
        userId: 2,
        title: 'Test Todo3',
        content: 'This is a test todo item3.',
      });

      const todoList = await getTodoList({ keyword: 'Test' });
      expect(todoList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            title: 'Test Todo',
            content: 'This is a test todo item.',
          }),
        ]),
      );
    });
  });

  describe('【getTodoById】', () => {
    it('Success: get data by id', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      const todo = await getTodoById({
        id: 1,
        userId: 1,
      });
      expect(todo).toMatchObject({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });
    });
    it('Error: get data by id', async () => {
      try {
        await getTodoById({
          id: 2,
          userId: 1,
        });
      } catch (error) {
        expect(error).toEqual(new HttpError(404, 'Todo not found'));
      }
    });

    it('Error: get data by user id', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });
      try {
        await getTodoById({
          id: 1,
          userId: 2,
        });
      } catch (error) {
        expect(error).toEqual(new HttpError(404, 'Todo not found'));
      }
    });
  });

  describe('【createNewTodo】', () => {
    it('Success: create new todo', async () => {
      const newTodo = {
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      };
      const todo = await createNewTodo(newTodo);
      expect(todo).toMatchObject({
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });
    });
  });

  describe('【updateExistingTodo】', () => {
    it('Success: update existing todo', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      const updatedTodo = {
        id: 1,
        userId: 1,
        title: 'Updated Todo',
        content: 'This is an updated todo item.',
      };
      const todo = await updateExistingTodo(updatedTodo);
      expect(todo).toMatchObject({
        id: 1,
        userId: 1,
        title: 'Updated Todo',
        content: 'This is an updated todo item.',
      });
    });
    it('Error: update existing todo', async () => {
      try {
        await updateExistingTodo({
          id: 1,
          userId: 1,
          title: 'Updated Todo',
          content: 'This is an updated todo item.',
        });
      } catch (error) {
        expect(error).toEqual(new HttpError(404, 'Todo not found'));
      }
    });

    it('Error: update no todo by user id', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      try {
        await updateExistingTodo({
          id: 1,
          userId: 2,
          title: 'Updated Todo',
          content: 'This is an updated todo item.',
        });
      } catch (error) {
        expect(error).toEqual(new HttpError(404, 'Todo not found'));
      }
    });
  });

  describe('【deleteExistingTodo】', () => {
    it('Success: delete existing todo', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      await deleteExistingTodo({
        id: 1,
        userId: 1,
      });

      const result = await todoRepo.findOne({ where: { id: 1 } });
      expect(result).toBeNull();
    });
    it('Error: delete existing todo', async () => {
      try {
        await getTodoById({
          id: 1,
          userId: 1,
        });
      } catch (error) {
        expect(error).toEqual(new HttpError(404, 'Todo not found'));
      }
    });

    it('Error: delete no todo by user id', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });
      try {
        await getTodoById({
          id: 1,
          userId: 2,
        });
      } catch (error) {
        expect(error).toEqual(new HttpError(404, 'Todo not found'));
      }
    });
  });
});
