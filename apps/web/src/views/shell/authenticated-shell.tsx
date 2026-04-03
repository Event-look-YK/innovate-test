import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@innovate-test/ui/components/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@innovate-test/ui/components/dropdown-menu";
import { Separator } from "@innovate-test/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@innovate-test/ui/components/sidebar";
import { cn } from "@innovate-test/ui/lib/utils";
import { BellIcon, LogOutIcon, SearchIcon, TruckIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { filterNavByRole } from "@/shared/lib/nav-config";
import { authClient } from "@/shared/lib/auth-client";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { ConnectivityBadge } from "@/shared/ui/connectivity-badge";
import { DevRoleToolbar } from "@/shared/ui/dev-role-toolbar";

const getInitials = (name?: string | null) => {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
};

export const AuthenticatedShell = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [searchOpen, setSearchOpen] = useState(false);
  const items = filterNavByRole(user?.role);

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

  const onSignOut = async () => {
    await authClient.signOut();
    await navigate({ to: "/auth/sign-in", replace: true });
  };

  return (
    <>
      <SidebarProvider className="min-h-svh">
        <Sidebar className="border-sidebar-border" collapsible="icon" variant="sidebar">
          {/* Brand logo */}
          <SidebarHeader className="border-b border-sidebar-border/50 px-3 py-4">
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/20 ring-1 ring-sidebar-primary/30">
                <TruckIcon className="size-4 text-sidebar-primary" />
              </div>
              <div className="flex flex-col gap-0 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                  Innovate
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-sidebar-foreground/40 uppercase">
                  Logistics
                </span>
              </div>
            </div>
          </SidebarHeader>

          {/* Navigation */}
          <SidebarContent className="px-2 py-3">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.to || pathname.startsWith(`${item.to}/`);
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          isActive={isActive}
                          render={<Link to={item.to} />}
                          tooltip={item.label}
                          className="h-9 rounded-lg"
                        >
                          <Icon
                            className={cn(
                              "size-4 transition-colors",
                              isActive
                                ? "text-sidebar-primary"
                                : "text-sidebar-foreground/50",
                            )}
                          />
                          <span
                            className={cn(
                              "transition-colors",
                              isActive
                                ? "font-medium text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/70",
                            )}
                          >
                            {item.label}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* User footer */}
          <SidebarFooter className="border-t border-sidebar-border/50 px-3 py-3">
            <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/25 text-xs font-bold text-sidebar-primary">
                {getInitials(user?.name)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-semibold text-sidebar-foreground">
                  {user?.name ?? "User"}
                </span>
                <span className="truncate text-[10px] text-sidebar-foreground/45">
                  {user?.email}
                </span>
              </div>
              <Button
                className="size-7 shrink-0 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                size="icon"
                type="button"
                variant="ghost"
                onClick={onSignOut}
              >
                <LogOutIcon className="size-3.5" />
              </Button>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          {/* Topbar */}
          <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-card px-4 shadow-[0_1px_3px_0_rgb(17_24_77/0.05)]">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator className="h-5 opacity-40" orientation="vertical" />

            {/* Search */}
            <Button
              className="hidden h-8 max-w-56 flex-1 justify-start gap-2 rounded-lg bg-muted/60 text-xs text-muted-foreground hover:bg-muted md:flex"
              type="button"
              variant="ghost"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon className="size-3.5 shrink-0" />
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

              {/* Avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    className="h-8 gap-2 rounded-lg px-2 hover:bg-muted"
                    type="button"
                    variant="ghost"
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                      {getInitials(user?.name)}
                    </div>
                    <span className="hidden max-w-[100px] truncate text-sm font-medium md:block">
                      {user?.name?.split(" ")[0] ?? "Account"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="pb-1.5">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={onSignOut}
                  >
                    <LogOutIcon className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>

      <CommandDialog onOpenChange={setSearchOpen} open={searchOpen}>
        <CommandInput placeholder="Jump to page…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            {items.map((item) => (
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
