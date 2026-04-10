import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  socket = null;

  connect() {
    if (this.socket) return;
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      // Optionally, try to reconnect
      this.connect();
    });

    this.socket.on('error', (err) => {
      console.error('Socket error:', err);
      // Optionally, handle the error appropriately
    });

    this.socket.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRide(rideId) {
    if (!this.socket) this.connect();
    this.socket.emit('join_ride', rideId);
  }

  onStatusUpdate(callback) {
    if (!this.socket) this.connect();
    this.socket.on('status_update', callback);
  }

  onLocationUpdate(callback) {
    if (!this.socket) this.connect();
    this.socket.on('location_update', callback);
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
