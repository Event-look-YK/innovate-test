import type { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@innovate-test/ui/components/sidebar";

import type { NavItem } from "@/shared/lib/nav-config";
import { NavMain } from "@/features/shell/ui/nav-main";
import { NavSecondary } from "@/features/shell/ui/nav-secondary";
import { NavUser } from "@/features/shell/ui/nav-user";

type Props = ComponentProps<typeof Sidebar> & {
  mainItems: NavItem[];
  secondaryItems: NavItem[];
  user: {
    name?: string | null;
    email?: string | null;
  };
};

export const AppSidebar = ({ mainItems, secondaryItems, user, ...props }: Props) => (
  <Sidebar variant="inset" collapsible="icon" {...props}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip="Innovate Logistics">
            <img
              alt=""
              className="size-8 shrink-0"
              height={32}
              src="/favicon.svg"
              width={32}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold tracking-tight">Innovate</span>
              <span className="truncate text-[10px] font-semibold tracking-widest uppercase text-sidebar-foreground/40">
                Logistics
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <NavMain items={mainItems} />
      <NavSecondary className="mt-auto" items={secondaryItems} />
    </SidebarContent>

    <SidebarFooter>
      <NavUser user={user} />
    </SidebarFooter>
  </Sidebar>
);
