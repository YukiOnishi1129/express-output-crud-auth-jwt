import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

let instance: DataSource;

export const AppDataSource = {
  getInstance: (): DataSource => {
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

  initialize: async () => {
    const dataSource = AppDataSource.getInstance();
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    return dataSource;
  },
};
