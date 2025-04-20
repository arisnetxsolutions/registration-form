import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"), // Evita el error en embed.js
    "process.env": {},
  },
  server: {
    port: Number(process.env.VITE_PORT) || 3000,
  },
  build: {
    lib: {
      entry: "src/embed.tsx", // Archivo que generará el `embed.js`
      name: "EmbedForm",
      fileName: () => "embed.js",
      formats: ["umd"], // UMD para poder usarlo en cualquier web
    },
    rollupOptions: {
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
