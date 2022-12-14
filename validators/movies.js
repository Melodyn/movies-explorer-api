import { Joi, Segments } from 'celebrate';
import validator from 'validator';
import { celebrate, schemaObjectId } from './common.js';
import { messages } from '../errors/index.js';

export const schemaRouteId = schemaObjectId;
export const schemaLink = Joi.string().custom((value, helpers) => {
  if (validator.isURL(value, { protocols: ['http', 'https'] })) {
    return value;
  }
  return helpers.message(messages.app.notURL);
}).required();

export const schemaObjectRouteId = Joi.object({
  id: schemaRouteId,
}).required();
export const schemaObjectMovie = Joi.object({
  country: Joi.string().min(2).required(),
  director: Joi.string().min(2).required(),
  duration: Joi.number().min(0.1).required(),
  year: Joi.string().min(4).max(4).required(),
  description: Joi.string().min(2).required(),
  image: schemaLink,
  trailerLink: schemaLink,
  thumbnail: schemaLink,
  movieId: Joi.number().min(1).required(),
  nameRU: Joi.string().min(2).required(),
  nameEN: Joi.string().min(2).required(),
}).required();

export const segmentBodyCard = { [Segments.BODY]: schemaObjectMovie };
export const segmentParamsRouteId = { [Segments.PARAMS]: schemaObjectRouteId };

export const celebrateBodyCard = celebrate(segmentBodyCard);
export const celebrateParamsRouteId = celebrate(segmentParamsRouteId);
