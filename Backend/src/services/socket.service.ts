import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import MessageModel from '../models/message.model';
import mongoose from 'mongoose';

// Interface for online users
interface OnlineUsers {
  [userId: string]: string; // userId: socketId
}

// Function to setup Socket.io server
export const setupSocketIO = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true
    }
  });

  // Track online users
  const onlineUsers: OnlineUsers = {};

  // Middleware to authenticate socket connections
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);
    
    const userId = socket.data.user?._id;
    
    if (userId) {
      // Add user to online users
      onlineUsers[userId] = socket.id;
      
      // Inform clients about online status changes
      io.emit('userStatus', { userId, status: 'online' });
      
      console.log('User connected:', userId);
      console.log('Online users:', Object.keys(onlineUsers));
    }

    // Handle private messages
    socket.on('privateMessage', async (data) => {
      try {
        const { recipient, content, images } = data;
        const sender = socket.data.user._id;
        
        if (!recipient || !sender) {
          socket.emit('messageError', { message: 'Sender and recipient are required' });
          return;
        }
        
        // Create and save message to database
        const message = await MessageModel.create({
          content: content || "",
          images: images || "",
          sender: new mongoose.Types.ObjectId(sender),
          receipent: new mongoose.Types.ObjectId(recipient),
          read: false
        });
        
        const messageObj = message.toObject();
        
        // Send to recipient if online
        const recipientSocketId = onlineUsers[recipient];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('newMessage', messageObj);
        }
        
        // Send back to sender for confirmation
        socket.emit('messageSent', messageObj);
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('messageError', { message: 'Failed to send message' });
      }
    });

    // Handle read receipts
    socket.on('markAsRead', async (data) => {
      try {
        const { messageIds, senderId } = data;
        const recipientId = socket.data.user._id;
        
        if (!senderId || !recipientId) {
          return;
        }
        
        // Update messages as read
        await MessageModel.updateMany(
          {
            sender: new mongoose.Types.ObjectId(senderId),
            receipent: new mongoose.Types.ObjectId(recipientId),
            read: false
          },
          { read: true }
        );
        
        // Notify the original sender that messages were read
        const senderSocketId = onlineUsers[senderId];
        if (senderSocketId) {
          io.to(senderSocketId).emit('messagesRead', { 
            by: recipientId, 
            at: new Date() 
          });
        }
        
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { recipient } = data;
      const sender = socket.data.user._id;
      
      const recipientSocketId = onlineUsers[recipient];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userTyping', { userId: sender });
      }
    });

    // Handle stop typing indicators
    socket.on('stopTyping', (data) => {
      const { recipient } = data;
      const sender = socket.data.user._id;
      
      const recipientSocketId = onlineUsers[recipient];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userStopTyping', { userId: sender });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      if (userId && onlineUsers[userId]) {
        delete onlineUsers[userId];
        io.emit('userStatus', { userId, status: 'offline' });
        console.log('User disconnected:', userId);
        console.log('Online users:', Object.keys(onlineUsers));
      }
    });
  });

  return io;
};
