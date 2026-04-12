import { resolve } from "path";
import { readFileSync } from "fs";
import { writeFileSync } from "fs";
import { globSync } from "glob";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const SITE = "https://muthupalaniyappan.com";

function layoutPlugin() {
  const layoutPath = resolve(__dirname, "src/layout.html");
  return {
    name: "layout",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        if (ctx.filename === layoutPath) return html;
        const titleMatch = html.match(/<!--title:\s*(.+?)-->/);
        const descMatch = html.match(/<!--description:\s*(.+?)-->/);
        const title = titleMatch ? titleMatch[1].trim() : "Muthu Palaniyappan OL";
        const description = descMatch ? descMatch[1].trim() : "Software Engineer building scalable solutions. Portfolio of Muthu Palaniyappan OL.";
        const relPath = ctx.filename.replace(resolve(__dirname, "src"), "").replace("/index.html", "/") || "/";
        const canonical = `${SITE}${relPath}`;
        let content = html.replace(/<!--title:\s*.+?-->/, "").replace(/<!--description:\s*.+?-->/, "").trim();
        const layout = readFileSync(layoutPath, "utf-8");
        return layout.replaceAll("{{title}}", title).replaceAll("{{description}}", description).replace("{{canonical}}", canonical).replace("{{content}}", content);
      },
    },
  };
}

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

function sitemapPlugin() {
  return {
    name: "generate-sitemap",
    closeBundle() {
      const htmlFiles = globSync("dist/**/index.html");
      const urls = htmlFiles.map((f) => {
        const path = f.replace("dist", "").replace("index.html", "");
        return `${SITE}${path}`;
      });
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>`;
      writeFileSync("dist/sitemap.xml", sitemap);
      writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
    },
  };
}

// Auto-detect all index.html files under src/
const htmlFiles = globSync("src/**/index.html");
const input = {};
for (const file of htmlFiles) {
  const key = file === "src/index.html" ? "main" : file.replace("src/", "").replace("/index.html", "").replace(/\//g, "-");
  input[key] = resolve(__dirname, file);
}

export default defineConfig({
  root: "src",
  publicDir: false,
  plugins: [layoutPlugin(), tailwindcss(), inlinePlugin(), sitemapPlugin()],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: { input },
  },
});
