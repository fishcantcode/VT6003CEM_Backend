import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import api from './api/api';

import { notFound, errorHandler } from "./middlewares/middleware";



const app = express();
const port = process.env.PORT || 3000;

dotenv.config({ path: './.env' });

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet())
app.use(cors())

// Routes
app.use('/api', api);

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(notFound);
app.use(errorHandler);

export default app;