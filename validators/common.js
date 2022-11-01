import { Joi, Segments, celebrator } from 'celebrate';

export const celebrate = celebrator({ mode: 'full' }, { allowUnknown: true, abortEarly: false });

export const schemaObjectId = Joi.string().hex().length(24).required();

export const schemaObjectObjectId = Joi.object({
  id: schemaObjectId,
}).required();

export const segmentParamsObjectId = { [Segments.PARAMS]: schemaObjectObjectId };

export const celebrateParamsObjectId = celebrate(segmentParamsObjectId);
