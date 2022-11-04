import { Joi, Segments } from 'celebrate';
import { celebrate } from './common.js';

export const schemaName = Joi.string().min(2).max(30);
export const schemaEmail = Joi.string().email();
export const schemaPassword = Joi.string().min(8).required();

export const schemaObjectProfile = Joi.object({
  name: schemaName,
  email: schemaEmail,
}).required();
export const schemaObjectAuth = Joi.object({
  email: schemaEmail.required(),
  password: schemaPassword,
}).required();
export const schemaObjectUser = schemaObjectAuth
  .concat(schemaObjectAuth)
  .concat(Joi.object({
    name: schemaName.required(),
  }).required());

export const segmentBodyProfile = { [Segments.BODY]: schemaObjectProfile };
export const segmentBodyAuth = { [Segments.BODY]: schemaObjectAuth };
export const segmentBodyUser = { [Segments.BODY]: schemaObjectUser };

export const celebrateBodyProfile = celebrate(segmentBodyProfile);
export const celebrateBodyAuth = celebrate(segmentBodyAuth);
export const celebrateBodyUser = celebrate(segmentBodyUser);
