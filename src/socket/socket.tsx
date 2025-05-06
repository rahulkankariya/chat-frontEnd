// src/socket.ts
import { io } from 'socket.io-client';

// Retrieve token from localStorage or another storage mechanism
const token = localStorage.getItem('authToken'); // Replace with actual token retrieval method


const socket = io('http://localhost:9000', {
  extraHeaders: {
    Authorization: `${token}`,
  },
});

export default socket;
