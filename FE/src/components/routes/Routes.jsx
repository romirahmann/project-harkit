import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "../layouts/Layouts";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../auth/Login";
import { ProtectedRoute } from "../auth/ProtectedRoute";

const rootRoute = createRootRoute();

// Layout utama untuk halaman tertentu
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <Login />,
});

const dashboardPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([dashboardPage]),
  loginRoute,
]);

export const router = createRouter({
  routeTree,
});
