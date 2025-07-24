import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Handle dark mode
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function updateDarkClass(e?: MediaQueryListEvent) {
  const isDark = e ? e.matches : darkQuery.matches;
  document.documentElement.classList.toggle('dark', isDark);
}

// Initialize dark mode
updateDarkClass();
darkQuery.addEventListener('change', updateDarkClass);

// Create and render the app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
