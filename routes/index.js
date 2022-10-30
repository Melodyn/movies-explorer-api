import { Router } from 'express';
import { NotFoundError } from '../errors/NotFoundError.js';
import { auth } from '../middlewares/auth.js';
import { router as userRouter } from './users.js';
import { router as movieRouter } from './movies.js';
import { router as authRouter } from './auth.js';

export const router = new Router();

router.use('/', authRouter);
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});
