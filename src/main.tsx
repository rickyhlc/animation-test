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
    path: urlRoot,
    Component: App,
  },
  {
    path: `${urlRoot}/bouncingBall`,
    Component: BouncingBallPage,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
