import { sequelize } from './config/database';
import './models/user.model';
import './models/hotel.model';
import './models/favorite.model';
import './models'; // For associations
import createApp from './app';

const app = createApp();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
            await sequelize.sync();
      console.log('Database synchronized successfully.');
      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}
