import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innovate-test/ui/components/table";

import { useDemand } from "@/features/demand/hooks/use-demand";
import { formatCurrencyUah } from "@/shared/lib/format";

export const DemandView = () => {
  const { data: rows, isPending } = useDemand();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Demand</h1>
        <p className="text-muted-foreground">Freelance capacity gaps</p>
      </div>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Payload</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={8}>Loading…</TableCell>
              </TableRow>
            ) : (
              rows?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.taskTitle}</TableCell>
                  <TableCell>{r.truckType}</TableCell>
                  <TableCell>{r.payloadT} t</TableCell>
                  <TableCell>{r.routeLabel}</TableCell>
                  <TableCell>{formatCurrencyUah(r.budgetUah)}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell className="text-end">
                    <Link
                      className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                      params={{ requestId: r.id }}
                      to="/demand/$requestId"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
