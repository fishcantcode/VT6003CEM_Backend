import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ChatRoom, ChatParticipant, Hotel, Message, User } from '../models';

// Zod schema to validate message payloads
const messageSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  senderId: z.number(),
});

export const createChatRoomWithOffer = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { place_id } = req.params;
    const currentUser = req.user;
    if (!currentUser) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

  
    const hotel = await Hotel.findOne({ where: { place_id } });
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    const chatRoomId = `chat_${hotel.place_id}_${currentUser.email}`;

  
    let chatRoom = await ChatRoom.findByPk(chatRoomId, {
      include: [
        { model: Hotel, as: 'hotel', attributes: ['place_id', 'name', 'formatted_address'] },
        { model: User, as: 'participants', attributes: ['id', 'username', 'email', 'avatarImage', 'profile', 'role'] },
        { model: Message, as: 'messages', order: [['createdAt', 'ASC']], include: [{ model: User, as: 'sender', attributes: ['id', 'email', 'username', 'avatarImage', 'role'] }] },
      ],
    });

    if (!chatRoom) {
  
      chatRoom = await ChatRoom.create({ id: chatRoomId, hotelId: hotel.id });

  
      const operators = await User.findAll({ where: { role: 'operator' } });
      const participantRows = [
        { chatRoomId, userId: currentUser.id },
        ...operators.map((op) => ({ chatRoomId, userId: op.id })),
      ];
      await ChatParticipant.bulkCreate(participantRows, { ignoreDuplicates: true });

  
      await Message.create({
        id: `msg_${Date.now()}`,
        chatRoomId: chatRoomId,
        senderId: currentUser.id,
        content: `I am interested in making an offer for ${hotel.name}.`,
      });

  
      chatRoom = await ChatRoom.findByPk(chatRoomId, {
        include: [
          { model: Hotel, as: 'hotel', attributes: ['place_id', 'name', 'formatted_address'] },
          { model: User, as: 'participants', attributes: ['id', 'username', 'email', 'avatarImage', 'profile', 'role'] },
          { model: Message, as: 'messages', order: [['createdAt', 'ASC']], include: [{ model: User, as: 'sender', attributes: ['id', 'email', 'username', 'avatarImage', 'role'] }] },
        ],
      });
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: msg });
  }
};

export const getChatRoomsForUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const chatRooms = await ChatRoom.findAll({
      include: [
        { model: User, as: 'participants', where: { id: currentUser.id }, attributes: ['id', 'username', 'email', 'avatarImage', 'profile', 'role'] },
        { model: Hotel, as: 'hotel', attributes: ['place_id', 'name', 'formatted_address'] },
        { model: Message, as: 'messages', order: [['createdAt', 'DESC']], limit: 1, include: [{ model: User, as: 'sender', attributes: ['id', 'email'] }] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getChatRoomById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatRoomId } = req.params;
    const chatRoom = await ChatRoom.findByPk(chatRoomId, {
      include: [
        { model: Hotel, as: 'hotel', attributes: ['place_id', 'name', 'formatted_address'] },
        { model: User, as: 'participants', attributes: ['id', 'username', 'email', 'avatarImage', 'profile', 'role'] },
        { model: Message, as: 'messages', order: [['createdAt', 'ASC']], include: [{ model: User, as: 'sender', attributes: ['id', 'email', 'username', 'avatarImage', 'role'] }] },
      ],
    });
    if (!chatRoom) {
      res.status(404).json({ message: 'Chat room not found' });
      return;
    }
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatRoomId } = req.params;
    const validation = messageSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
      return;
    }
    const { content, senderId } = validation.data;

    // senderId must match authenticated user
    if (senderId !== req.user?.id) {
      res.status(403).json({ message: 'senderId mismatch with authenticated user' });
      return;
    }

    const currentUser = req.user;
    if (!currentUser) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

  
    let isParticipant = await ChatParticipant.findOne({ where: { chatRoomId, userId: currentUser.id } });
    if (!isParticipant) {
      if (currentUser.role === 'operator') {
        await ChatParticipant.create({ chatRoomId, userId: currentUser.id });
      } else {
        res.status(403).json({ message: 'Not a participant of this chat room' });
        return;
      }
    }

    const newMessage = await Message.create({
      id: `msg_${Date.now()}`,
      chatRoomId,
      senderId,
      content,
    });

    // reload with sender association to include email
    const message = await Message.findByPk(newMessage.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'email', 'username', 'avatarImage', 'role'] }],
    });

  
    await ChatRoom.update({ updatedAt: new Date() }, { where: { id: chatRoomId } });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllChatRooms = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const rooms = await ChatRoom.findAll({
      include: [
        { model: Hotel, as: 'hotel', attributes: ['place_id', 'name', 'formatted_address'] },
        { model: User, as: 'participants', attributes: ['id', 'username', 'email', 'avatarImage', 'profile', 'role'] },
        { model: Message, as: 'messages', order: [['createdAt', 'DESC']], limit: 1, include: [{ model: User, as: 'sender', attributes: ['id', 'email'] }] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const closeChatRoom = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatRoomId } = req.params;
    const room = await ChatRoom.findByPk(chatRoomId);
    if (!room) {
      res.status(404).json({ message: 'Chat room not found' });
      return;
    }
    await room.destroy();
    res.status(200).json({ message: 'Chat room closed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
