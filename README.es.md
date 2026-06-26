# EBPI — Explorador Bíblico Protestante Interactivo

Un explorador bíblico interactivo y multilingüe construido sobre teología Reformada/Evangélica. Navega los 66 libros del canon protestante organizados por división, estudia comentario teológico estructurado, sigue el arco redentor a través de una línea de tiempo interactiva y explora los personajes bíblicos clave — en español, inglés y portugués.

> **README también disponible en inglés:** [README.md](README.md)

---

## Funcionalidades

- **Estantería canónica** — 66 libros organizados en 10 divisiones (Pentateuco, Históricos, Sabiduría, Profetas Mayores, Profetas Menores, Evangelios, Hechos, Epístolas Paulinas, Epístolas Generales, Apocalipsis) con bandas de era codificadas por color
- **Visor de libros con pestañas múltiples** — Visión general, Teología, Propósito, Posición canónica, Historia, Versículos clave y Fuentes por libro
- **Integración de teología sistemática** — Capítulos de la Confesión de Westminster y marco de Teología del Pacto mapeados a cada libro
- **Línea de tiempo interactiva de capítulos** — Línea de tiempo horizontal con desplazamiento, bandas de era y nodos de personajes; haz clic en cualquier personaje para ver su bio, tipología y referencias del NT
- **Recorridos por división** — Panoramas a nivel de categoría con enfoque cristológico, período del pacto y distintivos Reformados antes de entrar a cada libro individual
- **Resúmenes de capítulos + reproductor de audio** — Un panel inferior "AUDIO · CAPÍTULOS" transmite audio bíblico dramatizado desde Google Cloud Storage según el idioma (es = RVR60, en = MSB, pt = ACF); el audio avanza automáticamente capítulo a capítulo y cada capítulo tiene su propio enlace profundo
- **Trilingüe** — Español (es), inglés (en), portugués (pt); el idioma se conserva en la URL para que cualquier vista pueda compartirse o guardarse como marcador
- **Navegación basada en URL** — Todo el estado de la vista se codifica en el hash (p. ej. `#book/1/theology/es`) para enlaces profundos compartibles y recargables
- **Persistencia de sesión** — El último idioma, ubicación y capítulo se guardan en `localStorage` y se restauran automáticamente al volver a la app
- **Fuentes académicas** — Bibliografía escalonada por libro con obras primarias, secundarias y de referencia

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Lenguaje | JavaScript (ES Modules) |
| Estilos | CSS-in-JS con sistema de tokens de color unificado |
| Datos | Archivos JSON estáticos cargados en tiempo de ejecución |
| Linting | ESLint 10 con plugins de React Hooks y React Refresh |

---

## Estructura del proyecto

```
ebpi/
├── canon/                   # Aplicación React
│   ├── src/
│   │   ├── App.jsx
│   │   ├── CanonShelf.jsx   # Controlador principal de navegación
│   │   ├── constants.js     # Tokens de color, registro de libros, cadenas de UI
│   │   ├── utils.jsx        # Enlace de versículos, constructores de URL
│   │   ├── adapters/
│   │   │   └── canonToViewer.js   # Esquema CANON → formas de componente
│   │   ├── components/
│   │   │   ├── IndexPage.jsx      # Vista de estantería AT / NT
│   │   │   ├── DivisionTour.jsx   # Página de panorama de división
│   │   │   ├── BookViewer.jsx     # Detalle de libro con pestañas
│   │   │   ├── VerseLink.jsx      # Componente de referencia bíblica con enlace
│   │   │   └── book/
│   │   │       ├── ChapterSummaries.jsx  # Reproductor de audio + lista de resúmenes
│   │   │       ├── Timeline.jsx          # Línea de tiempo interactiva
│   │   │       ├── TheologyTab.jsx
│   │   │       └── SourcesTab.jsx
│   │   └── __tests__/
│   │       └── utils.test.jsx
│   ├── public/
│   │   └── data/                  # Archivos JSON de libros (servidos en tiempo de ejecución)
│   ├── package.json
│   └── vite.config.js
├── scripts/                 # Utilidades de descarga de audio
│   ├── download_audio_en.py
│   ├── download_audio_es.py
│   └── download_audio_pt.py
├── audio/                   # Caché local de audio (en / es / pt)
└── data/                    # Datos fuente (salida del Pipeline CANON)
    ├── books-manifest.json
    ├── personas-display.json
    ├── genesis.json
    └── ...
```

