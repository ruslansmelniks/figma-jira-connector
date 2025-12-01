import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Plugin to inject HTML into code.ts after build and copy manifest.json
function figmaPlugin() {
  return {
    name: 'figma-plugin',
    writeBundle(options: any, bundle: any) {
      // After build, inject the built HTML into code.js
      const distDir = options.dir || 'dist';
      const codeFile = resolve(distDir, 'code.js');
      const htmlFile = resolve(distDir, 'index.html');
      const manifestFile = resolve(__dirname, 'manifest.json');
      const manifestDest = resolve(distDir, 'manifest.json');
      
      try {
        // Read the built HTML file (which has correct asset references)
        let htmlContent = readFileSync(htmlFile, 'utf-8');
        
        // Fix asset paths: convert absolute paths to relative paths for Figma plugin
        htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');
        htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
        
        // Read the code.js file
        let code = readFileSync(codeFile, 'utf-8');
        
        // Replace __html__ with the HTML content (escaped for JavaScript string)
        const htmlEscaped = JSON.stringify(htmlContent);
        code = code.replace('__html__', htmlEscaped);
        
        // Write back the modified code.js
        writeFileSync(codeFile, code, 'utf-8');
        
        // Copy manifest.json to dist folder
        const manifestContent = readFileSync(manifestFile, 'utf-8');
        writeFileSync(manifestDest, manifestContent, 'utf-8');
        
        console.log('✓ HTML injected into code.js');
        console.log('✓ manifest.json copied to dist');
      } catch (e) {
        console.error('Error in build process:', e);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), figmaPlugin()],
  base: './', // Use relative paths for assets
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        ui: './index.html',
        code: './code.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'code' ? 'code.js' : 'assets/[name]-[hash].js';
        },
      },
    },
  },
  server: {
    port: 3001,
  },
});

