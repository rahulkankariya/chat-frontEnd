// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');



let VITE_FIREBASE_API_KEY='AIzaSyBy1nbdPaYsZiDtMb6ZQYQKnjrj8CKoWFo'
let VITE_FIREBASE_AUTH_DOMAIN='chat-system-6adf8.firebaseapp.com'
let VITE_FIREBASE_PROJECT_ID='chat-system-6adf8'
let VITE_FIREBASE_STORAGE_BUCKET='chat-system-6adf8.firebasestorage.app'
let VITE_FIREBASE_MESSAGING_SENDER_ID='1038714033618'
let VITE_FIREBASE_APP_ID='1:1038714033618:web:f71914140dc2461ffa640b'
let VITE_FIREBASE_MRESUREMENTID='G-8ZND24R3KP' 
let VITE_FIREBASE_VAPID_KEY="BEkIs6ZIL25uMjIPLktmm3ogsbL7p_u86_m-fdv4UWdjlzC4vs-M6Ar0KSUu_XWc6Hd__i85DHHbOjZJJNI2MAc"  
firebase.initializeApp({
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  // self.registration.showNotification('Overriden message');
  // self.registration.showNotification(notificationTitle, notificationOptions);
});
