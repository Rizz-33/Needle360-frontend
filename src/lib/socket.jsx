import { io } from "socket.io-client";

const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

let socket;

const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");

    socket = io(BASE_API_URL, {
      withCredentials: true,
      secure: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: token ? { token } : null,
    });

    // Handle authentication errors
    socket.on("connect_error", (err) => {
      if (err.message === "Authentication error") {
        console.error("Authentication failed - invalid or missing token");
        // Handle token refresh or redirect to login here if needed
      }
    });
  }
  return socket;
};

export default getSocket;
