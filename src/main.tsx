import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App.tsx";
import BouncingBallPage from "./BouncingBallPage.tsx";

import "./index.css";

const urlRoot = "/animation-test";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/bouncingBall",
    Component: BouncingBallPage,
  }
], { basename: urlRoot });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
