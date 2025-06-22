import { Router } from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadAvatar, 
  userConnectionTest, 
  getAvatar, 
  getUserRole,
  getUserId,

} from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();

 
router.get('/connection-test', userConnectionTest);

router.get('/profile', authenticateToken, getUserProfile);

router.put('/profile', authenticateToken, updateUserProfile);

router.post('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar);

router.get('/avatar', authenticateToken, getAvatar);

router.get('/id', authenticateToken, getUserId);

router.get('/role', authenticateToken, getUserRole);

 

export default router;
