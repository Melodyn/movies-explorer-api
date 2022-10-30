import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/index.js';

export const auth = (req, res, next) => {
  const { authorization = '' } = req.headers;
  if (!authorization) {
    next(new UnauthorizedError('Токен отсутствует'));
  } else {
    const token = authorization.replace(/^Bearer*\s*/i, '');
    const { JWT_SECRET } = req.app.get('config');
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { _id: decoded._id };
      next();
    } catch (err) {
      next(new UnauthorizedError('Токен невалидный'));
    }
  }
};
