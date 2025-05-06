// src/socket.ts
import { io } from 'socket.io-client';

// Retrieve token from localStorage or another storage mechanism
const token = localStorage.getItem('authToken'); // Replace with actual token retrieval method

// Establish the socket connection with the Authorization header
const socket = io('http://localhost:9000', {
  extraHeaders: {
    Authorization: `${token}`, // Pass the token in the headers
  },
});

export default socket;
