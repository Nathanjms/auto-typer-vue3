import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@/": `${path.resolve(import.meta.dirname, "src")}/`,
      "auto-typer-vue": path.resolve(
        import.meta.dirname,
        process.env.USEPACK === "true" ? "../dist/esm" : "../src"
      ),
    },
  },
  plugins: [vue()],
});
