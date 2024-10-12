/**
 * マイグレーション用のデータソース
 * API起動時には使用しない
 */

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const MigrationDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST_USING_MIGRATION,
  port: Number(process.env.MYSQL_PORT_USING_MIGRATION) || undefined,
  username: process.env.MYSQL_USER_USING_MIGRATION,
  password: process.env.MYSQL_PASSWORD_USING_MIGRATION,
  database: process.env.MYSQL_DATABASE_USING_MIGRATION,
  entities: ['src/domain/entity/*.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  logging: true,
  // synchronize: true,
});
