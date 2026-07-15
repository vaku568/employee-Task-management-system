import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "./useAuth";
import socketService from "../services/socket";

export const useSocket = () => {
  const { token, user } = useAuth();
  const socketInitialized = useRef(false);
  const eventListeners = useRef(new Map());

  useEffect(() => {
    if (token && user && !socketInitialized.current) {
      // Initialize socket with token
      socketService.initializeSocket(token);
      socketInitialized.current = true;
    }

    return () => {
      // Cleanup on unmount
      if (socketInitialized.current) {
        // Remove all event listeners
        eventListeners.current.forEach((callback, eventName) => {
          socketService.offEvent(eventName, callback);
        });
        eventListeners.current.clear();
      }
    };
  }, [token, user]);

  const disconnect = useCallback(() => {
    socketService.disconnectSocket();
    socketInitialized.current = false;
    eventListeners.current.clear();
  }, []);

  const emit = useCallback((eventName, data) => {
    return socketService.emitEvent(eventName, data);
  }, []);

  const on = useCallback((eventName, callback) => {
    const unsubscribe = socketService.onEvent(eventName, callback);
    
    // Store listener for cleanup
    if (unsubscribe) {
      eventListeners.current.set(eventName, callback);
    }
    
    return unsubscribe;
  }, []);

  const off = useCallback((eventName, callback) => {
    socketService.offEvent(eventName, callback);
    eventListeners.current.delete(eventName);
  }, []);

  const isConnected = useCallback(() => {
    return socketService.isSocketConnected();
  }, []);

  return {
    socket: socketService.getSocket(),
    emit,
    on,
    off,
    disconnect,
    isConnected,
  };
};

export default useSocket;
