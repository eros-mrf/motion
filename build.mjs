// Empaqueta cada clase en UN solo archivo HTML autocontenido (JS + CSS + fuentes en base64).
// Uso: node build.mjs [18|19|20|21|22|all]  →  index.html (clase 18) · clase-19.html · clase-20.html · clase-21.html
import { build } from 'esbuild';
import fs from 'node:fs';

const font = (pkg, file) => fs.readFileSync(`node_modules/${pkg}/files/${file}`).toString('base64');
const face = (family, weight, pkg, file) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${font(pkg, file)}) format('woff2');}\n`;

const CLASSES = {
  18: {
    dir: 'src', out: 'index.html',
    fonts: () =>
      face('Bricolage Grotesque', '200 800', '@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2') +
      face('Inter', '100 900', '@fontsource-variable/inter', 'inter-latin-wght-normal.woff2') +
      face('JetBrains Mono', '500', '@fontsource/jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff2') +
      face('JetBrains Mono', '700', '@fontsource/jetbrains-mono', 'jetbrains-mono-latin-700-normal.woff2'),
  },
  19: {
    dir: 'clase-19/src', out: 'clase-19.html',
    fonts: () =>
      face('Syne', '400 800', '@fontsource-variable/syne', 'syne-latin-wght-normal.woff2') +
      face('Manrope', '200 800', '@fontsource-variable/manrope', 'manrope-latin-wght-normal.woff2') +
      face('IBM Plex Mono', '500', '@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2') +
      face('IBM Plex Mono', '600', '@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff2'),
  },
  20: {
    dir: 'clase-20/src', out: 'clase-20.html',
    fonts: () =>
      face('Fraunces', '100 900', '@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2') +
      `@font-face{font-family:'Fraunces';font-style:italic;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,${font('@fontsource-variable/fraunces', 'fraunces-latin-wght-italic.woff2')}) format('woff2');}\n` +
      face('DM Sans', '100 1000', '@fontsource-variable/dm-sans', 'dm-sans-latin-wght-normal.woff2') +
      face('DM Mono', '400', '@fontsource/dm-mono', 'dm-mono-latin-400-normal.woff2') +
      face('DM Mono', '500', '@fontsource/dm-mono', 'dm-mono-latin-500-normal.woff2'),
  },
  21: {
    dir: 'clase-21/src', out: 'clase-21.html',
    fonts: () =>
      face('Instrument Serif', '400', '@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2') +
      `@font-face{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,${font('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff2')}) format('woff2');}\n` +
      face('Plus Jakarta Sans', '200 800', '@fontsource-variable/plus-jakarta-sans', 'plus-jakarta-sans-latin-wght-normal.woff2') +
      face('Space Mono', '400', '@fontsource/space-mono', 'space-mono-latin-400-normal.woff2') +
      face('Space Mono', '700', '@fontsource/space-mono', 'space-mono-latin-700-normal.woff2'),
  },
  22: {
    dir: 'clase-22/src', out: 'clase-22.html',
    fonts: () =>
      face('Bricolage Grotesque', '200 800', '@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2') +
      face('DM Sans', '100 1000', '@fontsource-variable/dm-sans', 'dm-sans-latin-wght-normal.woff2') +
      face('IBM Plex Mono', '500', '@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2') +
      face('IBM Plex Mono', '600', '@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff2'),
  },
};

async function make(n) {
  const c = CLASSES[n];
  const out = await build({
    entryPoints: [`${c.dir}/main.js`], bundle: true, minify: true, format: 'iife',
    target: 'es2020', write: false, legalComments: 'none',
  });
  const js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const css = c.fonts() + fs.readFileSync(`${c.dir}/styles.css`, 'utf8');
  const html = fs.readFileSync(`${c.dir}/template.html`, 'utf8')
    .replace('/*__CSS__*/', () => css)
    .replace('/*__JS__*/', () => js);
  fs.writeFileSync(c.out, html);
  console.log(`${c.out}  ${(html.length / 1024).toFixed(0)} KB`);
}

const arg = process.argv[2] || 'all';
for (const n of arg === 'all' ? Object.keys(CLASSES) : [arg]) await make(n);
