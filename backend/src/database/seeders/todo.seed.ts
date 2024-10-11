import { MigrationDataSource } from '@/config/migrationDataSource';
import { Todo } from '@/domain/entity/todo.entity';

export const TodoSeedData = async () => {
  const dataSource = await MigrationDataSource.initialize();
  const todoRepository = dataSource.getRepository(Todo);

  // サンプルデータ
  const todos: Array<Omit<Todo, 'createdAt' | 'updatedAt' | 'user'>> = [
    { id: 1, title: 'Todo 1', userId: 1, content: 'This is the first todo.' },
    { id: 2, title: 'Todo 2', userId: 2, content: 'This is the second todo.' },
    { id: 3, title: 'Todo 3', userId: 1, content: 'This is the third todo.' },
  ];

  // データを挿入
  for (const todo of todos) {
    const todoEntity = todoRepository.create(todo);
    await todoRepository.save(todoEntity);
  }
  await dataSource.destroy();
};
