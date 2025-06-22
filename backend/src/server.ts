import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from './config/db.config';
import createApp from './app';

const app = createApp();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  });
}
