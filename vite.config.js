import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config();

export default defineConfig({
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://13.61.16.74:4000" // Your backend IP
    ),
  },
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    cors: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
