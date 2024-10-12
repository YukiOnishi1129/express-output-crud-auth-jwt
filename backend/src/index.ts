import 'reflect-metadata';
import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { AppDataSource } from '@/config/appDataSource';
import apiRouter from '@/routes';
import { errorHandler } from '@/middleware/errorHandler';

dotenv.config();

export const API_BASE_URL = '/api';

export const app = express();

export const start = async () => {
  const port = process.env.PORT || 3000;

  const corsOptions = {
    origin: [process.env.FRONTEND_BASE_URL || 'http://localhost:3000'], // 許可したいドメイン
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 許可したいHTTPメソッド
    allowedHeaders: ['Content-Type', 'Authorization'], // 許可したいヘッダー
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  AppDataSource.initialize()
    .then(() => {
      // ルーティング設定
      app.use(API_BASE_URL, apiRouter);
      app.use(errorHandler);

      // テスト実行時にはサーバー起動させない
      if (process.env.NODE_ENV !== 'test') {
        app.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
        });
      }
    })
    .catch((error) => {
      console.error('Error during Data Source initialization:', error);
    });
};

// テスト時はサーバーを起動しない
if (process.env.NODE_ENV !== 'test') {
  start();
}
