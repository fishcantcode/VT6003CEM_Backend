import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {connectionTest} from './config/db.config';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import hotelRouter from './routes/hotel';
import chatRouter from './routes/chat';


const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());

  connectionTest();

  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/hotel', hotelRouter);
  app.use('/api/chat', chatRouter);

  app.get('/', (req, res) => {
    res.send('Hello!');
  });

  return app;
};

export default createApp;