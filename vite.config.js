import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy"; // ✅ Import properly

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      viteStaticCopy({
        // ✅ Move this into plugins array
        targets: [
          {
            src: "public/site.webmanifest",
            dest: "./",
          },
          {
            src: "public/favicon/*",
            dest: "./favicon",
          },
        ],
      }),
    ],
    define: {
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
      assetsInclude: ["**/*.webmanifest"],
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
