import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

import { authClient } from "@/shared/lib/auth-client";
import { AuthenticatedShell } from "@/features/shell/ui/authenticated-shell";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (import.meta.env.SSR) return;
    try {
      const { data: session } = await authClient.getSession();
      if (!session) throw redirect({ to: "/auth/sign-in" });
    } catch (e) {
      if (isRedirect(e)) throw e;
      throw redirect({ to: "/auth/sign-in" });
    }
  },
  component: AuthenticatedShell,
});
