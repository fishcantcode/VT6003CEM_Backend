import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import hotelRoutes from './hotel';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/hotel', hotelRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'API root' });
});

export default router;