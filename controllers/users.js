import { User } from '../models/users.js';
import {
  HTTPError,
  BadRequestError,
  NotFoundError,
  ServerError,
  ConflictError,
  messages,
} from '../errors/index.js';

const notFoundError = new NotFoundError(messages.user.notFound);
const conflictError = new ConflictError(messages.user.conflict);
const buildErrorServer = (message) => new ServerError(message);
const buildErrorBadRequest = (message) => new BadRequestError(`${messages.user.validation} ${message}`);

export const read = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const update = (req, res, next) => {
  const query = User.find().or(req.user);
  if (req.body.email) {
    query.or({ email: req.body.email });
  }

  query
    .then((users) => {
      if (users.length === 0) {
        throw notFoundError;
      } else if (users.length > 1) {
        throw conflictError;
      } else {
        const [userDoc] = users;
        const user = {
          ...userDoc.toObject(),
          ...req.body,
        };
        return userDoc.updateOne(req.body).then(() => user);
      }
    })
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};
