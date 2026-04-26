import { io } from 'socket.io-client';
import { SOCKET_URL } from './api';

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

  joinDriversPool() {
    if (!this.socket) this.connect();
    this.socket.emit('join_drivers');
  }

  onNewRide(callback) {
    if (!this.socket) this.connect();
    this.socket.on('new_ride', callback);
  }

  onStatusUpdate(callback) {
    if (!this.socket) this.connect();
    this.socket.on('status_update', callback);
  }

  onLocationUpdate(callback) {
    if (!this.socket) this.connect();
    this.socket.on('location_updated', callback);
  }

  emitLocationUpdate(rideId, lat, lng) {
    if (!this.socket) this.connect();
    this.socket.emit('update_location', { rideId, lat, lng });
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
