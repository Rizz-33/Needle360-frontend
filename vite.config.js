import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      // Default Vite defines
      __APP_ENV__: JSON.stringify(env.NODE_ENV || mode),
      "process.env.NODE_ENV": JSON.stringify(mode),

      // Your custom defines
      "import.meta.env.VITE_API_URL": JSON.stringify(
        env.VITE_API_URL || "http://localhost:4000"
      ),
      // Add any other environment variables you need
      ...Object.keys(env).reduce((acc, key) => {
        if (key.startsWith("VITE_")) {
          acc[`import.meta.env.${key}`] = JSON.stringify(env[key]);
        }
        return acc;
      }, {}),
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:4000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: mode !== "production",
      // Add this to ensure proper chunking
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            // Add other large dependencies here
          },
        },
      },
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
  };
});
