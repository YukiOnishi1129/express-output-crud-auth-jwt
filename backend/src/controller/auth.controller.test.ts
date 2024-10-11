import { Request, Response, NextFunction } from 'express';
import { mockRequest, mockResponse } from 'jest-mock-req-res';
import bcrypt from 'bcryptjs';
import { signInHandler, signUpHandler } from './auth.controller';
import { AppDataSource } from '@/config/appDataSource';
import { User } from '@/domain/entity/user.entity';
import { HttpError } from '@/shared/errors/httpError';
import { sendSuccess } from '@/shared/response/sendResponse';

jest.mock('@/shared/response/sendResponse');

let req: Request;
let res: Response;
let next: NextFunction;

describe('【Controller Test Auth】', () => {
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    const userRepo = AppDataSource.getInstance().getRepository(User);
    await userRepo.delete({});
  });

  describe('【signUpHandler】', () => {
    it('Success: create new user', async () => {
      const user = {
        username: 'tuyoshi',
        email: 'tuyoshi@gmail.com',
        password: 'password',
      };
      req.body = user;
      await signUpHandler(req, res, next);
      expect(sendSuccess).toHaveBeenCalledWith(res, 201, expect.any(String));
    });

    it('Fail: create new user with existing email', async () => {
      const user = {
        username: 'takeshi',
        email: 'takeshi@gmail.com',
        password: 'password',
      };
      const hashPassword = await bcrypt.hash(user.password, 10);
      const userRepo = AppDataSource.getInstance().getRepository(User);
      await userRepo.save({
        name: user.username,
        email: user.email,
        password: hashPassword,
      });

      req.body = user;
      try {
        await signUpHandler(req, res, next);
      } catch (error) {
        expect(error).toEqual(
          new HttpError(409, 'Other user already use this email'),
        );
      }
    });
  });

  describe('【signInHandler】', () => {
    it('Success: sign in', async () => {
      const user = {
        username: 'takeshi',
        email: 'takeshi@gmail.com',
        password: 'password',
      };
      const hashPassword = await bcrypt.hash(user.password, 10);
      const userRepo = AppDataSource.getInstance().getRepository(User);
      await userRepo.save({
        name: user.username,
        email: user.email,
        password: hashPassword,
      });

      req.body = {
        email: user.email,
        password: user.password,
      };
      await signInHandler(req, res, next);
      expect(sendSuccess).toHaveBeenCalledWith(res, 200, expect.any(String));
    });

    it('Fail: sign in with invalid password', async () => {
      const user = {
        username: 'takeshi',
        email: 'takeshi@gmail.com',
        password: 'password',
      };
      const hashPassword = await bcrypt.hash(user.password, 10);
      const userRepo = AppDataSource.getInstance().getRepository(User);
      await userRepo.save({
        name: user.username,
        email: user.email,
        password: hashPassword,
      });

      req.body = {
        email: user.email,
        password: 'invalidPassword',
      };

      try {
        await signInHandler(req, res, next);
      } catch (error) {
        expect(error).toEqual(new HttpError(401, 'Invalid password'));
      }
    });

    it('Fail: sign in with invalid email', async () => {
      const user = {
        username: 'takeshi',
        email: 'takeshi@gmail.com',
        password: 'password',
      };
      const hashPassword = await bcrypt.hash(user.password, 10);
      const userRepo = AppDataSource.getInstance().getRepository(User);
      await userRepo.save({
        name: user.username,
        email: user.email,
        password: hashPassword,
      });

      req.body = {
        email: 'takesi@gmail.com',
        password: 'password',
      };

      try {
        await signInHandler(req, res, next);
      } catch (error) {
        expect(error).toEqual(new HttpError(404, 'User not found'));
      }
    });
  });
});
