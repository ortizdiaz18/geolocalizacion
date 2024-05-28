import { defineConfig, loadEnv, preprocessCSS } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig((command, mode) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    // base: "https://ortizdiaz18.github.io/geo_client",
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    preview: {
      port: process.env.PORT,
    },
  };
});
