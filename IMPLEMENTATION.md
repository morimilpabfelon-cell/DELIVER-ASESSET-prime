# Implementación de la página institucional

## Arquitectura

El sitio usa HTML, CSS y JavaScript nativo. No instala dependencias ni ejecuta un proceso de compilación.

```text
index.html
styles.css
script.js
assets/
  hero-vision.svg
scripts/
  verify-site.mjs
.github/workflows/
  pages.yml
```

## Verificación local

```powershell
node scripts/verify-site.mjs
node --check script.js
python -m http.server 8080
```

Abrir `http://localhost:8080`.

## Despliegue

GitHub Pages publica directamente desde `main / (root)`, que coincide con la configuración actual del repositorio. El workflow valida el sitio en cada pull request y en cada cambio de `main`; Pages se encarga de la publicación desde la rama.

## Restricciones actuales

- No recoge información personal.
- No contiene formularios.
- No procesa pagos.
- No incluye autenticación.
- No presenta cifras financieras u operativas como resultados reales.
- La ilustración principal es un activo original construido para este repositorio.
