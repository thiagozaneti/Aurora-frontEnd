import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import auroraLogo from "@/assets/aurora-logo.png";

// Set favicon to Aurora logo at runtime
const ensureFavicon = () => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if (link) link.href = auroraLogo;
};
ensureFavicon();

createRoot(document.getElementById("root")!).render(<App />);
