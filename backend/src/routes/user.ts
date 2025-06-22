import { Router } from 'express';
import { updateUserProfile, uploadAvatar } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();

router.put('/profile', authenticateToken, updateUserProfile);
router.post('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar);

export default router;
