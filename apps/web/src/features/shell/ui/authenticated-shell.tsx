import { Outlet, useRouterState } from "@tanstack/react-router";
import { Separator } from "@innovate-test/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@innovate-test/ui/components/sidebar";
import { BellIcon } from "lucide-react";
import { Button } from "@innovate-test/ui/components/button";

import { AppSidebar } from "@/features/shell/ui/app-sidebar";
import { filterNavByRole, NAV_ITEMS } from "@/shared/lib/nav-config";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { ConnectivityBadge } from "@/shared/ui/connectivity-badge";

const useActiveNavItem = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return NAV_ITEMS.find(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  ) ?? null;
};

export const AuthenticatedShell = () => {
  const { user } = useCurrentUser();
  const activeItem = useActiveNavItem();

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
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4 bg-background/80 backdrop-blur-sm">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            <Separator className="h-2/3 opacity-40" orientation="vertical" />

            {activeItem && (
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/15">
                  <activeItem.icon className="size-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold tracking-tight">{activeItem.label}</span>
              </div>
            )}

            <div className="ml-auto flex items-center gap-1.5">
              <ConnectivityBadge />
              <Button
                className="relative size-8 group"
                icon={<BellIcon className="size-4 transition-colors group-hover:text-primary" />}
                size="icon"
                type="button"
                variant="ghost"
              >
                <span className="sr-only">Notifications</span>
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-background animate-pulse" />
              </Button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* <DevRoleToolbar /> */}
    </>
  );
};
