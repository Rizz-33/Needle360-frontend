import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config();

export default defineConfig({
  define: {
    API_URL: JSON.stringify(process.env.VITE_API_URL),
  },
  plugins: [react()],
});
