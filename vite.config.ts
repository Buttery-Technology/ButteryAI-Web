import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@mixins": path.resolve(__dirname, "./src/mixins"),
      "@global": path.resolve(__dirname, "./src/app/Global"),
    },
  },
});
