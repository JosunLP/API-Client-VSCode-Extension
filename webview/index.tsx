import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

console.log("Main app script loaded");
console.log("Root element:", document.getElementById("root"));

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  console.log("Creating React root...");
  const root = ReactDOM.createRoot(rootElement as HTMLDivElement);
  console.log("Rendering App...");
  root.render(<App />);
  console.log("App rendered");
}
