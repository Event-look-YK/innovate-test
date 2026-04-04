import { Outlet } from "@tanstack/react-router";
import { Separator } from "@innovate-test/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@innovate-test/ui/components/sidebar";
import { BellIcon } from "lucide-react";
import { Button } from "@innovate-test/ui/components/button";

import { AppSidebar } from "@/features/shell/ui/app-sidebar";
import { filterNavByRole } from "@/shared/lib/nav-config";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { ConnectivityBadge } from "@/shared/ui/connectivity-badge";
import { DevRoleToolbar } from "@/shared/ui/dev-role-toolbar";

export const AuthenticatedShell = () => {
  const { user } = useCurrentUser();

  const allItems = filterNavByRole(user?.role);
  const mainItems = allItems.filter((i) => !i.secondary);
  const secondaryItems = allItems.filter((i) => i.secondary);

  return (
    <>
      <SidebarProvider className="h-dvh max-h-dvh min-h-0 overflow-hidden">
        <AppSidebar
          mainItems={mainItems}
          secondaryItems={secondaryItems}
          user={{ name: user?.name, email: user?.email }}
        />

        <SidebarInset className="min-h-0 flex-1 overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator className="h-5 opacity-40" orientation="vertical" />

            <div className="ml-auto flex items-center gap-1.5">
              <ConnectivityBadge />
              <Button className="relative size-8" size="icon" type="button" variant="ghost">
                <BellIcon className="size-4" />
                <span className="sr-only">Notifications</span>
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
              </Button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>

      <DevRoleToolbar />
    </>
  );
};
