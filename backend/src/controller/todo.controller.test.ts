import { Request, Response, NextFunction } from 'express';
import { mockRequest, mockResponse } from 'jest-mock-req-res';
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

jest.mock('@/shared/response/sendResponse');

let req: Request;
let res: Response;
let next: NextFunction;

describe('【Controller Test Todo】 ', () => {
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });
  afterEach(async () => {
    const todoRepo = AppDataSource.getInstance().getRepository(Todo);
    await todoRepo.clear();
  });

  describe('【getTodoListHandler】', () => {
    it('Success: : get 0 data', async () => {
      await getTodoListHandler(req, res, next);
      expect(sendSuccess).toHaveBeenCalledWith(res, 200, []);
    });

    it('Success: get data', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      await getTodoListHandler(req, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        200,
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
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
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });
      await todoRepo.save({
        id: 2,
        title: 'eest Todo2',
        content: 'This is a test todo item2.',
      });
      await todoRepo.save({
        id: 3,
        title: 'Test Todo3',
        content: 'This is a test todo item3.',
      });

      req.query = { keyword: 'Test' };
      await getTodoListHandler(req, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        200,
        expect.arrayContaining<Todo>([
          expect.objectContaining({
            id: 1,
            title: 'Test Todo',
            content: 'This is a test todo item.',
          }),
          expect.objectContaining({
            id: 3,
            title: 'Test Todo3',
            content: 'This is a test todo item3.',
          }),
        ]),
      );

      expect(sendSuccess).not.toHaveBeenCalledWith(
        res,
        200,
        expect.arrayContaining<Todo>([
          expect.objectContaining({
            id: 2,
            title: 'eest Todo2',
            content: 'This is a test todo item2.',
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
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      req.params = { id: '1' };
      await getTodoByIdHandler(req, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        200,
        expect.objectContaining({
          id: 1,
          title: 'Test Todo',
          content: 'This is a test todo item.',
        }),
      );
    });

    it('Fail: Not Found', async () => {
      req.params = { id: '1' };
      await getTodoByIdHandler(req, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 404, ['Todo not found']);
    });
  });

  describe('【createNewTodoHandler】', () => {
    it('Success: create new todo', async () => {
      req.body = {
        title: 'Test Todo',
        content: 'This is a test todo item.',
      };

      await createNewTodoHandler(req, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        201,
        expect.objectContaining({
          id: 1,
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
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      req.params = { id: '1' };
      req.body = {
        title: 'Updated Todo',
        content: 'This is an updated todo item.',
      };

      await updateTodoHandler(req, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        200,
        expect.objectContaining({
          id: 1,
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

      await updateTodoHandler(req, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 404, ['Todo not found']);
    });
  });

  describe('【deleteTodoHandler】', () => {
    it('Success: delete todo', async () => {
      const todoRepo = AppDataSource.getInstance().getRepository(Todo);
      await todoRepo.save({
        id: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      });

      req.params = { id: '1' };
      await deleteTodoHandler(req, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(res, 204);
    });

    it('Fail: Not Found', async () => {
      req.params = { id: '1' };
      await deleteTodoHandler(req, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 404, ['Todo not found']);
    });
  });
});
