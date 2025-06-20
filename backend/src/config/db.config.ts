import { connect, set } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

//db connection
export const DBconnect = async () => {
  try {
    set('strictQuery', false);
    const db = await connect(MONGODB_URI as string);
    console.log('MongoDB is connected to', db.connection.name);
  } catch (error) {
    console.error(error);

  }
};