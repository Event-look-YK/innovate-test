import type { ComponentPropsWithoutRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@innovate-test/ui/components/sidebar";
import { cn } from "@innovate-test/ui/lib/utils";

import type { NavItem } from "@/shared/lib/nav-config";

type Props = {
  items: NavItem[];
} & ComponentPropsWithoutRef<typeof SidebarGroup>;

export const NavSecondary = ({ items, ...props }: Props) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  isActive={isActive}
                  render={<Link to={item.to} />}
                  tooltip={item.label}
                >
                  <Icon
                    className={cn(
                      "transition-colors",
                      isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50",
                    )}
                  />
                  <span className={cn(isActive ? "font-medium" : "text-sidebar-foreground/70")}>
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
