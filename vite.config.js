import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config();

export default defineConfig({
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://172.20.10.5:4000"
    ),
  },
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all interfaces
    port: 5173,
    historyApiFallback: true, // Support for client-side routing
  },
});
