import bcrypt from 'bcryptjs';
import { signIn, signUp } from './auth.service';
import { AppDataSource } from '@/config/appDataSource';
import { User } from '@/domain/entity/user.entity';
import { HttpError } from '@/shared/errors/httpError';

describe('【Service Test Auth】', () => {
  afterEach(async () => {
    const userRepo = AppDataSource.getInstance().getRepository(User);

    await userRepo.delete({});
  });

  describe('【signUp】', () => {
    it('Success: create new user', async () => {
      const user = {
        username: 'takeshi',
        email: 'takeshi@gmail.com',
        password: 'password',
      };
      const token = await signUp(user);
      expect(token).toBeTruthy();

      const userRepo = AppDataSource.getInstance().getRepository(User);
      const createdUser = await userRepo.findOne({
        where: {
          email: user.email,
        },
      });
      expect(createdUser).toBeTruthy();
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

      try {
        await signUp(user);
      } catch (error) {
        expect(error).toEqual(
          new HttpError(409, 'Other user already use this email'),
        );
      }
    });
  });

  describe('【signIn】', () => {
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

      const token = await signIn({
        email: user.email,
        password: user.password,
      });
      expect(token).toBeTruthy();
    });

    it('Failed: sign in with invalid password', async () => {
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

      try {
        await signIn({
          email: user.email,
          password: 'password1',
        });
      } catch (error) {
        expect(error).toEqual(new HttpError(401, 'Invalid password'));
      }
    });
  });
});
