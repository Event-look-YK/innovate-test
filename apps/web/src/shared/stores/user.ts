import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ROLES, type Role } from "@/shared/constants/roles";
import type { AppUser } from "@/shared/types/user";

export const MOCK_USERS: AppUser[] = [
  { id: "1", name: "Admin Oleksiy", email: "admin@carrier.test", role: ROLES.CARRIER_ADMIN },
  { id: "2", name: "Manager Ivan", email: "manager@carrier.test", role: ROLES.CARRIER_MANAGER },
  { id: "3", name: "Driver Olena", email: "driver@carrier.test", role: ROLES.CARRIER_DRIVER },
  { id: "4", name: "Warehouse Maria", email: "warehouse@carrier.test", role: ROLES.CARRIER_WAREHOUSE_MANAGER },
  { id: "5", name: "Freelance Taras", email: "freelance@driver.test", role: ROLES.FREELANCE_DRIVER },
];

const roleByEmail = (email: string | undefined): Role => {
  if (!email) return ROLES.CARRIER_ADMIN;
  const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return found?.role ?? ROLES.CARRIER_ADMIN;
};

type UserState = {
  devRoleOverride: Role | null;
  setDevRoleOverride: (role: Role | null) => void;
  effectiveUser: (sessionUser: { id: string; name: string; email: string; role?: Role | null } | null) => AppUser | null;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      devRoleOverride: null,
      setDevRoleOverride: (devRoleOverride) => set({ devRoleOverride }),
      effectiveUser: (sessionUser) => {
        if (!sessionUser) return null;
        const override = get().devRoleOverride;
        return {
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,
          role: sessionUser.role ?? override ?? roleByEmail(sessionUser.email),
        };
      },
    }),
    {
      name: "logistics-user-dev",
      partialize: (state) => ({ devRoleOverride: state.devRoleOverride }),
    },
  ),
);
