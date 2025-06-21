import { Router } from 'express';

const router = Router();

// Define your API routes here
router.get('/', (req, res) => {
  res.json({ message: 'API root' });
});

export default router;