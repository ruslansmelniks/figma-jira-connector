/**
 * Figma plugin backend - runs in plugin sandbox
 */

// Declare the __html__ variable that Figma injects
declare const __html__: string;

// Show UI with dimensions 400x600
figma.showUI(__html__, {
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

