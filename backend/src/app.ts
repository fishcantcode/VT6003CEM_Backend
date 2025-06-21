import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {connectionTest} from './config/db.config';



const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet())
app.use(cors())

connectionTest();

app.get('/', (req, res) => {
  res.send('Hello!');
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


export default app;