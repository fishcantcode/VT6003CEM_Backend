import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Favorite extends Model {
  public id!: number;
  public userId!: number;
  public hotelId!: number;
}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'favorites',
    timestamps: true,
    paranoid: false, // Favorites are a direct link, no need for soft delete
    underscored: true,
  }
);
