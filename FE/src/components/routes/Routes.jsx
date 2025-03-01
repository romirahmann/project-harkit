import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "../layouts/Layouts";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../auth/Login";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { Userpage } from "../pages/Userpage";
import { Proses } from "../pages/Proses";

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
const userPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-users",
  component: () => (
    <ProtectedRoute>
      <Userpage />
    </ProtectedRoute>
  ),
});
const prosesPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-proses",
  component: () => (
    <ProtectedRoute>
      <Proses />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([dashboardPage, userPage, prosesPage]),
  loginRoute,
]);

export const router = createRouter({
  routeTree,
});
