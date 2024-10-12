/**
 * E2Eテスト実行時のセットアップ処理
 * テスト実行前にtestcontainersにてテスト用のMySQLコンテナを起動し、データベースを初期化する: beforeAll
 * テスト実行後にMySQLコンテナを停止する: beforeEach
 */
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

  // テスト用の環境変数を設定
  // AppDataSource.initialize()した際に、テスト用のMySQLコンテナに接続するようにする
  process.env.MYSQL_CONTAINER_NAME = mysqlContainer.getHost();
  process.env.MYSQL_CONTAINER_PORT = mysqlContainer
    .getMappedPort(3306)
    .toString();
  process.env.MYSQL_USER = username;
  process.env.MYSQL_PASSWORD = password;
  process.env.MYSQL_DATABASE = dbName;
  process.env.JWT_SECRET = 'test_secret';

  // データソースを初期化 (テスト用のMySQLコンテナに接続)
  dataSource = await AppDataSource.initialize();

  // テスト用のDBとテーブル作成
  await initTestDatabase(dataSource, dbName);

  // expressアプリケーションにroutingを読み込ませる
  // 読み込ませないと、テスト時にルーティングが見つからないエラーが発生する
  // テストなのでサーバーは起動させない
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
