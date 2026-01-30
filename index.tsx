
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Eorvex Core Initialization Error:", error);
  rootElement.innerHTML = `
    <div style="height: 100vh; background: #09090b; color: #ef4444; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; padding: 20px; text-align: center;">
      <h1 style="margin-bottom: 10px;">SYSTEM_HALT</h1>
      <p style="color: #71717a; font-size: 14px;">A critical error occurred during kernel initialization. Check console for trace.</p>
      <pre style="background: #18181b; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; max-width: 600px; overflow: auto;">${error}</pre>
      <button onclick="location.reload()" style="margin-top: 20px; background: #06b6d4; border: none; padding: 10px 20px; border-radius: 6px; color: #000; font-weight: bold; cursor: pointer;">Reboot System</button>
    </div>
  `;
}
