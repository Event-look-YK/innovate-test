import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { formatCurrencyUah } from "@/shared/lib/format";
import type { DemandRequestDetail } from "@/shared/types/demand";

type Props = {
  row: DemandRequestDetail;
};

export const DemandDetailSummaryCard = ({ row }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{row.taskTitle ?? "Demand request"}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
      <p>
        {row.requiredTruckType} · {row.payloadT} t · {row.originLabel} → {row.destinationLabel}
      </p>
      <p>Budget {formatCurrencyUah(row.budgetUah)}</p>
      <p>Offers received: {row.offerCount}</p>
    </CardContent>
  </Card>
);
