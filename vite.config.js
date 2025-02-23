import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
