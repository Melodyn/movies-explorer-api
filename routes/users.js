import { Router } from 'express';
import {
  read,
  update,
} from '../controllers/users.js';
import { celebrateBodyProfile } from '../validators/users.js';

export const router = Router();

router.get('/me', read);
router.patch('/me', celebrateBodyProfile, update);
