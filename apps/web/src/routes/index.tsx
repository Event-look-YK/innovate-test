import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/shared/lib/auth-client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (import.meta.env.SSR) return;
    const { data: session } = await authClient.getSession();
    if (session) throw redirect({ to: "/dashboard" });
    throw redirect({ to: "/auth/sign-in" });
  },
  component: () => null,
});
