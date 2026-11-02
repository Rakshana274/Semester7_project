import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('⚡ Connected to Hospital Real-Time WebSocket Server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from Real-Time WebSocket Server');
});
