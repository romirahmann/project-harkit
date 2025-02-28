import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "../layouts/Layouts";
import { Dashboard } from "../pages/Dashboard";

const rootRoute = createRootRoute();

// Layout utama untuk halaman tertentu
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const dashboardPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: () => <Dashboard />,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([dashboardPage]),
]);

export const router = createRouter({
  routeTree,
});
