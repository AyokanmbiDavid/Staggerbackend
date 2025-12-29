// Import required modules
import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import chatRoutes from './routes/chatRoute.js';
dotenv.config();

// Create an Express application
const app = express();

app.use(cors({
  origin: '*',
}));

// Set up middleware
app.use(express.json()); // for parsing JSON requests

// Connect to MongoDB
const MONGO_URI ='mongodb+srv://davidayokanmbi:david@cluster0.8vryv85.mongodb.net/'

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // userRoute
    app.use('/users', userRoutes);
    // chatRoute
    app.use('/chats', chatRoutes);

    // Set up server to listen on a port
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message || err);
    process.exit(1);
  }
}

start();
