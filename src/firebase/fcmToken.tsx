import { messaging, getToken } from './firebase';
// Function to request notification permission and get FCM token
export const fetchFcmToken = async (): Promise<string | null> => {
  try {
   
    // Request permission for notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // Replace with your VAPID key from Firebase Console
    });

    if (token) {
      // console.log('FCM Token:', token);
      return token;
    } else {
   
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (error) {
 
    console.error('Error fetching FCM token:', error);
    return null;
  }
};