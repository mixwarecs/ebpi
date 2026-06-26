# canon

React + Vite application that powers the EBPI interactive Bible viewer.

See the root [README](../README.md) for full project documentation, features, and theology framework.

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:5173
npm run build    # production bundle → dist/
npm run preview  # serve production build locally
npm run lint     # ESLint check
npm test         # run unit tests
```

## Key files

| File | Role |
|---|---|
| `src/CanonShelf.jsx` | Top-level router and state manager |
| `src/constants.js` | Color tokens, tab definitions, UI strings (trilingual) |
| `src/adapters/canonToViewer.js` | Maps CANON Pipeline JSON → component props |
| `src/components/BookViewer.jsx` | Multi-tab book detail view |
| `src/components/book/ChapterSummaries.jsx` | Audio player + chapter summary panel |
| `src/components/book/Timeline.jsx` | Interactive chapter timeline |
| `public/data/` | Static book JSON files served at runtime |
