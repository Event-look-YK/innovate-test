import { authClient } from "@/shared/lib/auth-client";
import { useUserStore } from "@/shared/stores/user";

export const useCurrentUser = () => {
  const { data: session, isPending } = authClient.useSession();
  const effectiveUser = useUserStore((s) => s.effectiveUser);

  const user = session?.user ? effectiveUser(session.user) : null;

  return { user, session, isPending };
};
