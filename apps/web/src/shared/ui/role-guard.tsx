import { type ReactNode } from "react";

import { type Role } from "@/shared/constants/roles";

type Props = {
  role: Role | null | undefined;
  allow: readonly Role[];
  children: ReactNode;
  fallback?: ReactNode;
};

export const RoleGuard = ({ role, allow, children, fallback = null }: Props) => {
  if (!role || !allow.includes(role)) return fallback;
  return children;
};
