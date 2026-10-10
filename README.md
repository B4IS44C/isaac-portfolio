# Isaac Hidalgo — Systems Lab

Portafolio en español basado en el CV de Isaac Alberto Hidalgo Vargas. HTML, CSS y JavaScript sin framework ni proceso de compilación. Compatible con GitHub Pages tanto en dominio raíz como en un repositorio de proyecto.

## Desarrollo

Sirve `dist/` con cualquier servidor estático. Por ejemplo: `python -m http.server 4173 --directory dist`. Abre http://localhost:4173.

## Publicación

El workflow `.github/workflows/pages.yml` publica `dist/` cuando hay un push a `main`. En GitHub → Settings → Pages selecciona **GitHub Actions** como fuente. El repositorio debe tener GitHub Pages habilitado. El sitio no requiere secretos, backend ni paquetes npm.

## Edición

- `dist/index.html`: textos, experiencia, formación y contacto.
- `dist/style.css`: diseño adaptable y estilos.
- `dist/app.js`: habilidades, terminal, demostración y esfera animada.
- `dist/experience.js`: arquitectura interactiva, topología 3D que cambia con el desplazamiento, tarjetas con profundidad y progreso de lectura.
- `dist/favicon.svg`: icono de marca.

La fuente visual se carga desde Google Fonts y tiene alternativas locales si no está disponible. La terminal usa respuestas locales predefinidas; no ejecuta comandos ni envía datos. El flujo de una solicitud es una demostración conceptual, no un proyecto de cliente ni una API real. No hay analítica ni cookies.

Se omiten cédula, licencia, teléfono y dirección detallada. El correo profesional se muestra para contacto. No se publica el PDF original porque contiene datos de identificación. La experiencia y las certificaciones proceden del CV proporcionado; no se inventan proyectos, porcentajes de dominio ni métricas.

## Edición monocromática

Paleta exclusivamente en blanco, negro y grises. El explorador muestra tres arquitecturas conceptuales (web, móvil y automatización), con cuatro capas seleccionables cada una. Las preguntas del perfil pueden consultarse con botones; la terminal queda como alternativa desplegable.

No hay controles de pausa o configuración de animaciones. La entrada de la esfera termina antes de cuatro segundos; después responde al cursor y al desplazamiento. Se respeta automáticamente la preferencia del sistema de reducir movimiento. Las tarjetas funcionan con clic, teclado y pantallas táctiles; la inclinación es un efecto adicional para ratón.
