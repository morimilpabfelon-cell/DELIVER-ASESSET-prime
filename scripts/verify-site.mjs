import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];
const required = [
  'index.html',
  'editorial-production.css',
  'editorial-production-refinement.css',
  'editorial-production.js',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  '.nojekyll',
  'assets/favicon.svg',
  'assets/logo-original.svg',
  'assets/og-deliver-assets.svg',
];

for (const file of required) {
  const path = join(root, file);
  if (!existsSync(path)) failures.push(`Falta ${file}`);
  else if (file !== '.nojekyll' && statSync(path).size === 0) failures.push(`${file} está vacío`);
}

const read = (file) => readFileSync(join(root, file), 'utf8');
const html = existsSync(join(root, 'index.html')) ? read('index.html') : '';
const css = existsSync(join(root, 'editorial-production.css')) ? read('editorial-production.css') : '';
const refinement = existsSync(join(root, 'editorial-production-refinement.css')) ? read('editorial-production-refinement.css') : '';
const js = existsSync(join(root, 'editorial-production.js')) ? read('editorial-production.js') : '';

for (const marker of [
  'data-theme="editorial-production"',
  'editorial-production.css',
  'editorial-production.js',
  'MOVE',
  'THE CITY.',
  '02 / SERVICIOS',
  '04 / TRACKING',
  '06 / DELIVER PRO',
  '07 / REPARTIDORES',
  '08 / CONFIANZA',
  '09 / AYUDA',
  'data-dialog',
]) {
  if (!html.includes(marker)) failures.push(`index.html no contiene ${marker}`);
}

for (const forbidden of [
  'data-render="figma-night"',
  'figma-night.css',
  'figma-night.js',
  'script.js',
  'styles.css',
  'night-theme.js',
  'night-assets.js',
]) {
  if (html.includes(forbidden)) failures.push(`index.html conserva dependencia heredada: ${forbidden}`);
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
for (const anchor of [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])) {
  if (!ids.has(anchor)) failures.push(`Ancla sin destino: #${anchor}`);
}

for (const ref of [...html.matchAll(/(?:href|src)="(\.\/[^"]+)"/g)].map((match) => match[1])) {
  const clean = ref.split('#')[0].split('?')[0];
  const target = normalize(join(dirname(join(root, 'index.html')), clean));
  if (!target.startsWith(root) || !existsSync(target)) failures.push(`Referencia local inválida: ${ref}`);
}

for (const marker of [
  '--cream:#f4e9c6',
  '--blue:#1155cc',
  '--yellow:#ffd233',
  '--red:#e53935',
  '.hero{',
  '.service-grid{',
  '.tracking-section{',
  '.dashboard{',
  '.rider-section{',
  '.contact-dialog{',
  '@media(max-width:1120px)',
  '@media(max-width:760px)',
  '@media(prefers-reduced-motion:reduce)',
]) {
  if (!css.includes(marker)) failures.push(`editorial-production.css no contiene ${marker}`);
}

for (const marker of [
  'aria-current="location"',
  '@media (hover:none)',
  '@media (max-width:420px)',
  '@media (prefers-contrast:more)',
  '@media (forced-colors:active)',
]) {
  if (!refinement.includes(marker)) failures.push(`editorial-production-refinement.css no contiene ${marker}`);
}

for (const marker of [
  'setMenuState',
  'IntersectionObserver',
  'updateTracking',
  'reportValidity()',
  'showModal',
  'data-contact',
  'aria-current',
  'editorial-production-refinement.css',
]) {
  if (!js.includes(marker)) failures.push(`editorial-production.js no contiene ${marker}`);
}

if (js.includes('innerHTML') || js.includes('eval(')) {
  failures.push('editorial-production.js usa una operación no permitida');
}

if (failures.length) {
  failures.forEach((failure) => console.error(`[verify:error] ${failure}`));
  process.exit(1);
}

console.log('[verify] Homepage editorial productiva, responsive y accesible validada');
