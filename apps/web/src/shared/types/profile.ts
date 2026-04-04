import type { Role } from "@/shared/constants/roles";

export type SessionProfile = {
  userId: string;
  name: string;
  email: string;
  role: Role | null;
  companyId: string | null;
  companyName: string | null;
  profileComplete: boolean;
  phone: string | null;
  language: "uk" | "en";
};

export type CompanyProfile = {
  id: string;
  name: string;
  taxId: string;
  country: string;
  city: string;
  logoUrl: string | null;
  createdAt: string;
};

export type DashboardStats = {
  openOffers?: number;
  activeJobs?: number;
  totalTrucks?: number;
  activeTrucks?: number;
  pendingTasks?: number;
  inTransitTasks?: number;
  completedTasks?: number;
  activeRoutes?: number;
  openDemands?: number;
};
