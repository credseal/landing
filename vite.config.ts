import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_TARGET = "https://identark-cloud.fly.dev/v1";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "spa-fallback",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url?.split("?")[0] ?? "";
          if (
            url.startsWith("/api") ||
            url.startsWith("/dashboard") ||
            url.startsWith("/demo") ||
            url.startsWith("/onboarding") ||
            url.startsWith("/@fs") ||
            url.startsWith("/@vite") ||
            url.startsWith("/@react") ||
            url.startsWith("/src") ||
            url.startsWith("/node_modules") ||
            /\.[a-zA-Z0-9]+$/.test(url)
          ) {
            return next();
          }
          if (url !== "/" && url !== "/index.html") req.url = "/index.html";
          next();
        });
      },
    },
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
