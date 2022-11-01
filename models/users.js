import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../errors/index.js';
import { schemaEmail } from '../validators/users.js';

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
      validator: (value) => !schemaEmail.validate(value).error,
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
    findOneAndValidatePassword({ password, email }) {
      return this.findOne({ email })
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
