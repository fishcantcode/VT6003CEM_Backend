import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type HotelStatus = 'available' | 'unavailable' ;

interface HotelAttributes {
  id: number;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  place_id: string;
  rating: number;
  userId?: number;
  user_ratings_total: number;
  compound_code?: string;
  vicinity?: string;
  status: HotelStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface HotelInput extends Optional<HotelAttributes, 'id'> {}
export interface HotelOutput extends Required<HotelAttributes> {}

class Hotel extends Model<HotelAttributes, HotelInput> implements HotelAttributes {
  public id!: number;
  public formatted_address!: string;
  public geometry!: {
    location: {
      lat: number;
      lng: number;
    };
  };
  public name!: string;
  public place_id!: string;
  public rating!: number;
  public userId!: number | undefined;
  public user_ratings_total!: number;
  public compound_code!: string | undefined;
  public vicinity!: string | undefined;
  public status!: HotelStatus;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Hotel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    formatted_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    geometry: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    place_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id',
    },
    user_ratings_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compound_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vicinity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('available', 'unavailable'),
      allowNull: false,
      defaultValue: 'available',
    },
  },
  {
    sequelize,
    tableName: 'hotels',
    paranoid: true,
    timestamps: true,
    underscored: true,
  }
);

export { Hotel };
