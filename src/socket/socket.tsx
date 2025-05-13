// src/socket.ts
import { io } from 'socket.io-client';

// Retrieve token from localStorage or another storage mechanism
const token = localStorage.getItem('authToken'); // Replace with actual token retrieval method

const APIURL = import.meta.env.VITE_API_URL;

const socket = io(APIURL, {
  extraHeaders: {
    Authorization: `${token}`,
  },
});

export default socket;
