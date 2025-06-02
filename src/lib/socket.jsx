import { io } from "socket.io-client";

const BASE_API_URL = import.meta.env.VITE_API_URL || "https://needle360.online";

let socketInstance = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECTION_DELAY = 1000;

const initializeSocket = () => {
  if (socketInstance && socketInstance.connected) return socketInstance;

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No authentication token available");
    return null;
  }

  // Clean up any existing connection
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  socketInstance = io(BASE_API_URL, {
    path: "/socket.io",
    transports: ["websocket"],
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
    console.log("Socket connected");
    reconnectAttempts = 0;
  });

  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.min(
        RECONNECTION_DELAY * Math.pow(2, reconnectAttempts),
        10000
      );
      setTimeout(() => {
        reconnectAttempts++;
        console.log(
          `Attempting reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`
        );
        socketInstance.connect();
      }, delay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    if (reason === "io server disconnect") {
      // The disconnection was initiated by the server, need to manually reconnect
      setTimeout(() => {
        socketInstance.connect();
      }, RECONNECTION_DELAY);
    }
  });

  socketInstance.on("error", (err) => {
    console.error("Socket error:", err);
  });

  return socketInstance;
};

const getSocket = () => {
  if (!socketInstance) {
    return initializeSocket();
  }

  // If socket exists but isn't connected, try to reconnect
  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
};

const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    reconnectAttempts = 0;
  }
};

export { disconnectSocket, getSocket, initializeSocket };
