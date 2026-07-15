import { io } from "socket.io-client";

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const initializeSocket = (token) => {
  console.log("[DEBUG] socket.js - initializeSocket called with token:", token ? "EXISTS" : "MISSING");

  if (socket && socket.connected) {
    console.log("Socket already connected");
    return socket;
  }

  console.log("[DEBUG] socket.js - Creating socket connection");
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  });

  console.log("[DEBUG] socket.js - Socket created, NOT modifying localStorage or axios");

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    reconnectAttempts = 0;
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
    reconnectAttempts++;
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached");
      socket.disconnect();
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket not initialized");
    return null;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
    console.log("Socket disconnected manually");
  }
};

export const emitEvent = (eventName, data) => {
  if (!socket || !socket.connected) {
    console.warn("Socket not connected, cannot emit event:", eventName);
    return false;
  }
  
  socket.emit(eventName, data);
  return true;
};

export const onEvent = (eventName, callback) => {
  if (!socket) {
    console.warn("Socket not initialized, cannot listen to event:", eventName);
    return null;
  }
  
  socket.on(eventName, callback);
  
  // Return unsubscribe function
  return () => {
    socket.off(eventName, callback);
  };
};

export const offEvent = (eventName, callback) => {
  if (!socket) {
    return;
  }
  
  if (callback) {
    socket.off(eventName, callback);
  } else {
    socket.off(eventName);
  }
};

export const isSocketConnected = () => {
  return socket && socket.connected;
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  emitEvent,
  onEvent,
  offEvent,
  isSocketConnected,
};
