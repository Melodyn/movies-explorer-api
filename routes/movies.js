import { Router } from 'express';
import {
  read,
  create,
  remove,
} from '../controllers/movies.js';
import {
  celebrateParamsRouteId,
  celebrateBodyCard,
} from '../validators/movies.js';

export const router = Router();

router.get('/', read);
router.post('/', celebrateBodyCard, create);
router.delete('/:id', celebrateParamsRouteId, remove);
