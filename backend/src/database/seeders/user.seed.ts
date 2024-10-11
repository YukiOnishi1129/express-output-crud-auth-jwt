import bcrypt from 'bcryptjs';
import { MigrationDataSource } from '@/config/migrationDataSource';
import { User } from '@/domain/entity/user.entity';

export const UserSeedData = async () => {
  const dataSource = await MigrationDataSource.initialize();
  const userRepository = dataSource.getRepository(User);

  const hashedPassword = await bcrypt.hash('password', 10);

  // Sample data
  const users: Array<Omit<User, 'createdAt' | 'updatedAt' | 'deletedAt'>> = [
    {
      id: 1,
      name: 'takeshi',
      email: 'takeshi@gmail.com',
      password: hashedPassword,
    },
    {
      id: 2,
      name: 'hanako',
      email: 'hanako@gmail.com',
      password: hashedPassword,
    },
  ];

  // Insert data
  for (const user of users) {
    const userEntity = userRepository.create(user);
    await userRepository.save(userEntity);
  }
  await dataSource.destroy();
};
