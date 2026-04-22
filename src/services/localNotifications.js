import { LocalNotifications } from '@capacitor/local-notifications';

export const notificationService = {
  init: async () => {
    try {
      // Create a notification channel (Required for Android 8+)
      await LocalNotifications.createChannel({
        id: 'ride-requests',
        name: 'Ride Requests',
        description: 'Notifications for new ride requests',
        importance: 5, // High importance
        visibility: 1, // Public
        sound: 'beep.wav', // You can use a custom sound if added to res/raw
        vibration: true,
      });
      console.log("Notification channel 'ride-requests' created");
    } catch (e) {
      console.error("Error creating notification channel:", e);
    }
  },

  requestPermissions: async () => {
    try {
      const permissionStatus = await LocalNotifications.checkPermissions();
      console.log("Current permission status:", permissionStatus);
      
      if (permissionStatus.display !== 'granted') {
        const requestStatus = await LocalNotifications.requestPermissions();
        return requestStatus.display === 'granted';
      }
      return true;
    } catch (e) {
      console.error("Local Notifications permission error:", e);
      return false;
    }
  },

  scheduleRideRequest: async (ride) => {
    try {
      // Check if we have permission before scheduling
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) {
        console.warn("Notification permissions not granted, skipping notification.");
        return;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "🔔 New Ride Request!",
            body: `Trip to ${ride.destination_address || 'Destination'}. Earn PGK ${ride.fare}.`,
            id: Math.floor(Math.random() * 100000) + 1,
            schedule: { at: new Date(Date.now() + 500) }, 
            channelId: 'ride-requests',
            smallIcon: 'ic_stat_icon_config_sample', // Default fallback or custom if exists
            largeIcon: 'res://drawable/splash',
            sound: null,
            extra: {
              rideId: ride.id
            }
          }
        ]
      });
      console.log("Notification scheduled successfully");
    } catch (e) {
      console.error("Local Notifications schedule error:", e);
    }
  }
};
