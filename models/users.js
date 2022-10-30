import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { emailRegex } from '../utils/constants.js';
import { UnauthorizedError } from '../errors/index.js';

const { Schema } = mongoose;

const unauthorizedError = new UnauthorizedError('Пользователь с такими данными не найден');

const schema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: () => 'Почта должна быть вида a@b.c',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 8,
  },
}, {
  versionKey: false,
  statics: {
    findOneAndValidatePassword({ password, ...where }) {
      return this.findOne(where)
        .select('+password')
        .then((user) => {
          if (!user) {
            throw unauthorizedError;
          }

          return bcrypt.compare(password, user.password)
            .then((isSuccess) => {
              if (!isSuccess) {
                throw unauthorizedError;
              }
              const { password: removed, ...fields } = user.toObject();
              return fields;
            });
        });
    },
  },
});

export const User = mongoose.model('User', schema);
