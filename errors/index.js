export { AppError } from './AppError.js';
export { HTTPError } from './HTTPError.js';
export { ServerError } from './ServerError.js';
export { ConflictError } from './ConflictError.js';
export { NotFoundError } from './NotFoundError.js';
export { ForbiddenError } from './ForbiddenError.js';
export { BadRequestError } from './BadRequestError.js';
export { UnauthorizedError } from './UnauthorizedError.js';

export const mongoNotUniqueCode = 11000;
export const messages = {
  app: {
    unknown: 'Неизвестная ошибка',
    configNotFound: 'Не найден конфиг для этого окружения',
    rateLimit: 'Слишком много запросов',
    unauthorized: 'Необходима авторизация',
    noPage: 'Запрашиваемая страница не найдена',
    notURL: 'Ссылка должна быть http(s)-URL',
  },
  user: {
    alreadyExist: 'Пользователь с такой почтой уже существует',
    validation: 'Некорректные данные для пользователя.',
    notFound: 'Запрашиваемый пользователь не найден',
    conflict: 'Данные принадлежат другому пользователю',
  },
  movie: {
    validation: 'Некорректные данные для фильма.',
    notFound: 'Запрашиваемый фильм не найден',
    anotherOwner: 'Это действие выполнить можно только со своими записями',
  },
};
