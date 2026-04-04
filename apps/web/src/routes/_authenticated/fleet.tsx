import { createFileRoute } from "@tanstack/react-router";

import { ROLES } from "@/shared/constants/roles";
import { ProtectedOutlet } from "@/shared/ui/protected-outlet";

export const Route = createFileRoute("/_authenticated/fleet")({
  component: () => <ProtectedOutlet allow={[ROLES.CARRIER_ADMIN, ROLES.CARRIER_MANAGER]} />,
});
