import 'tsconfig-paths/register';
import { TodoSeedData } from './todo.seed';
import { UserSeedData } from './user.seed';

const SeedData = async () => {
  console.log('Seeding started...');

  try {
    await UserSeedData();
    await TodoSeedData();
  } catch (error) {
    console.log('Seeding failed:', error);
    return;
  }
  console.log('Seeding complete!');
};

SeedData();
