import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.config";

interface ProfileAttributes {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export interface UserAttributes {
  id?: number;
  username: string;
  profile: ProfileAttributes;
  email: string;
  password?: string;
  avatar?: Buffer;
  avatarImage?: string;
  isEmployee?: boolean;
  role?: "user" | "operator";
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public profile!: ProfileAttributes;
  public email!: string;
  public password?: string;
  public avatar?: Buffer;
  public avatarImage?: string;
  public isEmployee!: boolean;
  public role!: "user" | "operator";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public lastLoginAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatarImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    isEmployee: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);
