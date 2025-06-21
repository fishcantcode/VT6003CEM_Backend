import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.config";

export interface UserAttributes {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  avatarImage?: string;
  isEmployee: boolean;
  role: "user" | "operator";
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "avatarImage" | "role" | "createdAt" | "updatedAt"
  > {}
export class User
  extends Model<UserAttributes, Optional<UserAttributes, "id">>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public firstname: string;
  public lastname: string;
  public email!: string;
  public password!: string;
  public avatarImage?: string;
  public role!: "user" | "operator";
  public isEmployee!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
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
    isEmployee: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
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
