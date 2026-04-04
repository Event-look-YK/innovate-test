import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { InviteTeamPayload, TeamMember } from "@/shared/types/team";

export const useTeam = () =>
  useQuery({
    queryKey: ["team"],
    queryFn: () => http.get<TeamMember[]>("/api/team"),
  });

export const useInviteTeammate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: InviteTeamPayload) =>
      http.post<TeamMember>("/api/team/invite", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team"] });
    },
  });
};
