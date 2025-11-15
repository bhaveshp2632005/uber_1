import { Server } from 'socket.io';
import userModel from './models/user.model.js';
import captainModel from './models/captain.model.js';

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);

    // When user or captain joins
    socket.on('join', async (data) => {
      try {
        const { userId, userType } = data;

        if (userType === 'user') {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === 'captain') {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }

        console.log(`${userType} ${userId} joined with socket ID ${socket.id}`);
      } catch (err) {
        console.error('Error in join event:', err.message);
      }
    });

    // When captain updates location
    socket.on('update-location-captain', async (data) => {
  try {
    const { userId, location } = data;

    if (!location || location.ltd === undefined || location.lng === undefined) {
      return socket.emit('error', { message: 'Invalid location data' });
    }

    await captainModel.findByIdAndUpdate(userId, {
      location: {
        type: "Point",
        coordinates: [location.lng, location.ltd], // ✅ GeoJSON format: [lng, lat]
      }
    });

    // console.log(`📍 Captain ${userId} updated location:`, location);
  } catch (err) {
    console.error('Error updating location:', err.message);
  }
});


    // On disconnect
    socket.on('disconnect', () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });
}

export const sendMessageToSocketId = (socketId, messageObject) => {
  console.log('📤 Sending message:', messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log('⚠️ Socket.io not initialized.');
  }
};


