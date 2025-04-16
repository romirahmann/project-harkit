import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/RSAB-HARAPAN-KITA/",
  plugins: [react()],
  server: {
    host: "192.168.9.192",
    port: 71,
  },
});
