import { Request, Response, NextFunction } from 'express';
import { mockRequest, mockResponse } from 'jest-mock-req-res';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '@/config/appDataSource';
import { Todo } from '@/domain/entity/todo.entity';
import {
  createNewTodoHandler,
  deleteTodoHandler,
  getTodoByIdHandler,
  getTodoListHandler,
  updateTodoHandler,
} from '@/controller/todo.controller';
import { sendSuccess, sendError } from '@/shared/response/sendResponse';
import { User } from '@/domain/entity/user.entity';
import { AuthRequest } from '@/middleware/authMiddleware';

jest.mock('@/shared/response/sendResponse');

let req: Request;
let res: Response;
let next: NextFunction;

describe('【Controller Test Todo】 ', () => {
  beforeEach(async () => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
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

  describe('【getTodoListHandler】', () => {
    it('Success: : get 0 data', async () => {
      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };
      await getTodoListHandler(authReq, res, next);
      expect(sendSuccess).toHaveBeenCalledWith(res, 200, []);
    });

    it('Success: get data', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };

      await getTodoListHandler(authReq, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        200,
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            userId: 1,
            title: 'Test Todo',
            content: 'This is a test todo item.',
          }),
        ]),
      );
    });

    it('Success: get searched data', async () => {
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

      req.query = { keyword: 'Test' };
      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };
      await getTodoListHandler(authReq, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        200,
        expect.arrayContaining<Todo>([
          expect.objectContaining({
            id: 1,
            userId: 1,
            title: 'Test Todo',
            content: 'This is a test todo item.',
          }),
        ]),
      );

      expect(sendSuccess).not.toHaveBeenCalledWith(
        res,
        200,
        expect.arrayContaining<Todo>([
          expect.objectContaining({
            id: 2,
            userId: 1,
            title: 'eest Todo2',
            content: 'This is a test todo item2.',
          }),
          expect.objectContaining({
            id: 3,
            userId: 2,
            title: 'Test Todo3',
            content: 'This is a test todo item3.',
          }),
        ]),
      );
    });
  });

  describe('【getTodoByIdHandler】', () => {
    it('Success: get data by id', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      req.params = { id: '1' };
      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };
      await getTodoByIdHandler(authReq, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        200,
        expect.objectContaining({
          id: 1,
          userId: 1,
          title: 'Test Todo',
          content: 'This is a test todo item.',
        }),
      );
    });

    it('Fail: Not Found', async () => {
      req.params = { id: '1' };
      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };
      await getTodoByIdHandler(authReq, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 404, ['Todo not found']);
    });
  });

  describe('【createNewTodoHandler】', () => {
    it('Success: create new todo', async () => {
      req.body = {
        title: 'Test Todo',
        content: 'This is a test todo item.',
      };

      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };

      await createNewTodoHandler(authReq, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        201,
        expect.objectContaining({
          id: 4,
          userId: 1,
          title: 'Test Todo',
          content: 'This is a test todo item.',
        }),
      );
    });
  });

  describe('【updateTodoHandler】', () => {
    it('Success: update todo', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      req.params = { id: '1' };
      req.body = {
        title: 'Updated Todo',
        content: 'This is an updated todo item.',
      };

      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };

      await updateTodoHandler(authReq, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        200,
        expect.objectContaining({
          id: 1,
          userId: 1,
          title: 'Updated Todo',
          content: 'This is an updated todo item.',
        }),
      );
    });

    it('Fail: Not Found', async () => {
      req.params = { id: '1' };
      req.body = {
        title: 'Updated Todo',
        content: 'This is an updated todo item.',
      };

      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };

      await updateTodoHandler(authReq, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 404, ['Todo not found']);
    });
  });

  describe('【deleteTodoHandler】', () => {
    it('Success: delete todo', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      req.params = { id: '1' };

      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };
      await deleteTodoHandler(authReq, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(res, 204);
    });

    it('Fail: Not Found', async () => {
      req.params = { id: '1' };
      const authReq = req as AuthRequest;
      authReq.user = { id: 1, email: 'takeshi@gmail.com' };
      await deleteTodoHandler(authReq, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 404, ['Todo not found']);
    });
  });
});
