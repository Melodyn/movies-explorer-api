import { Movie } from '../models/movies.js';
import {
  HTTPError,
  BadRequestError,
  NotFoundError,
  ServerError,
  ForbiddenError,
} from '../errors/index.js';

const buildErrorServer = (message) => new ServerError(message);
const notFoundError = new NotFoundError('Запрашиваемый фильм не найден');
const forbiddenError = new ForbiddenError('Это действие выполнить можно только со своими записями');
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для фильма. ${message}`);

export const read = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const create = (req, res, next) => {
  req.body.owner = req.user._id;
  Movie.create(req.body)
    .then((newMovie) => {
      res.send(newMovie);
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

export const remove = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw notFoundError;
      } else if (movie.owner.toString() !== req.user._id) {
        throw forbiddenError;
      } else {
        return movie.remove();
      }
    })
    .then((movie) => {
      res.send(movie);
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
