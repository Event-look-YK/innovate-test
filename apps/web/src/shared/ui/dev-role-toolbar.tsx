import { Button } from "@innovate-test/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@innovate-test/ui/components/dropdown-menu";
import { FlaskConicalIcon } from "lucide-react";

import { ROLE_LABELS, ROLES, type Role } from "@/shared/constants/roles";
import { MOCK_USERS, useUserStore } from "@/shared/stores/user";

const roleList = Object.values(ROLES);

export const DevRoleToolbar = () => {
  const devRoleOverride = useUserStore((s) => s.devRoleOverride);
  const setDevRoleOverride = useUserStore((s) => s.setDevRoleOverride);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="gap-2 shadow-md" icon={<FlaskConicalIcon className="size-4" />} size="sm" variant="secondary">
            Dev role
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mock role override</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            onValueChange={(v) => setDevRoleOverride(v === "auto" ? null : (v as Role))}
            value={devRoleOverride ?? "auto"}
          >
            <DropdownMenuRadioItem value="auto">From session email</DropdownMenuRadioItem>
            {roleList.map((role) => (
              <DropdownMenuRadioItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Mock users: {MOCK_USERS.map((u) => u.email.split("@")[0]).join(", ")}
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
