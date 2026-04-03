import { createFileRoute } from "@tanstack/react-router";

import { SettingsView } from "@/views/settings/settings-view";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsView,
});
