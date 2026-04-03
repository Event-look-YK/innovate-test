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

import { useRoutes } from "@/features/routes/hooks/use-routes";

export const RoutesView = () => {
  const { data: routes, isPending } = useRoutes();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Routes</h1>
          <p className="text-muted-foreground">Generated plans</p>
        </div>
        <Link className={cn(buttonVariants())} to="/routes/generate">
          Generate
        </Link>
      </div>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Truck</TableHead>
              <TableHead>Stops</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={6}>Loading…</TableCell>
              </TableRow>
            ) : (
              routes?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>{r.truckName}</TableCell>
                  <TableCell>{r.stops.length}</TableCell>
                  <TableCell>{r.distanceKm} km</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell className="text-end">
                    <Link
                      className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                      params={{ routeId: r.id }}
                      to="/routes/$routeId"
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
