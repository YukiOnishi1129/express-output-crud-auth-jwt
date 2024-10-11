import { signUp } from './auth.service';
import { AppDataSource } from '@/config/appDataSource';
import { User } from '@/domain/entity/user.entity';

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
  });
});
