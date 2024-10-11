import { Router } from 'express';
import authRouter from '@/routes/auth.route';
import todoRouter from '@/routes/todo.route';

const apiRouter = Router();

// 各ドメインのルーティングを設定
apiRouter.use('/todos', todoRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
