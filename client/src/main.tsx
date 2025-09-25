import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure React is available on window for any overlays/tools expecting it
// without changing app behavior.
// @ts-ignore
if (typeof window !== 'undefined') (window as any).React = React;

console.log("🚀 React app is starting...");
const rootElement = document.getElementById("root");
console.log("📦 Root element:", rootElement);

if (rootElement) {
  console.log("✅ Creating React root and rendering App");
  createRoot(rootElement).render(<App />);
} else {
  console.error("❌ Root element not found!");
}
