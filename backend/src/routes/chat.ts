import { Router } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import {
  createChatRoomWithOffer,
  getChatRoomsForUser,
  getAllChatRooms,
  closeChatRoom,
  getChatRoomById,
  sendMessage,
} from '../controllers/chat.controller';

const router = Router();

  
router.post('/offer/:place_id', authenticateToken, createChatRoomWithOffer);

  
router.get('/all', authenticateToken, requireRole('operator'), getAllChatRooms);

  
router.get('/', authenticateToken, getChatRoomsForUser);

  
router.get('/:chatRoomId', authenticateToken, getChatRoomById);

  
router.post('/:chatRoomId/message', authenticateToken, sendMessage);

  
router.delete('/:chatRoomId', authenticateToken, requireRole('operator'), closeChatRoom);

export default router;
