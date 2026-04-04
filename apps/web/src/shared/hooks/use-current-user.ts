import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/shared/lib/auth-client";
import { http } from "@/shared/lib/http";
import { useUserStore } from "@/shared/stores/user";
import type { SessionProfile } from "@/shared/types/profile";

export const useCurrentUser = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const effectiveUser = useUserStore((s) => s.effectiveUser);

  const { data: profile, isPending: profilePending } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => http.get<SessionProfile>("/api/profile/me"),
    enabled: !!session?.user,
    retry: false,
  });

  const user = session?.user
    ? effectiveUser({
        id: session.user.id,
        name: profile?.name ?? session.user.name,
        email: profile?.email ?? session.user.email,
        role: profile?.role,
      })
    : null;

  return {
    user,
    session,
    profile,
    isPending: sessionPending || (!!session?.user && profilePending),
  };
};
