import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/shared/lib/auth-client";
import { AuthenticatedShell } from "@/views/shell/authenticated-shell";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (import.meta.env.SSR) return;
    const { data: session } = await authClient.getSession();
    if (!session) throw redirect({ to: "/auth/sign-in" });
  },
  component: AuthenticatedShell,
});
