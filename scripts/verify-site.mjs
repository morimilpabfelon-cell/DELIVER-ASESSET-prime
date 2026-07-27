import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = join(root, 'site');
const failures = [];

const requiredFiles = [
  'index.html',
  'styles.css',
  'script.js',
  'assets/hero-vision.svg',
];

for (const file of requiredFiles) {
  const absolute = join(site, file);
  if (!existsSync(absolute)) {
    failures.push(`Falta el archivo requerido: site/${file}`);
  } else if (statSync(absolute).size === 0) {
    failures.push(`El archivo está vacío: site/${file}`);
  }
}

if (existsSync(join(site, 'index.html'))) {
  const html = readFileSync(join(site, 'index.html'), 'utf8');
  const requiredMarkers = [
    '<!doctype html>',
    'lang="es"',
    'id="contenido"',
    'href="./styles.css"',
    'src="./script.js"',
    'src="./assets/hero-vision.svg"',
  ];

  for (const marker of requiredMarkers) {
    if (!html.includes(marker)) {
      failures.push(`index.html no contiene: ${marker}`);
    }
  }

  const localRefs = [...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g)].map((match) => match[1]);
  for (const ref of localRefs) {
    const target = normalize(join(dirname(join(site, 'index.html')), ref));
    if (!target.startsWith(site) || !existsSync(target)) {
      failures.push(`Referencia local inválida: ${ref}`);
    }
  }

  if (/href="\s*"|src="\s*"/.test(html)) {
    failures.push('index.html contiene referencias vacías');
  }

  if (/(?:TODO|FIXME|PLACEHOLDER)/.test(html)) {
    failures.push('index.html contiene marcadores pendientes');
  }
}

if (existsSync(join(site, 'script.js'))) {
  const script = readFileSync(join(site, 'script.js'), 'utf8');
  if (script.includes('eval(') || script.includes('innerHTML')) {
    failures.push('script.js usa una operación no permitida');
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`[verify:error] ${failure}`);
  }
  process.exit(1);
}

console.log('[verify] Sitio estático validado correctamente');
