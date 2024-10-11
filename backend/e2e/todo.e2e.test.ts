import request from 'supertest';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { app } from '../src';
import { AppDataSource } from '../src/config/appDataSource';
import { Todo } from '../src/domain/entity/todo.entity';
import { User } from '@/domain/entity/user.entity';

let todoRepo: Repository<Todo>;
let userRepo: Repository<User>;
let token: string;

const loginAndGetToken = async () => {
  const user = {
    email: 'takeshi@gmail.com',
    password: 'password',
  };

  // ログインしてトークンを取得
  const response = await request(app).post('/api/auth/signin').send(user);
  return response.text; // トークンを返す
};

describe('【E2E Test Todo API 】', () => {
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    userRepo = AppDataSource.getInstance().getRepository(User);
    await userRepo.save({
      id: 1,
      name: 'takeshi',
      email: 'takeshi@gmail.com',
      password: hashedPassword,
    });
    await userRepo.save({
      id: 2,
      name: 'hanako',
      email: 'hanako@gmail.com',
      password: hashedPassword,
    });

    token = await loginAndGetToken();
  });
  afterEach(async () => {
    todoRepo = AppDataSource.getInstance().getRepository(Todo);
    userRepo = AppDataSource.getInstance().getRepository(User);

    await todoRepo.delete({});
    await userRepo.delete({});
  });
  describe('【GET /api/todos】', () => {
    it('Success: get 0 data', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('Success: get data', async () => {
      const expectedTodos = [
        {
          title: 'Test Todo1',
          userId: 1,
          content: 'This is a test todo item1.',
        },
        {
          title: 'Test Todo2',
          userId: 1,
          content: 'This is a test todo item2.',
        },
      ];
      await todoRepo.save(expectedTodos);
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          title: 'Test Todo1',
          userId: 1,
          content: 'This is a test todo item1.',
        },
        {
          title: 'Test Todo2',
          userId: 1,
          content: 'This is a test todo item2.',
        },
      ]);
    });

    it('Success: get searched data', async () => {
      const expectedTodos = [
        {
          title: 'Test Todo1',
          userId: 1,
          content: 'This is a test todo item1.',
        },
        {
          title: 'Test Todo2',
          userId: 1,
          content: 'This is a test todo item2.',
        },
      ];
      await todoRepo.save(expectedTodos);
      const response = await request(app)
        .get('/api/todos')
        .query({
          keyword: 'Todo1',
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          title: 'Test Todo1',
          userId: 1,
          content: 'This is a test todo item1.',
        },
      ]);
    });
  });

  describe('【GET /api/todos/:id】', () => {
    it('Success: get todo', async () => {
      const expected = {
        title: 'Test Todo',
        userId: 1,
        content: 'This is a test todo item.',
      };
      const createdTodo = await todoRepo.save(expected);
      const received = await request(app)
        .get(`/api/todos/${createdTodo.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(200);
      expect(received.body).toMatchObject({
        id: createdTodo.id,
        userId: 1,
        title: expected.title,
        content: expected.content,
      });
    });

    it('Fail: not founded', async () => {
      const expected = {
        title: 'Test Todo',
        userId: 1,
        content: 'This is a test todo item.',
      };
      await todoRepo.save(expected);
      const received = await request(app)
        .get(`/api/todos/2`)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(404);
      expect(received.body.errors[0]).toBe('Not Found');
    });

    it('Fail: Unauthorized', async () => {
      const expected = {
        title: 'Test Todo',
        userId: 1,
        content: 'This is a test todo item.',
      };
      await todoRepo.save(expected);
      const received = await request(app)
        .get(`/api/todos/2`)
        .set('Authorization', `Bearer token`);
      expect(received.status).toBe(401);
      expect(received.body.errors[0]).toBe('Unauthorized');
    });

    it('Fail: validation error not integer id', async () => {
      const expected = {
        userId: 1,
        title: 'Test Todo',
        content: 'This is a test todo item.',
      };
      await todoRepo.save(expected);
      const received = await request(app)
        .get(`/api/todos/aaaaa`)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('id must be a positive integer');
    });
  });

  describe('【POST /api/todos】', () => {
    it('Success: create todo', async () => {
      const expected = {
        userId: 1,
        title: 'New Todo',
        content: 'This is a new todo.',
      };

      const received = await request(app)
        .post('/api/todos')
        .send(expected)
        .set('Authorization', `Bearer ${token}`);

      expect(received.status).toBe(201);
      expect(received.body).toMatchObject(expected);
    });

    it('Success: create todo with 30 length title', async () => {
      const expected = {
        userId: 1,
        title: 'aiueo12345aiueo12345aiueo12345',
        content: 'This is a new todo.',
      };

      const received = await request(app)
        .post('/api/todos')
        .send(expected)
        .set('Authorization', `Bearer ${token}`);

      expect(received.status).toBe(201);
      expect(received.body).toMatchObject(expected);
    });

    it('Fail: validation error not title request parameter', async () => {
      const expected = {
        content: 'This is a new todo.',
      };

      const received = await request(app)
        .post('/api/todos')
        .send(expected)
        .set('Authorization', `Bearer token`);
      expect(received.status).toBe(401);
      expect(received.body.errors[0]).toBe('Unauthorized');
    });

    it('Fail: validation error not title request parameter', async () => {
      const expected = {
        content: 'This is a new todo.',
      };

      const received = await request(app)
        .post('/api/todos')
        .send(expected)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('title must not be empty');
    });

    it('Fail: validation error over title length', async () => {
      const expected = {
        title: 'aiueo12345aiueo12345aiueo12345a',
        content: 'This is a new todo.',
      };

      const received = await request(app)
        .post('/api/todos')
        .send(expected)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe(
        'title must not exceed 30 characters',
      );
    });

    it('Fail: validation error not content request parameter', async () => {
      const expected = {
        title: 'Todo1',
      };

      const received = await request(app)
        .post('/api/todos')
        .send(expected)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('content must not be empty');
    });

    it('Fail: validation multi error', async () => {
      const expected = {};

      const received = await request(app)
        .post('/api/todos')
        .send(expected)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('title must not be empty');
      expect(received.body.errors[1]).toBe('content must not be empty');
    });
  });

  describe('【PUT /api/todos】', () => {
    beforeEach(async () => {
      const todoList = [
        {
          id: 1,
          userId: 1,
          title: 'Test Todo1',
          content: 'This is a test todo item1.',
        },
        {
          id: 2,
          userId: 1,
          title: 'Test Todo2',
          content: 'This is a test todo item2.',
        },
      ];

      await todoRepo.save(todoList);
    });
    it('Success: update todo', async () => {
      const expected = {
        id: 1,
        userId: 1,
        title: 'Update Todo1',
        content: 'This is a update todo.',
      };

      const received = await request(app)
        .put(`/api/todos/${expected.id}`)
        .send({
          title: expected.title,
          content: expected.content,
        })
        .set('Authorization', `Bearer ${token}`);

      expect(received.status).toBe(200);
      expect(received.body).toMatchObject(expected);
    });

    it('Success: create todo with 30 length title', async () => {
      const expected = {
        id: 1,
        userId: 1,
        title: 'aiueo12345aiueo12345aiueo12345',
        content: 'This is a update todo.',
      };

      const received = await request(app)
        .put(`/api/todos/${expected.id}`)
        .send({
          title: expected.title,
          content: expected.content,
        })
        .set('Authorization', `Bearer ${token}`);

      expect(received.status).toBe(200);
      expect(received.body).toMatchObject(expected);
    });

    it('Fail: Not Found', async () => {
      const expected = {
        id: 4,
        userId: 1,
        title: 'aiueo12345aiueo12345aiueo12345',
        content: 'This is a update todo.',
      };

      const received = await request(app)
        .put(`/api/todos/${expected.id}`)
        .send({
          title: expected.title,
          content: expected.content,
        })
        .set('Authorization', `Bearer ${token}`);

      expect(received.status).toBe(404);
      expect(received.body.errors[0]).toBe('Not Found');
    });

    it('Fail:  validation error not integer id', async () => {
      const expected = {
        id: 'aaaa',
        userId: 1,
        title: 'aiueo12345aiueo12345aiueo12345',
        content: 'This is a update todo.',
      };

      const received = await request(app)
        .put(`/api/todos/${expected.id}`)
        .send({
          title: expected.title,
          content: expected.content,
        })
        .set('Authorization', `Bearer ${token}`);

      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('id must be a positive integer');
    });

    it('Fail: validation error not title request parameter', async () => {
      const expected = {
        id: 1,
        userId: 1,
        content: 'This is a update todo.',
      };

      const received = await request(app)
        .put(`/api/todos/${expected.id}`)
        .send({
          content: expected.content,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('title must not be empty');
    });

    it('Fail: validation error over title length', async () => {
      const expected = {
        id: 1,
        userId: 1,
        title: 'aiueo12345aiueo12345aiueo12345a',
        content: 'This is a update todo.',
      };

      const received = await request(app)
        .put(`/api/todos/${expected.id}`)
        .send({
          title: expected.title,
          content: expected.content,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe(
        'title must not exceed 30 characters',
      );
    });

    it('Fail: validation error not content request parameter', async () => {
      const expected = {
        id: 1,
        userId: 1,
        title: 'Todo1',
      };

      const received = await request(app)
        .put(`/api/todos/${expected.id}`)
        .send({
          title: expected.title,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('content must not be empty');
    });

    it('Fail: validation multi error', async () => {
      const expected = {};

      const received = await request(app)
        .put('/api/todos/aaaa')
        .send(expected)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('id must be a positive integer');
      expect(received.body.errors[1]).toBe('title must not be empty');
      expect(received.body.errors[2]).toBe('content must not be empty');
    });
  });

  describe('【DELETE /api/todos】', () => {
    beforeEach(async () => {
      const todoList = [
        {
          id: 1,
          userId: 1,
          title: 'Test Todo1',
          content: 'This is a test todo item1.',
        },
        {
          id: 2,
          userId: 1,
          title: 'Test Todo2',
          content: 'This is a test todo item2.',
        },
      ];

      await todoRepo.save(todoList);
    });
    it('Success: delete todo', async () => {
      const received = await request(app)
        .delete(`/api/todos/1`)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(204);
    });

    it('Fail: Not Found', async () => {
      const received = await request(app)
        .delete(`/api/todos/3`)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(404);
      expect(received.body.errors[0]).toBe('Not Found');
    });

    it('Fail: validation error not integer id', async () => {
      const received = await request(app)
        .delete(`/api/todos/aaaa`)
        .set('Authorization', `Bearer ${token}`);
      expect(received.status).toBe(400);
      expect(received.body.errors[0]).toBe('id must be a positive integer');
    });
  });
});
