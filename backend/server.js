import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';


// Import routes
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import learningPathsRoutes from './routes/learningPathsRoutes.js'

// Load environment variables
dotenv.config();

import Message from './models/MessageModel.js';

// Initialize the connectedUsers map and export it
export const connectedUsers = new Map();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
import connectDB from './config/db.js';
connectDB();

// Configure multer to preserve file extensions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "icons/"); // Save files to the /icons directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // Get the file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + extension); // Include the extension in the filename
  },
});

const upload = multer({ storage });


// Static files
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));
app.use('/icons', express.static('icons'));

// Endpoint to handle icon uploads
app.post("/api/upload-icon", upload.single("icon"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Return the filename to the frontend
  res.json({ filename: req.file.filename });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api', learningPathsRoutes)

io.on('connection', (socket) => {
  const { subcategory } = socket.handshake.query;
  
  // Add userId to the socket object for persistent tracking
  socket.userId = null;

  // Ensure the socket joins the room immediately upon connection
  if (subcategory) {
    socket.join(subcategory);
    console.log(`Socket ${socket.id} joined room: ${subcategory}`);
  } else {
    console.error('No subcategory provided in socket connection');
    socket.disconnect();
    return;
  }

  socket.on('userConnected', (user) => {
    if (!user || !user._id) {
      console.error('Invalid user object received:', user);
      socket.emit('error', 'Invalid user data');
      return;
    }

    // Store userId both on the socket object and in a variable
    socket.userId = user._id;
    console.log(`User ID set: ${socket.userId}`);

    // Initialize subcategory map if it doesn't exist
    if (!connectedUsers.has(subcategory)) {
      connectedUsers.set(subcategory, new Map());
    }

    connectedUsers.get(subcategory).set(socket.userId, {
      _id: user._id,
      username: user.username,
      socketId: socket.id
    });

    // Send updated user list to all clients in this subcategory
    io.to(subcategory).emit('users', Array.from(connectedUsers.get(subcategory).values()));
    console.log(`User ${user.username} connected to ${subcategory} community`);
  });

  socket.on('sendMessage', async (message, callback) => {
    try {
      // Log for debugging
      console.log('Message sender:', message.sender);
      console.log('Current userId (socket):', socket.userId);
      
      // Check if user is properly authenticated
      if (!socket.userId) {
        throw new Error('You must be connected with a valid user ID to send messages');
      }
      
      // Convert both IDs to strings for comparison
      const senderId = String(message.sender);
      const currentUserId = String(socket.userId);
      
      // Validate sender matches the authenticated user
      if (!senderId || senderId !== currentUserId) {
        throw new Error(`Unauthorized message sender: ${senderId} vs ${currentUserId}`);
      }

      const newMessage = new Message({
        content: message.content,
        sender: message.sender,
        senderName: message.senderName,
        subcategory: message.subcategory,
        timestamp: message.timestamp
      });

      const savedMessage = await newMessage.save();

      // Broadcast the saved message to all users in the subcategory
      io.to(message.subcategory).emit('message', savedMessage);

      // Acknowledge success to the sender
      if (callback) callback({ status: 'success', message: savedMessage });
    } catch (error) {
      console.error('Error saving message:', error);
      if (callback) callback({ status: 'error', error: error.message });
    }
  });

  socket.on('disconnect', () => {
    const userId = socket.userId;
    
    if (userId && subcategory && connectedUsers.has(subcategory)) {
      connectedUsers.get(subcategory).delete(userId);

      if (connectedUsers.get(subcategory).size === 0) {
        connectedUsers.delete(subcategory);
      } else {
        io.to(subcategory).emit('users', Array.from(connectedUsers.get(subcategory).values()));
      }
      console.log(`User disconnected from ${subcategory} community`);
    }
  });

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});