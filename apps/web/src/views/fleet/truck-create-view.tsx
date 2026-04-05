import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { TruckCreateForm } from "@/features/fleet/ui/truck-create-form";

export const TruckCreateView = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "w-fit -ml-2")} to="/fleet">
        ← Fleet
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add truck</h1>
        <p className="text-sm text-muted-foreground">Register a vehicle in your fleet</p>
      </div>
    </div>
    <TruckCreateForm />
  </div>
);
