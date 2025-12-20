import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// // Check if we are in production mode to silence logs
// if (import.meta.env.MODE === "production") {
//   console.log = () => {};
//   console.error = () => {};
//   console.debug = () => {};
//   console.warn = () => {};
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
