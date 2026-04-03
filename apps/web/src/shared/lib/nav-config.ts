import {
  Building2Icon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  RouteIcon,
  SettingsIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";

import { type Role, ROLES } from "@/shared/constants/roles";

export type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboardIcon;
  roles: readonly Role[];
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon, roles: Object.values(ROLES) },
  {
    to: "/fleet",
    label: "Fleet",
    icon: TruckIcon,
    roles: [ROLES.CARRIER_ADMIN, ROLES.CARRIER_MANAGER],
  },
  { to: "/team", label: "Team", icon: UsersIcon, roles: [ROLES.CARRIER_ADMIN] },
  {
    to: "/tasks",
    label: "Tasks",
    icon: PackageIcon,
    roles: [
      ROLES.CARRIER_ADMIN,
      ROLES.CARRIER_MANAGER,
      ROLES.CARRIER_DRIVER,
      ROLES.CARRIER_WAREHOUSE_MANAGER,
    ],
  },
  {
    to: "/routes",
    label: "Routes",
    icon: RouteIcon,
    roles: [ROLES.CARRIER_ADMIN, ROLES.CARRIER_MANAGER, ROLES.CARRIER_DRIVER],
  },
  {
    to: "/demand",
    label: "Demand",
    icon: Building2Icon,
    roles: [ROLES.CARRIER_ADMIN, ROLES.CARRIER_MANAGER],
  },
  { to: "/offers", label: "Offers", icon: PackageIcon, roles: [ROLES.FREELANCE_DRIVER] },
  { to: "/messages", label: "Messages", icon: MessageSquareIcon, roles: Object.values(ROLES) },
  { to: "/settings", label: "Settings", icon: SettingsIcon, roles: Object.values(ROLES) },
];

export const filterNavByRole = (role: Role | null | undefined) =>
  NAV_ITEMS.filter((item) => role && item.roles.includes(role));
