import mongoose from 'mongoose';
import { urlRegex } from '../utils/constants.js';

const { Schema } = mongoose;

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
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegex.test(value),
      message: () => 'Ссылка должна быть http(s)-URL',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegex.test(value),
      message: () => 'Ссылка должна быть http(s)-URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegex.test(value),
      message: () => 'Ссылка должна быть http(s)-URL',
    },
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Schema.ObjectId,
    required: true,
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
