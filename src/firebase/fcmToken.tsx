// src/firebase/fcmToken.ts
import { Token } from "@mui/icons-material";
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

export async function fetchFcmToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // You get this from Firebase Console Cloud Messaging tab
    });
    // console.log("Toekn==?",currentToken)
    if (currentToken) {
      return currentToken;
    } else {
      console.warn("No registration token available.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token.", err);
    return null;
  }
}

export const setupOnMessageListener = (callback: (payload: any) => void) => {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
};