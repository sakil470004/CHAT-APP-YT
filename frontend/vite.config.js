import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://seven0loaguages-com.vercel.app",
      },
    },
  },
});
//? to fix error delete node_modules and run npm install it fix 99% of the errors
// For local
// target: 'http://localhost:5000',
// For production
// target: 'https://seven0loaguages-com.onrender.com',
// for vercel
// target: 'https://seven0loaguages-com.vercel.app',
