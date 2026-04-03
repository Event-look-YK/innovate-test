import { ROLES } from "@/shared/constants/roles";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { AdminManagerDashboardView } from "@/views/dashboard/admin-manager-dashboard-view";
import { DriverDashboardView } from "@/views/dashboard/driver-dashboard-view";
import { FreelanceDashboardView } from "@/views/dashboard/freelance-dashboard-view";
import { WarehouseDashboardView } from "@/views/dashboard/warehouse-dashboard-view";

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
