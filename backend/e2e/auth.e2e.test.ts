import request from 'supertest';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { app } from '../src';
import { AppDataSource } from '../src/config/appDataSource';

import { User } from '@/domain/entity/user.entity';

let userRepo: Repository<User>;

describe('【E2E Test Auth API 】', () => {
  afterEach(async () => {
    userRepo = AppDataSource.getInstance().getRepository(User);

    await userRepo.delete({});
  });

  describe('POST /api/auth/signup', () => {
    it('Success: create new user', async () => {
      const user = {
        username: 'tuyoshi',
        email: 'tuyoshi@gmail.com',
        password: 'password',
      };

      const response = await request(app).post('/api/auth/signup').send(user);
      expect(response.status).toBe(201);
    });

    it('Fail: create new user with existing email', async () => {
      const user = {
        username: 'tuyoshi',
        email: 'tuyoshi@gmail.com',
        password: 'password',
      };
      const hashPassword = await bcrypt.hash(user.password, 10);
      userRepo = AppDataSource.getInstance().getRepository(User);
      await userRepo.save({
        name: user.username,
        email: user.email,
        password: hashPassword,
      });

      const response = await request(app).post('/api/auth/signup').send(user);
      expect(response.status).toBe(409);
      expect(response.body.errors[0]).toBe('Other user already use this email');
    });

    it('Fail: validation error empty parameter', async () => {
      const user = {
        username: '',
        email: '',
        password: '',
      };

      const response = await request(app).post('/api/auth/signup').send(user);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toBe('username must not be empty');
      expect(response.body.errors[1]).toBe('email must not be empty');
      expect(response.body.errors[2]).toBe(
        'email must be a valid email address',
      );
      expect(response.body.errors[3]).toBe('password must not be empty');
    });

    it('Fail: validation error not email form', async () => {
      const user = {
        username: 'takeshi',
        email: 'tahe',
        password: 'password',
      };

      const response = await request(app).post('/api/auth/signup').send(user);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toBe(
        'email must be a valid email address',
      );
    });

    it('Fail: validation error password within', async () => {
      const user = {
        username: 'takeshi',
        email: 'tahe@gmail.com',
        password: 'passwor',
      };

      const response = await request(app).post('/api/auth/signup').send(user);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toBe(
        'password must be between 8 and 20 characters',
      );
    });

    it('Fail: validation error password over', async () => {
      const user = {
        username: 'takeshi',
        email: 'tahe@gmail.com',
        password: 'passwordpasswordpassword',
      };

      const response = await request(app).post('/api/auth/signup').send(user);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toBe(
        'password must be between 8 and 20 characters',
      );
    });

    it('Fail: validation error not alphanumeric and number', async () => {
      const user = {
        username: 'takeshi',
        email: 'tahe@gmail.com',
        password: 'あいうえおあいうえお',
      };

      const response = await request(app).post('/api/auth/signup').send(user);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toBe(
        'Password must contain only alphanumeric characters',
      );
    });
  });
});