---

## Inicio rápido

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/mixwarecs/ebpi.git
cd ebpi

# 2. Instalar dependencias
cd canon
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre el servidor de desarrollo Vite en `http://localhost:5173` con reemplazo de módulos en caliente.

### Build de producción

```bash
npm run build
```

Genera un bundle optimizado en `canon/dist/`.

### Vista previa del build de producción

```bash
npm run preview
```

Sirve el build de producción localmente para verificación final.

### Linting

```bash
npm run lint
```

---

## Navegación por URL

La app utiliza enrutamiento basado en hash para que todo el estado sea compartible:

| Patrón | Descripción |
|---|---|
| `#` | Estantería canónica (índice AT / NT) |
| `#division/[clave]/[idioma]` | Recorrido de división para un grupo canónico |
| `#book/[id]/[idioma]` | Visión general del libro (pestaña por defecto, idioma actual) |
| `#book/[id]/[pestaña]/[idioma]` | Libro en una pestaña e idioma específicos |
| `#book/[id]/summaries/[idioma]` | Resúmenes de capítulos + reproductor de audio |
| `#book/[id]/summaries/[capítuloIdx]/[idioma]` | Enlace profundo a un capítulo específico |

**Ejemplo:** `#book/1/theology/es` abre Génesis en la pestaña de Teología en español.  
**Ejemplo:** `#book/1/summaries/2/es` abre Génesis con el capítulo 2 resaltado y listo para reproducir.

---

## Datos

Los registros de libros son generados por el **Pipeline CANON** — un proceso separado que produce JSON estructurado siguiendo un esquema fijo. Cada registro contiene:

- Autoría, fecha y audiencia
- Resúmenes capítulo por capítulo
- Doctrinas de teología sistemática con anclas de versículos
- Mapeo a capítulos de la Confesión de Westminster
- Conexiones con la teología del pacto
- Personajes clave con tipología y referencias del NT
- Trasfondo histórico (cronología, geografía, contexto del Antiguo Cercano Oriente)
- Fuentes académicas escalonadas

Los libros completados se colocan en `canon/public/data/` y se registran en `books-manifest.json`.

### Cobertura actual

| División | Completos |
|---|---|
| Pentateuco | Génesis, Éxodo, Levítico, Números, Deuteronomio |
| Históricos | Josué, Jueces, Rut, 1 Samuel |
| Evangelios | Mateo, Marcos, Lucas, Juan |
| Hechos | Hechos |
| Epístolas Paulinas | Romanos, Efesios |
| Epístolas Generales | 1 Pedro |

15 libros completos — 51 restantes.

---

## Marco teológico

El contenido está escrito desde una perspectiva **Protestante Reformada / Evangélica**:

- **Confesión de Westminster** — Los capítulos enlazan la doctrina con el contenido de cada libro
- **Teología del Pacto** — Los pactos Adámico, Noético, Abrahámico, Mosaico y Davídico se rastrean a lo largo de los libros
- **Enfoque cristológico** — Cada libro se conecta a su papel en la historia redentora y su cumplimiento tipológico en Cristo
- **Épocas de la historia redentora** definen las bandas de era visibles en el visor de libros

---

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama de funcionalidad: `git checkout -b feature/mi-adicion`
3. Confirma tus cambios: `git commit -m "Add: descripción"`
4. Haz push y abre un pull request

Para agregar un libro nuevo, ejecuta el Pipeline CANON para generar el JSON del libro y luego sigue los pasos de integración al visor.

---

## Licencia

MIT — consulta [LICENSE](LICENSE) para más detalles.
