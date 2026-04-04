import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/routes_")({
  component: () => <Outlet />,
});
