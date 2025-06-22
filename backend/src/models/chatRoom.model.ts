import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ChatRoomAttributes {
  id: string; // e.g. chat_<hotel_place_id>_<user_id>
  hotelId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatRoomInput extends Optional<ChatRoomAttributes, 'id'> {}
export interface ChatRoomOutput extends Required<ChatRoomAttributes> {}

class ChatRoom
  extends Model<ChatRoomAttributes, ChatRoomInput>
  implements ChatRoomAttributes
{
  public id!: string;
  public hotelId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatRoom.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id',
      },
      field: 'hotel_id',
    },
  },
  {
    sequelize,
    tableName: 'chat_rooms',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

export { ChatRoom };
