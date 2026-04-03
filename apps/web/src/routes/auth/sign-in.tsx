import { createFileRoute } from "@tanstack/react-router";

import { SignInView } from "@/views/auth/sign-in-view";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInView,
});
