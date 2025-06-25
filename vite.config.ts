import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"],
          icons: ["lucide-react"],
          supabase: ["@supabase/supabase-js", "@supabase/auth-helpers-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: "esbuild",
  },
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
  assetsInclude: ["**/*.svg", "**/*.ico", "**/*.png"],
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
  },
});
