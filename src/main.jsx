import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const faviconHref = `${import.meta.env.BASE_URL}favicon-logo2.svg?v=5`;
let favicon = document.querySelector("link[rel='icon']");
if (!favicon) {
  favicon = document.createElement('link');
  favicon.setAttribute('rel', 'icon');
  document.head.appendChild(favicon);
}
favicon.setAttribute('type', 'image/svg+xml');
favicon.setAttribute('href', faviconHref);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
