import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import {
  HTTPError,
  BadRequestError,
  ConflictError,
  ServerError,
  messages, mongoNotUniqueCode,
} from '../errors/index.js';

const buildErrorServer = (message) => new ServerError(message);
const errorNotUnique = new ConflictError(messages.user.alreadyExist);
const buildErrorBadRequest = (message) => new BadRequestError(`${messages.user.validation} ${message}`);

export const login = (req, res, next) => {
  User.findOneAndValidatePassword(req.body)
    .then((userData) => {
      const { JWT_SECRET, JWT_EXPIRES } = req.app.get('config');
      const token = jwt.sign({ _id: userData._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
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
      } else if (err.code === mongoNotUniqueCode) {
        next(errorNotUnique);
      } else if (err.name === 'ValidationError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};
