// vite.config.js
import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config();

export default defineConfig({
  define: {
    "process.env.VITE_API_URL": JSON.stringify("http://13.61.16.74:4000"),
  },
  server: {
    host: "0.0.0.0", // Allow external connections
    port: 5173,
    strictPort: true, // Don't try other ports if 5173 is taken
  },
});
