import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config();

export default defineConfig({
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://13.61.16.74:4000/" // Note `/api` prefix
    ),
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://13.61.16.74:4000", // Proxy API requests to backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
