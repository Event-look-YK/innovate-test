import { ROLE_LABELS, type Role } from "@/shared/constants/roles";

export const memberStatusPresentation: Record<string, { label: string; dot: string }> = {
  active: { label: "Active", dot: "bg-emerald-500" },
  invited: { label: "Invited", dot: "bg-blue-500" },
  inactive: { label: "Inactive", dot: "bg-slate-400" },
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

export const memberNameToAvatarClass = (name: string) =>
  avatarColors[name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length] ??
  avatarColors[0];

export const memberInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export const memberRoleLabel = (role: Role) => ROLE_LABELS[role];
