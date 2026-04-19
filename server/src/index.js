import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import Routes (To be created)
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Rides App API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/user', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_ride', (rideId) => {
    socket.join(`ride_${rideId}`);
    console.log(`User ${socket.id} joined ride: ride_${rideId}`);
  });

  socket.on('join_drivers', () => {
    socket.join('drivers');
    console.log(`Driver ${socket.id} joined drivers pool`);
  });

  socket.on('update_location', (data) => {
    // data: { rideId, lat, lng }
    io.to(`ride_${data.rideId}`).emit('location_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
