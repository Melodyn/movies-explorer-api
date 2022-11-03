import mongoose from 'mongoose';
import { schemaLink } from '../validators/movies.js';
import { messages } from '../errors/index.js';

const { Schema } = mongoose;
const schemaLinkMongoose = {
  type: String,
  required: true,
  validate: {
    validator: (value) => !schemaLink.validate(value).error,
    message: () => messages.app.notURL,
  },
};

const schema = new Schema({
  country: {
    type: String,
    required: true,
    minLength: 2,
  },
  director: {
    type: String,
    required: true,
    minLength: 2,
  },
  duration: {
    type: Number,
    required: true,
    min: 0.1,
  },
  year: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 4,
  },
  description: {
    type: String,
    required: true,
    minLength: 2,
  },
  image: schemaLinkMongoose,
  trailerLink: schemaLinkMongoose,
  thumbnail: schemaLinkMongoose,
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    min: 1,
  },
  nameRU: {
    type: String,
    required: true,
    minLength: 2,
  },
  nameEN: {
    type: String,
    required: true,
    minLength: 2,
  },
}, { versionKey: false });

export const Movie = mongoose.model('Movie', schema);
