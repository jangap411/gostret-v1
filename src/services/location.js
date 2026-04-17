import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

class LocationService {
  async getCurrentPosition() {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissions = await Geolocation.checkPermissions();
        
        if (permissions.location !== 'granted') {
          const request = await Geolocation.requestPermissions();
          if (request.location !== 'granted') {
            throw new Error('Location permission denied');
          }
        }

        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });

        return {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        };
      } catch (error) {
        console.error('Native geolocation error:', error);
        throw error;
      }
    } else {
      // Web Fallback
      return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error('Geolocation is not supported by your browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });
    }
  }

  async watchPosition(callback) {
    if (Capacitor.isNativePlatform()) {
      const wait = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }, (position, err) => {
        if (err) {
          console.error('Watch position error:', err);
          return;
        }
        callback({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      });
      return wait;
    } else {
      const id = navigator.geolocation.watchPosition(
        (position) => callback(position),
        (err) => console.error('Web watch position error:', err),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      return id;
    }
  }

  async clearWatch(id) {
    if (Capacitor.isNativePlatform()) {
      await Geolocation.clearWatch({ id });
    } else {
      navigator.geolocation.clearWatch(id);
    }
  }
}

export const locationService = new LocationService();
