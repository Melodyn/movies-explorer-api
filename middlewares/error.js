import { constants } from 'http2';
import { messages } from '../errors/index.js';

export const error = (err, req, res, next) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || messages.app.unknown;
  res.status(statusCode).send({ message });
  next();
};
