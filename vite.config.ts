import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss(), jsxLocPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@data": path.resolve(import.meta.dirname, "data"),
        "@assets": path.resolve(import.meta.dirname, "client", "public", "assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      manifest: mode === "analyze",
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      allowedHosts: ["localhost", "127.0.0.1"],
      proxy: {
        "/api": { target: "http://127.0.0.1:3000", changeOrigin: true },
        "/health": { target: "http://127.0.0.1:3000", changeOrigin: true },
      },
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
