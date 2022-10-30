import { Router } from 'express';
import { login, register } from '../controllers/auth.js';

export const router = Router();

router.post('/signin', login);
router.post('/signup', register);
