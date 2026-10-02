import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// Relative base so the build works under any GitHub Pages sub-path.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
