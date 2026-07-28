import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();
const stagingDirectory = join(root, '.prime-finalize');
const workflowPath = join(root, '.github', 'workflows', 'finalize-prime.yml');
const archivePath = '/tmp/deliver-prime-final-polish.tgz';

const payloadFiles = [
  'payload-00.txt',
  'payload-01.txt',
  'payload-02.txt',
];

const payload = payloadFiles
  .map((file) => {
    const path = join(stagingDirectory, file);
    if (!existsSync(path)) throw new Error(`Falta el fragmento requerido: ${file}`);
    return readFileSync(path, 'utf8').trim();
  })
  .join('');

if (!payload) throw new Error('El paquete final está vacío');

writeFileSync(archivePath, Buffer.from(payload, 'base64'));
execFileSync('tar', ['-xzf', archivePath, '-C', root], { stdio: 'inherit' });

const expectedFiles = [
  'index.html',
  'polish.css',
  'script.js',
  'catalog.js',
  'scripts/verify-site.mjs',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'assets/favicon.svg',
  'assets/og-deliver-assets.svg',
];

for (const file of expectedFiles) {
  if (!existsSync(join(root, file))) throw new Error(`No se generó el archivo final: ${file}`);
}

rmSync(stagingDirectory, { recursive: true, force: true });
rmSync(workflowPath, { force: true });
rmSync(archivePath, { force: true });

console.log('[finalize] Pulido visual y archivos de GitHub Pages aplicados correctamente');
