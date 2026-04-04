import { createFileRoute } from "@tanstack/react-router";

import { ROLES } from "@/shared/constants/roles";
import { ProtectedOutlet } from "@/shared/ui/protected-outlet";

export const Route = createFileRoute("/_authenticated/offers")({
  component: () => <ProtectedOutlet allow={[ROLES.FREELANCE_DRIVER]} />,
});
