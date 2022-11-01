import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import {
  HTTPError,
  BadRequestError,
  ConflictError,
  ServerError,
} from '../errors/index.js';

const buildErrorServer = (message) => new ServerError(message);
const errorNotUnique = new ConflictError('Пользователь с такой почтой уже существует');
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);

export const login = (req, res, next) => {
  User.findOneAndValidatePassword(req.body)
    .then((userData) => {
      const { JWT_SECRET } = req.app.get('config');
      const token = jwt.sign({ _id: userData._id }, JWT_SECRET, { expiresIn: '1w' });
      res.send({ token });
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      return User.create(req.body);
    })
    .then((document) => {
      const { password: removed, ...fields } = document.toObject();
      res.send(fields);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.code === 11000) {
        next(errorNotUnique);
      } else if (err.name === 'ValidationError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};
