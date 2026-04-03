export const ROLES = {
  CARRIER_ADMIN: "CARRIER_ADMIN",
  CARRIER_MANAGER: "CARRIER_MANAGER",
  CARRIER_DRIVER: "CARRIER_DRIVER",
  CARRIER_WAREHOUSE_MANAGER: "CARRIER_WAREHOUSE_MANAGER",
  FREELANCE_DRIVER: "FREELANCE_DRIVER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  CARRIER_ADMIN: "Carrier admin",
  CARRIER_MANAGER: "Operations manager",
  CARRIER_DRIVER: "Driver",
  CARRIER_WAREHOUSE_MANAGER: "Warehouse manager",
  FREELANCE_DRIVER: "Freelance driver",
};
