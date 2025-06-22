import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface MessageAttributes {
  id: string; // msg_<timestamp>
  chatRoomId: string;
  senderId: number;
  content: string;
  status: MessageStatus;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageInput extends Optional<MessageAttributes, 'id' | 'status' | 'timestamp'> {}
export interface MessageOutput extends Required<MessageAttributes> {}

class Message extends Model<MessageAttributes, MessageInput> implements MessageAttributes {
  public id!: string;
  public chatRoomId!: string;
  public senderId!: number;
  public content!: string;
  public status!: MessageStatus;
  public timestamp?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    chatRoomId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'chat_rooms',
        key: 'id',
      },
      field: 'chat_room_id',
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'sender_id',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read'),
      allowNull: false,
      defaultValue: 'sent',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

export { Message };
