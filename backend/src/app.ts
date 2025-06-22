import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {connectionTest} from './config/db.config';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';


const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());

  connectionTest();

  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);

  app.get('/', (req, res) => {
    res.send('Hello!');
  });

  return app;
};

export default createApp;