import { LocalNotifications } from '@capacitor/local-notifications';

export const notificationService = {
  requestPermissions: async () => {
    try {
       const hasPermission = await LocalNotifications.checkPermissions();
       if (hasPermission.display !== 'granted') {
           const req = await LocalNotifications.requestPermissions();
           return req.display === 'granted';
       }
       return true;
    } catch (e) {
       console.error("Local Notifications permission error:", e);
       return false;
    }
  },

  scheduleRideRequest: async (ride) => {
     try {
       await LocalNotifications.schedule({
         notifications: [
           {
             title: "New Ride Request!",
             body: `${ride.rider_name} requested a ${ride.duration} ride for PGK ${ride.fare}.`,
             id: Math.floor(Math.random() * 100000) + 1,
             schedule: { at: new Date(Date.now() + 1000) }, // fire almost immediately
             sound: null,
             attachments: null,
             actionTypeId: "",
             extra: null
           }
         ]
       });
     } catch (e) {
        console.error("Local Notifications schedule error:", e);
     }
  }
};
