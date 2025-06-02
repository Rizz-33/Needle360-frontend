import { io } from "socket.io-client";

const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const socket = io(BASE_API_URL, {
  withCredentials: true,
  secure: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
