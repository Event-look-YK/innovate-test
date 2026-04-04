import { ROLES } from "@/shared/constants/roles";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { AdminManagerDashboardView } from "@/features/dashboard/ui/admin-manager-dashboard-view";
import { DriverDashboardView } from "@/features/dashboard/ui/driver-dashboard-view";
import { FreelanceDashboardView } from "@/features/dashboard/ui/freelance-dashboard-view";
import { WarehouseDashboardView } from "@/features/dashboard/ui/warehouse-dashboard-view";

export const DashboardView = () => {
  const { user } = useCurrentUser();
  const role = user?.role;

  if (role === ROLES.CARRIER_ADMIN || role === ROLES.CARRIER_MANAGER) {
    return <AdminManagerDashboardView />;
  }
  if (role === ROLES.CARRIER_DRIVER) {
    return <DriverDashboardView />;
  }
  if (role === ROLES.CARRIER_WAREHOUSE_MANAGER) {
    return <WarehouseDashboardView />;
  }
  if (role === ROLES.FREELANCE_DRIVER) {
    return <FreelanceDashboardView />;
  }
  return <AdminManagerDashboardView />;
};
