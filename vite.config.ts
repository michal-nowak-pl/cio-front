import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // Or whatever your backend API prefix is
        target: "http://localhost:5000", // Replace with your backend domain
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove the /api prefix
      },
    },
  },
});
