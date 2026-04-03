import { Badge } from "@innovate-test/ui/components/badge";
import { cn } from "@innovate-test/ui/lib/utils";

import { useConnectivityStore } from "@/shared/stores/connectivity";

export const ConnectivityBadge = () => {
  const mode = useConnectivityStore((s) => s.mode);
  const label = mode === "online" ? "Online" : mode === "ble" ? "BLE mesh" : "Offline";
  return (
    <Badge
      variant="secondary"
      className={cn(
        mode === "online" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        mode === "offline" && "border-destructive/30 bg-destructive/10 text-destructive",
        mode === "ble" && "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400",
      )}
    >
      {label}
    </Badge>
  );
};
