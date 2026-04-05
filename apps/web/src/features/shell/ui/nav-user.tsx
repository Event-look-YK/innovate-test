import { useNavigate } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
} from "@innovate-test/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@innovate-test/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@innovate-test/ui/components/sidebar";
import { BellIcon, ChevronsUpDownIcon, LifeBuoyIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/auth-client";

type Props = {
  user: {
    name?: string | null;
    email?: string | null;
  };
};

const getInitials = (name?: string | null) => {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
};

export const NavUser = ({ user }: Props) => {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await authClient.signOut();
    await navigate({ to: "/auth/sign-in", replace: true });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-sidebar-primary/25 text-sidebar-primary text-xs font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name ?? "User"}</span>
              <span className="truncate text-xs text-sidebar-foreground/50">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 text-sidebar-foreground/40" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onSignOut}>
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
