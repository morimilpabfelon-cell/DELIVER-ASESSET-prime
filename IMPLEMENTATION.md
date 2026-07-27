# Implementación de la página institucional

## Arquitectura

El sitio usa HTML, CSS y JavaScript nativo. No instala dependencias ni ejecuta un proceso de compilación.

```text
site/
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
python -m http.server 8080 --directory site
```

Abrir `http://localhost:8080`.

## Despliegue

El workflow valida los archivos en cada pull request. Después de fusionar en `main`, empaqueta `site/` y lo publica mediante GitHub Pages.

En la configuración del repositorio, Pages debe usar **GitHub Actions** como origen de publicación.

## Restricciones actuales

- No recoge información personal.
- No contiene formularios.
- No procesa pagos.
- No incluye autenticación.
- No presenta cifras financieras u operativas como resultados reales.
- La ilustración principal es un activo original construido para este repositorio.
