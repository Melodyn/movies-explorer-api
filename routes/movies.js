import { Router } from 'express';
import {
  read,
  create,
  remove,
} from '../controllers/movies.js';

export const router = Router();

router.get('/', read);
router.post('/', create);
router.delete('/:id', remove);
