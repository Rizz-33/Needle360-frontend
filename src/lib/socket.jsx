import { io } from "socket.io-client";

const BASE_API_URL = import.meta.env.VITE_API_URL || "https://needle360.online";

let socketInstance = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECTION_DELAY = 1000;

const initializeSocket = () => {
  if (!io) {
    console.error(
      "Socket.IO Client: 'io' is undefined. Ensure 'socket.io-client' is installed and imported correctly."
    );
    return null;
  }

  if (socketInstance && socketInstance.connected) {
    console.log("Socket.IO Client: Socket already connected, reusing instance");
    return socketInstance;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Socket.IO Client: No authentication token available");
    return null;
  }

  // Clean up any existing connection
  if (socketInstance) {
    console.log("Socket.IO Client: Cleaning up existing socket instance");
    socketInstance.disconnect();
    socketInstance = null;
  }

  try {
    socketInstance = io(BASE_API_URL, {
      path: "/socket.io/",
      transports: ["websocket", "polling"], // Prefer WebSocket, fallback to polling
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECTION_DELAY,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
      timeout: 20000,
      autoConnect: true,
      secure: true,
      withCredentials: true,
      auth: {
        token: token,
      },
    });

    // Connection events
    socketInstance.on("connect", () => {
      console.log("Socket.IO Client: Connected successfully");
      reconnectAttempts = 0;
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket.IO Client: Connection error:", err.message, err);
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(
          RECONNECTION_DELAY * Math.pow(2, reconnectAttempts),
          10000
        );
        console.log(
          `Socket.IO Client: Attempting reconnect (${
            reconnectAttempts + 1
          }/${MAX_RECONNECT_ATTEMPTS}) after ${delay}ms`
        );
        reconnectAttempts++;
      } else {
        console.error("Socket.IO Client: Max reconnection attempts reached");
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket.IO Client: Disconnected:", reason);
      if (reason === "io server disconnect") {
        console.log(
          "Socket.IO Client: Server-initiated disconnect, attempting reconnect"
        );
        setTimeout(() => {
          socketInstance.connect();
        }, RECONNECTION_DELAY);
      }
    });

    socketInstance.on("error", (err) => {
      console.error("Socket.IO Client: Error:", err.message || err);
    });
  } catch (error) {
    console.error("Socket.IO Client: Initialization error:", error.message);
    return null;
  }

  return socketInstance;
};

const getSocket = () => {
  if (!socketInstance) {
    console.log("Socket.IO Client: Initializing new socket instance");
    return initializeSocket();
  }

  if (!socketInstance.connected) {
    console.log("Socket.IO Client: Attempting to reconnect existing socket");
    socketInstance.connect();
  }

  return socketInstance;
};

const disconnectSocket = () => {
  if (socketInstance) {
    console.log("Socket.IO Client: Disconnecting socket");
    socketInstance.disconnect();
    socketInstance = null;
    reconnectAttempts = 0;
  }
};

export { disconnectSocket, getSocket, initializeSocket };
