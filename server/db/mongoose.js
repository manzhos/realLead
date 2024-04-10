import mongoose from "mongoose";
import 'dotenv/config'

export default function connectDB()
{
  const mongoUri = process.env.MONGODB;
  mongoose.set('strictQuery', false);
  mongoose.connect(mongoUri);
  mongoose.connection.on('error', (error) => {
    console.log(`1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`);
    console.error(`2. 🚫 Error → : ${error.message}`);
  });  
}