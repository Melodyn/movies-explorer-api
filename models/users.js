import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnauthorizedError, NotFoundError } from '../errors/index.js';
import { schemaEmail } from '../validators/users.js';
import { messages } from '../errors/index.js';

const { Schema } = mongoose;

const notFoundError = new NotFoundError(messages.user.incorrect);
const unauthorizedError = new UnauthorizedError(messages.user.incorrect);

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
      message: () => messages.app.notEmail,
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
            throw notFoundError;
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
