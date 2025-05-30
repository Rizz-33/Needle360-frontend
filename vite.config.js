import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Get all VITE_* environment variables
  const viteEnv = Object.entries(env).reduce((acc, [key, val]) => {
    if (key.startsWith("VITE_")) {
      acc[key] = val;
    }
    return acc;
  }, {});

  const defineObject = {
    ...viteEnv,
    MODE: mode,
    PROD: mode === "production",
    DEV: mode === "development",
  };

  return {
    plugins: [react()],
    define: {
      // Global defines required by Vite and dependencies
      __APP_ENV__: JSON.stringify(mode),
      "process.env.NODE_ENV": JSON.stringify(mode),

      // Define valid identifier patterns only
      "globalThis.__DEFINES__": JSON.stringify(defineObject),
      "__DEFINES__": JSON.stringify(defineObject),
      "window.__DEFINES__": JSON.stringify(defineObject),

      // Explicitly define all VITE_* variables
      ...Object.keys(viteEnv).reduce((acc, key) => {
        acc[`import.meta.env.${key}`] = JSON.stringify(viteEnv[key]);
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
