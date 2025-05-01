import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:4000" // Local dev fallback
    ),
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
