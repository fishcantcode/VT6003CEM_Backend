import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class ChatParticipant extends Model {
  public id!: number;
  public chatRoomId!: string;
  public userId!: number;
}

ChatParticipant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chatRoomId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'chat_rooms',
        key: 'id',
      },
      field: 'chat_room_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id'
    },
  },
  {
    sequelize,
    tableName: 'chat_participants',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

export { ChatParticipant };
