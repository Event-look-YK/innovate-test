import { Outlet, useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@innovate-test/ui/components/command";
import { Separator } from "@innovate-test/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@innovate-test/ui/components/sidebar";
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@innovate-test/ui/components/button";

import { filterNavByRole } from "@/shared/lib/nav-config";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { ConnectivityBadge } from "@/shared/ui/connectivity-badge";
import { DevRoleToolbar } from "@/shared/ui/dev-role-toolbar";
import { AppSidebar } from "@/views/shell/app-sidebar";

export const AuthenticatedShell = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [searchOpen, setSearchOpen] = useState(false);

  const allItems = filterNavByRole(user?.role);
  const mainItems = allItems.filter((i) => !i.secondary);
  const secondaryItems = allItems.filter((i) => i.secondary);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <SidebarProvider className="h-dvh max-h-dvh min-h-0 overflow-hidden">
        <AppSidebar
          mainItems={mainItems}
          secondaryItems={secondaryItems}
          user={{ name: user?.name, email: user?.email }}
        />

        <SidebarInset className="min-h-0 flex-1 overflow-hidden">
          {/* Topbar */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator className="h-5 opacity-40" orientation="vertical" />

            {/* Search */}
            <Button
              className="hidden h-8 max-w-56 flex-1 justify-start gap-2 rounded-lg bg-muted/60 text-xs text-muted-foreground hover:bg-muted md:flex"
              type="button"
              variant="ghost"
              onClick={() => setSearchOpen(true)}
            >
              <svg
                className="size-3.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="flex-1 truncate text-left">Search pages…</span>
              <kbd className="hidden items-center rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[9px] opacity-60 sm:flex">
                ⌘K
              </kbd>
            </Button>

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

      <CommandDialog onOpenChange={setSearchOpen} open={searchOpen}>
        <CommandInput placeholder="Jump to page…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            {allItems.map((item) => (
              <CommandItem
                key={item.to}
                onSelect={() => {
                  setSearchOpen(false);
                  navigate({ to: item.to });
                }}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <DevRoleToolbar />
    </>
  );
};
