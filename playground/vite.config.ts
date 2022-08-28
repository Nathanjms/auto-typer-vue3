import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
      "auto-typer-vue": path.resolve(
        __dirname,
        process.env.USEPACK === "true" ? "../dist/esm" : "../src"
      ),
    },
  },
  plugins: [vue()],
});
