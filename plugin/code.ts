/**
 * Figma plugin backend - runs in plugin sandbox
 */

// Show UI with dimensions 400x600
figma.showUI(__html__, {
  width: 400,
  height: 600,
});

// Listen for messages from React UI
figma.ui.onmessage = (msg) => {
  console.log('Plugin received message:', msg);

  switch (msg.type) {
    case 'close':
      figma.closePlugin();
      break;

    case 'notify':
      if (msg.message) {
        figma.notify(msg.message, { timeout: msg.timeout || 3000 });
      }
      break;

    default:
      console.warn('Unknown message type:', msg.type);
  }
};

// Post initial message to UI when plugin loads
figma.ui.postMessage({
  type: 'plugin-ready',
  message: 'Plugin initialized',
});

