# FigmaFlow Plugin - Jira Integration

Figma plugin UI for viewing Jira tickets with AI-generated summaries inside Figma.

## Setup

1. Install dependencies:
```bash
cd plugin
npm install
```

2. Build the plugin:
```bash
npm run build
```

3. Load in Figma:
   - Open Figma Desktop app
   - Go to Plugins → Development → Import plugin from manifest...
   - Select `plugin/dist/manifest.json`

## Development

Run the dev server:
```bash
npm run dev
```

This will start Vite dev server on port 3001. The plugin will hot-reload during development.

## Project Structure

- `code.ts` - Figma plugin backend (runs in sandbox)
- `index.html` - UI shell
- `src/main.tsx` - React entry point
- `src/App.tsx` - Main app component
- `src/components/` - React components
- `src/api/backend.ts` - Backend API client
- `src/types/index.ts` - TypeScript types

## Environment Variables

Create a `.env` file in the plugin directory (optional):
```
VITE_API_URL=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory:
- `dist/code.js` - Plugin code
- `dist/index.html` - UI HTML
- `dist/assets/` - React bundle and assets

## Features

- View Jira tickets assigned to you
- AI-generated quick summaries
- Full detailed summaries
- Clean, modern UI
- Error handling and loading states

