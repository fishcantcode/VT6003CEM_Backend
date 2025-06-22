import { User, UserAttributes } from './user.model';
import { Hotel } from './hotel.model';
import { Favorite } from './favorite.model';
import { ChatRoom } from './chatRoom.model';
import { Message } from './message.model';
import { ChatParticipant } from './chatParticipant.model';

 
User.belongsToMany(Hotel, { 
  through: Favorite, 
  foreignKey: 'userId', 
  as: 'favoriteHotels' 
});

Hotel.belongsToMany(User, { 
  through: Favorite, 
  foreignKey: 'hotelId', 
  as: 'favoritedBy' 
});

  
ChatRoom.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });
User.belongsToMany(ChatRoom, { through: ChatParticipant, foreignKey: 'userId', as: 'chatRooms' });
ChatRoom.belongsToMany(User, { through: ChatParticipant, foreignKey: 'chatRoomId', as: 'participants' });

  
ChatRoom.hasMany(Message, { foreignKey: 'chatRoomId', as: 'messages' });
Message.belongsTo(ChatRoom, { foreignKey: 'chatRoomId', as: 'chatRoom' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

 
export {
  User,
  Hotel,
  Favorite,
  ChatRoom,
  ChatParticipant,
  Message,
  UserAttributes
};
