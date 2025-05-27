import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window._env_.VITE_API_BASE_URL;

const GOOGLE_OAUTH_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ||
  window._env_.VITE_GOOGLE_OAUTH_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App apiUrl={API_BASE_URL} googleClientId={GOOGLE_OAUTH_CLIENT_ID} />
  </React.StrictMode>
);

reportWebVitals();
