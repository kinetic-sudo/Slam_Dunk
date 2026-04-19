import React from 'react'; // Keep this for safety even with automatic runtime
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
}