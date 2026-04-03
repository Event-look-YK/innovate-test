import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innovate-test/ui/components/table";

import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { useTasks } from "@/features/tasks/hooks/use-tasks";

export const TruckDetailView = () => {
  const { truckId } = useParams({ strict: false }) as { truckId: string };
  const { data: trucks } = useFleet();
  const { data: tasks } = useTasks();
  const truck = trucks?.find((t) => t.id === truckId);
  const history = tasks?.filter((t) => t.assignedTruckId === truckId) ?? [];

  if (!truck) {
    return <p className="text-muted-foreground">Truck not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} to="/fleet">
            ← Fleet
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{truck.name}</h1>
          <p className="text-muted-foreground">
            {truck.type} · {truck.payloadT} t · {truck.status}
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">GPS trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            Last 24h path (Mapbox placeholder)
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Task history</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.priority}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
