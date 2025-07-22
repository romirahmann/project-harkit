/* eslint-disable no-unused-vars */
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ProtectedRoute } from "../components/auth/ProtectedRoutes";
import { MainLayout } from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import { Dashboard } from "../pages/main/Dashboard";
import { LoginPage } from "../pages/auth/LoginPage";
import { Userpage } from "../pages/main/Userpage";
import { Targetpage } from "../pages/main/Targetpage";
import { Boxpage } from "../pages/main/Boxpage";
import { Prosespage } from "../pages/main/Prosespage";
import { Employeepage } from "../pages/main/Employeepage";
import { KCPpageA2 } from "../pages/main/KCPpageA2";
import { KCPpage } from "../pages/main/KCPpage";
import { Candrapage } from "../pages/main/Candrapage";
import { Nonaktifpage } from "../pages/main/Nonaktifpage";
import { MRpage } from "../pages/main/MRpage";
import { ScanningPage } from "../pages/main/ScanningPage";
import { ChecksheetPage } from "../pages/main/ChecksheetPage";
import { UpdatePage } from "../pages/main/UpdatePage";

const rootRoute = createRootRoute({
  notFoundComponent: NotFound,
});

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected-layout",
  component: ProtectedRoute,
});

const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const mainLayout = createRoute({
  getParentRoute: () => protectedLayout,
  id: "main-layout",
  component: MainLayout,
});

const dashboardpage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/",
  component: Dashboard,
});

const userpage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-users",
  component: Userpage,
});
const targetpage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/targets",
  component: Targetpage,
});

const boxpage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/box-page",
  component: Boxpage,
});

const dataproses = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-proses",
  component: Prosespage,
});

const datakaryawan = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-karyawan",
  component: Employeepage,
});
const kcppagea2 = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-kcp-a2",
  component: KCPpageA2,
});
const kcppage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-kcp",
  component: KCPpage,
});

const nonaktifpage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/nonaktifMR",
  component: Nonaktifpage,
});
const mrpage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-mr",
  component: MRpage,
});

const candrapage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/data-candra",
  component: Candrapage,
});

const scanpage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/scanning",
  component: ScanningPage,
});

const cheeksheetpage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/checksheet",
  component: ChecksheetPage,
});

const updatepage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/update-database",
  component: UpdatePage,
});

const routeTree = rootRoute.addChildren([
  protectedLayout,
  mainLayout.addChildren([
    dashboardpage,
    userpage,
    targetpage,
    dataproses,
    datakaryawan,
    kcppagea2,
    kcppage,
    nonaktifpage,
    mrpage,
    candrapage,
    scanpage,
    cheeksheetpage,
    updatepage,
    boxpage,
  ]),
  authLayout,
]);

export const router = createRouter({
  routeTree,
  basepath: "/RSAB-HARAPAN-KITA",
});
