/**
 * React entry point for FigmaFlow plugin
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('FigmaFlow: Starting React app...');

const container = document.getElementById('root');
if (!container) {
  console.error('FigmaFlow: Root element not found!');
  throw new Error('Root element not found');
}

console.log('FigmaFlow: Root element found, creating React root...');

try {
  const root = createRoot(container);
  console.log('FigmaFlow: Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('FigmaFlow: React app rendered successfully!');
} catch (error) {
  console.error('FigmaFlow: Error rendering React app:', error);
  container.innerHTML = `
    <div style="padding: 20px; font-family: system-ui, sans-serif;">
      <h2 style="color: #ff0000;">Error Loading Plugin</h2>
      <p>${error instanceof Error ? error.message : String(error)}</p>
      <p style="font-size: 12px; color: #666;">Check the console for more details.</p>
    </div>
  `;
}

