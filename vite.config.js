import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "import.meta.env.MODE": JSON.stringify(mode),
      "import.meta.env.VITE_API_URL": JSON.stringify(
        env.VITE_API_URL || "http://localhost:4000"
      ),
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
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
  };
});
