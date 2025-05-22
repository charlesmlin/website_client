import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || window._env_.REACT_APP_API_BASE_URL;
console.log(`API Base URL = ${API_BASE_URL}`);

// Create a root for the React app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
  <React.StrictMode>
    <App apiUrl={API_BASE_URL} />
  </React.StrictMode>
);

// If you want to measure performance
reportWebVitals();
