import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

export async function connectDB() {
  try {
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`Database: ${conn.connection.db.databaseName}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

export function getDBConnection() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  } else {
    throw new Error('Database not connected');
  }
}

export { mongoose };
export default connectDB;
