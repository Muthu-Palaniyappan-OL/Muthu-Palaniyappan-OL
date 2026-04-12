import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

function inlinePlugin() {
  return {
    name: "inline-all",
    enforce: "post",
    generateBundle(_, bundle) {
      const cssFiles = {};
      for (const [name, chunk] of Object.entries(bundle)) {
        if (name.endsWith(".css")) {
          cssFiles[name] = chunk.source;
          delete bundle[name];
        }
      }
      for (const chunk of Object.values(bundle)) {
        if (chunk.fileName.endsWith(".html")) {
          let html = chunk.source;
          html = html.replace(
            /<link rel="stylesheet"[^>]*href="[^"]*\/([^"]+\.css)"[^>]*>/g,
            (_, file) => {
              const key = Object.keys(cssFiles).find((k) => k.endsWith(file));
              return key ? `<style>${cssFiles[key]}</style>` : "";
            }
          );
          chunk.source = html;
        }
      }
    },
  };
}

export default defineConfig({
  root: "src",
  publicDir: false,
  plugins: [tailwindcss(), inlinePlugin()],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        blog: resolve(__dirname, "src/blog/index.html"),
      },
    },
  },
});
