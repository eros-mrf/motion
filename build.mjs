// Empaqueta src/ en UN solo archivo HTML autocontenido (JS + CSS + fuentes en base64).
// Uso: node build.mjs   →   index.html
import { build } from 'esbuild';
import fs from 'node:fs';

const font = (pkg, file) =>
  fs.readFileSync(`node_modules/${pkg}/files/${file}`).toString('base64');

const faces = `
@font-face{font-family:'Bricolage Grotesque';font-style:normal;font-weight:200 800;font-display:swap;
  src:url(data:font/woff2;base64,${font('@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2')}) format('woff2');}
@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:swap;
  src:url(data:font/woff2;base64,${font('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2')}) format('woff2');}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:500;font-display:swap;
  src:url(data:font/woff2;base64,${font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff2')}) format('woff2');}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:700;font-display:swap;
  src:url(data:font/woff2;base64,${font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-700-normal.woff2')}) format('woff2');}
`;

const out = await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  write: false,
  legalComments: 'none',
});

const js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = faces + fs.readFileSync('src/styles.css', 'utf8');
const html = fs
  .readFileSync('src/template.html', 'utf8')
  .replace('/*__CSS__*/', () => css)
  .replace('/*__JS__*/', () => js);

fs.writeFileSync('index.html', html);
console.log(`index.html  ${(html.length / 1024).toFixed(0)} KB`);
