import { io } from 'socket.io-client';
import { SOCKET_URL } from './api';

class SocketService {
  socket = null;
  currentRole = null; // Track role for auto-rejoin

  connect() {
    if (this.socket && this.socket.connected) return;
    
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server:', this.socket.id);
        // Auto-rejoin if a role was previously set
        if (this.currentRole === 'admin') {
          this.joinAdmin();
        } else if (this.currentRole === 'driver') {
          this.joinDriversPool();
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from socket server:', reason);
      });

      this.socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
      });
    }

    this.socket.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentRole = null;
    }
  }

  joinRide(rideId) {
    if (!this.socket) this.connect();
    this.socket.emit('join_ride', rideId);
  }

  joinDriversPool() {
    this.currentRole = 'driver';
    if (!this.socket || !this.socket.connected) {
      this.connect();
    } else {
      this.socket.emit('join_drivers');
    }
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

  joinAdmin() {
    this.currentRole = 'admin';
    if (!this.socket || !this.socket.connected) {
      this.connect();
    } else {
      this.socket.emit('join_admin');
    }
  }

  emitSOS(data) {
    if (!this.socket) this.connect();
    this.socket.emit('trigger_sos', data);
  }

  onSOSAlert(callback) {
    if (!this.socket) this.connect();
    this.socket.on('sos_alert', callback);
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
