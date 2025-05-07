import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "@/routes";
import "./index.css";

// Create the root
const root = createRoot(document.getElementById("root"));

// Render with fallback element only
root.render(
  <StrictMode>
    <RouterProvider router={router}  />
  </StrictMode>
);
