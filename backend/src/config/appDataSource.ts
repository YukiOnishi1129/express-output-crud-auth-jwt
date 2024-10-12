/**
 * APIで使うデータソース
 */
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

// シングルトンパターンでデータソースを生成
// シングルトンにすることで、アプリケーション全体で同じデータソースを使い回す
// これにより、データソースの接続数を抑えることができる (接続数が多いとDBサーバーに負荷がかかる)
// テスト時には、テスト用のデータソースを生成する (jest.setup.tsなどでテスト用の環境変数を書き換える処理を記載している)
let instance: DataSource;

export const AppDataSource = {
  // データソースの初期化
  getInstance: (): DataSource => {
    // データソースのインスタンスがない場合は生成
    // 生成済みの場合はそのまま返す (getInstanceメソッドを呼び出すたびに新しいインスタンスを生成しない)
    if (!instance) {
      instance = new DataSource({
        type: 'mysql',
        host: process.env.MYSQL_CONTAINER_NAME,
        port: Number(process.env.MYSQL_CONTAINER_PORT) || undefined,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        entities: ['src/domain/entity/*.ts'],
        migrations: ['src/database/migrations/**/*.ts'],
        logging: false,
      });
    }
    return instance;
  },

  // データソースの初期化
  initialize: async () => {
    const dataSource = AppDataSource.getInstance();
    // データソースが初期化されていない場合は初期化処理を実行
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    return dataSource;
  },
};
