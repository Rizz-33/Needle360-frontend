import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      // Safely stringify environment variables
      "import.meta.env.VITE_API_URL": JSON.stringify(
        env.VITE_API_URL || "http://localhost:4000"
      ),
      // Add other environment variables as needed
    },
    server: {
      host: "0.0.0.0", // Listen on all network interfaces
      port: 5173, // Development server port
      strictPort: true, // Don't try other ports if 5173 is taken
      // Proxy configuration for API requests during development
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:4000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    // Build-specific settings
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: mode !== "production", // Enable sourcemaps in non-production
    },
    // Preview server settings (runs after build)
    preview: {
      port: 5173,
      strictPort: true,
    },
  };
});
