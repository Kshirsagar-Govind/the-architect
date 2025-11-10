import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
dotenv.config();

let mongoServer: MongoMemoryServer | null = null;

export const connectDB = async () => {
  try {
    // Use in-memory Mongo for tests
    if (process.env.NODE_ENV === 'test') {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('✅ In-memory MongoDB Connected');
    } else {
      const mongoURI = process.env.MONGO_URI as string;
      await mongoose.connect(mongoURI);
      console.log('✅ MongoDB Connected');
    }
  } catch (error) {
    // console.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
    console.log('Disconecting Database Connection...');
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
