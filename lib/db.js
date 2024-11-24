import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('يرجى تعريف MONGODB_URI في ملف .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('🚀 Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ New MongoDB connection established');
    return db;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectDB;