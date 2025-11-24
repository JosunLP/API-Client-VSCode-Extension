import React from "react";
import ReactDOM from "react-dom/client";

import SidebarPage from "./pages/SidebarPage";

console.log("Sidebar script loaded");
console.log("Root element:", document.getElementById("root"));

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  console.log("Creating React root...");
  const root = ReactDOM.createRoot(rootElement as HTMLDivElement);
  console.log("Rendering SidebarPage...");
  root.render(<SidebarPage />);
  console.log("SidebarPage rendered");
}
