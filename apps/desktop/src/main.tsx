import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import App from "./App";
import SettingsPage from "./pages/SettingsPage";
import ToastApp from "./toast/ToastApp";

// NOTE: No screens yet — routes are placeholders until designs arrive.

// The toast window is created with ?window=toast in the URL.
const search = new URLSearchParams(window.location.search);
const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, settingsRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

if (search.get("window") === "toast") {
  document.body.style.background = "transparent";
  document.documentElement.style.background = "transparent";
  createRoot(document.getElementById("root")!).render(<ToastApp />);
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
