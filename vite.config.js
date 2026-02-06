import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { path } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        future: {
          logicalProperties: false,
        },
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
          extend: {},
        },
        plugins: [],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.__dirname(), "./src"),
    },
  },
  server: {
    host: true,
    open: true,
  },
  compilerOptions: {
    types: ["vite/client"],
  },
});
