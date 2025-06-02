import { io } from "socket.io-client";

const BASE_API_URL = import.meta.env.VITE_API_URL || "https://needle360.online";

let socketInstance = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const initializeSocket = () => {
  if (socketInstance && socketInstance.connected) return socketInstance;

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No authentication token available");
    return null;
  }

  socketInstance = io(BASE_API_URL, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
    secure: true,
    withCredentials: true,
    auth: {
      token: token
    }
  });

  // Connection events
  socketInstance.on("connect", () => {
    console.log("Socket connected");
    reconnectAttempts = 0;
  });

  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
      setTimeout(() => {
        reconnectAttempts++;
        socketInstance.connect();
      }, delay);
    }
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    if (reason === "io server disconnect") {
      // The disconnection was initiated by the server, need to manually reconnect
      socketInstance.connect();
    }
  });

  return socketInstance;
};

const getSocket = () => {
  if (!socketInstance) {
    return initializeSocket();
  }
  return socketInstance;
};

const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export { getSocket, disconnectSocket, initializeSocket };