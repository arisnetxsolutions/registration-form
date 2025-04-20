import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./globals.css"; // Asegura que los estilos se importen
export function mountEmbedForm(containerId = "embed-form", redirectUrl = "/dashboard", signInUrl = "/signin") {
  let host = document.getElementById(containerId);
  if (!host) {
    host = document.createElement("div");
    host.id = containerId;
    document.body.appendChild(host);
  }
  // Crear un Shadow DOM si no existe
  if (!host.shadowRoot) {
    const shadow = host.attachShadow({ mode: "open" });
    // Crear un contenedor dentro del Shadow DOM
    const container = document.createElement("div");
    shadow.appendChild(container);
    // Insertar los estilos si aún no existen
    if (!shadow.querySelector("link")) {
      const cssUrl = import.meta.env.VITE_CDN_URL || "https://i.delvglobal.co";
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = `${cssUrl}/dist/registration-form.css?v=${new Date().getTime()}`;
      shadow.appendChild(style);
    }
    // Renderizar la app dentro del Shadow DOM usando React 18
    const root = ReactDOM.createRoot(container);
    root.render(
      <HashRouter>
        <App redirectUrl={redirectUrl} signInUrl={signInUrl} />
      </HashRouter>
    );
  }
}
// Exponer la función globalmente
if (typeof window !== "undefined") {
  (window as any).EmbedForm = mountEmbedForm;
}
