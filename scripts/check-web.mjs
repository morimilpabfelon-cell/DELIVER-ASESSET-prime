import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const fail = (message) => failures.push(message);

const requiredFiles = [
  'index.html',
  'editorial-production.css',
  'editorial-production-refinement.css',
  'editorial-production.js',
  'assets/logo-original.svg',
  'assets/favicon.svg',
];

requiredFiles.forEach((path) => {
  if (!existsSync(resolve(root, path))) fail(`Falta archivo requerido: ${path}`);
});

const html = read('index.html');
const css = `${read('editorial-production.css')}\n${read('editorial-production-refinement.css')}`;

const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) fail(`IDs duplicados: ${[...new Set(duplicateIds)].join(', ')}`);

const idSet = new Set(ids);
for (const match of html.matchAll(/\saria-(?:controls|labelledby|describedby)=["']([^"']+)["']/g)) {
  for (const target of match[1].trim().split(/\s+/)) {
    if (target && !idSet.has(target)) fail(`Referencia ARIA sin destino: ${target}`);
  }
}

for (const match of html.matchAll(/\s(?:src|href)=["'](\.\/[^"'#?]+)["']/g)) {
  const localPath = match[1].replace(/^\.\//, '');
  if (!existsSync(resolve(root, localPath))) fail(`Referencia local inexistente: ${match[1]}`);
}

if (/href=["']#["']/.test(html)) fail('Existe un enlace href="#" sin destino real.');
if (!/<html[^>]+lang=["']es["']/.test(html)) fail('El documento debe declarar lang="es".');
if (!/<main\b[^>]*id=["']contenido["']/.test(html)) fail('Falta el destino del skip link: #contenido.');
if (!/prefers-reduced-motion/.test(css)) fail('Falta soporte CSS para prefers-reduced-motion.');

const braceBalance = [...css].reduce((balance, character) => {
  if (character === '{') return balance + 1;
  if (character === '}') return balance - 1;
  return balance;
}, 0);
if (braceBalance !== 0) fail(`Llaves CSS desbalanceadas: ${braceBalance}`);

if (failures.length) {
  console.error('Validación web fallida:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Validación web correcta: ${requiredFiles.length} archivos, ${ids.length} IDs y referencias locales verificadas.`);
