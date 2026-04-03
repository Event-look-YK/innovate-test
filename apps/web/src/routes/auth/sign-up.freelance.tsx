import { createFileRoute } from "@tanstack/react-router";

import { SignUpFreelanceView } from "@/views/auth/sign-up-freelance-view";

export const Route = createFileRoute("/auth/sign-up/freelance")({
  component: SignUpFreelanceView,
});
