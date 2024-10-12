import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DataSource } from 'typeorm';
import { AppDataSource } from './src/config/appDataSource';
import { start } from './src';
import { initTestDatabase } from './src/database/test/initTestDatabase';

let mysqlContainer: StartedTestContainer;
let dataSource: DataSource;
const dbName = 'test_db';
const username = 'test_user';
const password = 'test_password';

global.beforeAll(async () => {
  mysqlContainer = await new GenericContainer('mysql:8.0')
    .withExposedPorts(3306)
    .withEnvironment({
      MYSQL_ROOT_PASSWORD: password,
      MYSQL_DATABASE: dbName,
      MYSQL_USER: username,
      MYSQL_PASSWORD: password,
    })
    .start();

  process.env.MYSQL_CONTAINER_NAME = mysqlContainer.getHost();
  process.env.MYSQL_CONTAINER_PORT = mysqlContainer
    .getMappedPort(3306)
    .toString();
  process.env.MYSQL_USER = username;
  process.env.MYSQL_PASSWORD = password;
  process.env.MYSQL_DATABASE = dbName;
  process.env.JWT_SECRET = 'test_secret';

  // データソースを初期化
  dataSource = await AppDataSource.initialize();

  // データベースの作成
  await dataSource.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);

  await initTestDatabase(dataSource, dbName);

  await start();
}, 60000);

global.afterAll(async () => {
  if (dataSource) {
    await dataSource.destroy(); // データソースを閉じる
  }
  if (mysqlContainer) {
    await mysqlContainer.stop(); // コンテナを停止
  }
});
