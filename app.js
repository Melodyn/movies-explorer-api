import path from 'path';
import { fileURLToPath } from 'url';
// libs
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import winstonExpress from 'express-winston';
import { errors } from 'celebrate';
// modules
import { router } from './routes/index.js';
import { messages } from './errors/index.js';
import { error as errorMiddleware } from './middlewares/index.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const run = async (envName) => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const isProduction = envName.includes('prod');
  const config = dotenv.config({
    path: path.resolve(__dirname, (isProduction ? '.env' : '.env.common')),
  }).parsed;
  if (!config) {
    throw new Error(messages.app.configNotFound);
  }
  config.NODE_ENV = envName;
  config.IS_PROD = isProduction;

  const requestLogger = winstonExpress.logger({
    transports: [
      new winston.transports.File({
        filename: path.resolve(__dirname, 'request.log'),
      }),
    ],
    format: winston.format.json(),
  });
  const errorLogger = winstonExpress.errorLogger({
    transports: [
      new winston.transports.File({
        filename: path.resolve(__dirname, 'error.log'),
      }),
    ],
    format: winston.format.json(),
  });

  const allowedOrigins = [
    'http://diploma.melodyn.nomoredomains.club',
    'https://diploma.melodyn.nomoredomains.club',
  ];

  const app = express();
  app.use(cors(
    {
      origin: config.IS_PROD ? allowedOrigins : '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  ));
  app.use(rateLimit({
    message: { message: messages.app.rateLimit },
    max: 100,
  }));
  app.set('config', config);
  app.use(bodyParser.json());
  app.use(requestLogger);
  app.use(helmet());
  app.use(router);
  app.use(errorLogger);
  app.use(errors());
  app.use(errorMiddleware);

  mongoose.set('runValidators', true);
  await mongoose.connect(config.DB_URL);
  const server = app.listen(config.PORT, config.HOST, () => {
    console.log(`Server run on http://${config.HOST}:${config.PORT}`);
    process.send('ready');
  });

  const stop = async () => {
    console.log('Stop database');
    await mongoose.connection.close();
    console.log('Stop server');
    server.close();
    console.log('App stopped successfully');
    process.exit(0);
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};
