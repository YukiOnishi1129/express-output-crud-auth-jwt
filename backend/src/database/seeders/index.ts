import 'tsconfig-paths/register';
import { TodoSeedData } from './todo.seed';

const SeedData = async () => {
  console.log('Seeding started...');

  try {
    await TodoSeedData();
  } catch (error) {
    console.log('Seeding failed:', error);
    return;
  }
  console.log('Seeding complete!');
};

SeedData();
