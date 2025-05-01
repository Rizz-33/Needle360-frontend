import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:4000" // Fallback for local dev
    ),
  },
  server: {
    host: "0.0.0.0", // Allow external connections for local dev
    port: 5173,
    strictPort: true,
  },
});
