import { Sequelize } from "sequelize";

//test only

const sequelize = new Sequelize(
  process.env.PGDATABASE as string,
  process.env.PGUSER as string,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: process.env.NODE_ENV === "production" ? 20 : 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
    },
  }
);

export const connectionTest = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection success");
    return true;
  } catch (error) {
    console.error("Database unable to connect, error:", error);
    return false;
  }
};

export { sequelize };