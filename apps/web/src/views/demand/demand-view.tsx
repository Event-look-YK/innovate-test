import { useDemand } from "@/features/demand/hooks/use-demand";
import { DemandListEmpty, DemandListLoading } from "@/features/demand/ui/demand-list-states";
import { DemandRequestRow } from "@/features/demand/ui/demand-request-row";

export const DemandView = () => {
  const { data: response, isPending } = useDemand();
  const rows = response?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Demand</h1>
        <p className="text-sm text-muted-foreground">Freelance capacity gaps</p>
      </div>

      {isPending ? (
        <DemandListLoading />
      ) : rows.length === 0 ? (
        <DemandListEmpty />
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <DemandRequestRow key={r.id} row={r} />
          ))}
        </div>
      )}
    </div>
  );
};
