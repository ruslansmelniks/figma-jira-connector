/**
 * Figma plugin backend - runs in plugin sandbox
 */

// Show UI with dimensions 400x600
// UI is loaded from manifest.json "ui" property
figma.showUI('', {
  width: 400,
  height: 600,
});

// Listen for messages from React UI
figma.ui.onmessage = (msg) => {
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

// Post initial message to UI when plugin loads
figma.ui.postMessage({
  type: 'plugin-ready',
  message: 'Plugin initialized',
});

