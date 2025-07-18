import { CgHomeAlt } from "react-icons/cg";
import { FaFolder, FaCog } from "react-icons/fa";

export const sidebarMenu = [
  {
    id: 1,
    name: "Dashboard",
    icon: CgHomeAlt,
    path: "/",
    titleName: "DASHBOARD",
    titleDesc: "Let's check your update!",
  },

  {
    id: 2,
    name: "Documents",
    icon: FaFolder,
    titleName: "DOCUMENTS PAGE",
    titleDesc: "LIST DOCUMENT",
    children: [
      {
        id: "2-1",
        name: "Documents",
        path: "/documents",
        titleName: "DOCUMENTS PAGE",
        titleDesc: "Document Detail",
      },
      {
        id: "2-2",
        name: "Classifications",
        path: "/classifications",
        titleName: "CLASSIFICATION PAGE",
        titleDesc: "Classification Documents ",
      },
      {
        id: "2-3",
        name: "Cabinet",
        path: "/cabinets",
        titleName: "CABINET PAGE",
        titleDesc: "Cabinet Documents",
      },
      {
        id: "2-4",
        name: "Tenant",
        path: "/tenants",
        titleName: "TENANT PAGE",
        titleDesc: "Manage Tenant for All",
      },
    ],
  },
  {
    id: 4,
    name: "Settings",
    icon: FaCog,
    titleName: "SETTING PAGE",
    titleDesc: "Configure your settings",
    children: [
      {
        id: "4-1",
        name: "users",
        path: "/setting/users",
        titleName: "LIST USERS",
        titleDesc: "User list details",
      },
      {
        id: "4-2",
        name: "groups",
        path: "/setting/groups",
        titleName: "LIST GROUPS",
        titleDesc: "list detail Group User ",
      },
    ],
  },
];
