import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { formatCurrencyUah } from "@/shared/lib/format";
import type { DemandRequest } from "@/features/demand/lib/mock-data";

type Props = {
  row: DemandRequest;
};

export const DemandDetailSummaryCard = ({ row }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{row.taskTitle}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
      <p>
        {row.truckType} · {row.payloadT} t · {row.routeLabel}
      </p>
      <p>Budget {formatCurrencyUah(row.budgetUah)}</p>
    </CardContent>
  </Card>
);
