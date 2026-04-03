import { createFileRoute } from "@tanstack/react-router";

import { SignUpCarrierView } from "@/views/auth/sign-up-carrier-view";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpCarrierView,
});
