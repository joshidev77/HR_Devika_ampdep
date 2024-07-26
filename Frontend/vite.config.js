import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@babel/plugin-transform-runtime"],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["js-big-decimal"],
    include: ["react-speech-recognition"],
  },
  define: {
    global: "globalThis",
  },
});
