import { AppDataSource } from '@/config/appDataSource';
import { HttpError } from '@/shared/errors/httpError';
import { User } from '@/domain/entity/user.entity';

export const findById = async (id: number) => {
  const db = AppDataSource.getInstance();
  const userRepository = db.getRepository(User);
  try {
    return await userRepository.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new HttpError(500, `Failed to find user: ${error}`);
  }
};

export const createUser = async (user: User) => {
  const db = AppDataSource.getInstance();
  const userRepository = db.getRepository(User);
  try {
    return await userRepository.save(user);
  } catch (error) {
    console.error(error);
    throw new HttpError(500, `Failed to create user: ${error}`);
  }
};
