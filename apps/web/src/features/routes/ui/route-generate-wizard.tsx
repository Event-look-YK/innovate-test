import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  ListChecksIcon,
  MapIcon,
  SendIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TruckIcon,
} from "lucide-react";
import { useState } from "react";

import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useGenerateRoutes } from "@/features/routes/hooks/use-routes";
import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { Checkbox } from "@innovate-test/ui/components/checkbox";
import { Label } from "@innovate-test/ui/components/label";
import { Switch } from "@innovate-test/ui/components/switch";
import { toast } from "sonner";

const STEP_META = [
  { title: "1 — Select tasks", Icon: ListChecksIcon },
  { title: "2 — Select trucks", Icon: TruckIcon },
  { title: "3 — Configure", Icon: SlidersHorizontalIcon },
  { title: "4 — Review", Icon: MapIcon },
  { title: "5 — Confirm", Icon: CircleCheckIcon },
] as const;

export const RouteGenerateWizard = () => {
  const navigate = useNavigate();
  const { data: tasks } = useTasks();
  const { data: trucks } = useFleet();
  const generateRoutes = useGenerateRoutes();
  const [step, setStep] = useState(0);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [selectedTrucks, setSelectedTrucks] = useState<Set<string>>(new Set());
  const [multiDrop, setMultiDrop] = useState(true);

  const toggleTask = (id: string) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTruck = (id: string) => {
    setSelectedTrucks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onFinish = async () => {
    if (selectedTasks.size === 0 || selectedTrucks.size === 0) {
      toast.error("Select at least one task and one truck");
      return;
    }
    try {
      const result = await generateRoutes.mutateAsync({
        taskIds: Array.from(selectedTasks),
        truckIds: Array.from(selectedTrucks),
      });
      toast.success(
        `Generated ${result.routes.length} route(s), total cost ${result.plan.total_cost_uah.toLocaleString("uk-UA")} ₴`,
      );
      navigate({ to: "/routes" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate routes");
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <SparklesIcon aria-hidden className="size-7 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Route generation</h1>
          </div>
          <p className="text-muted-foreground">Step {step + 1} of 5</p>
          <div className="flex w-full justify-center gap-1.5 sm:gap-2" role="list" aria-label="Wizard steps">
            {STEP_META.map(({ title, Icon }, i) => (
              <Button
                icon={<Icon aria-hidden className="size-4 sm:size-[18px]" />}
                key={title}
                variant={i === step ? "default" : "outline"}
                onClick={() => setStep(i)}
                role="listitem"
                title={title}
              />
            ))}
          </div>
        </div>
        {step === 0 ? (
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-base">
                <ListChecksIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                1 — Select tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              {tasks?.map((t) => (
                <label key={t.id} className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border p-4">
                  <Checkbox checked={selectedTasks.has(t.id)} onCheckedChange={() => toggleTask(t.id)} />
                  <span className="text-sm">
                    {t.title} · {t.originLabel} → {t.destinationLabel}
                  </span>
                </label>
              ))}
              <Button className="w-full" size="lg" type="button" onClick={() => setStep(1)}>
                Next
                <ChevronRightIcon aria-hidden className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ) : null}
        {step === 1 ? (
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-base">
                <TruckIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                2 — Select trucks
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              {trucks
                ?.filter((t) => t.status === "idle")
                .map((t) => (
                  <label key={t.id} className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border p-4">
                    <Checkbox checked={selectedTrucks.has(t.id)} onCheckedChange={() => toggleTruck(t.id)} />
                    <span className="text-sm">
                      {t.name} · {t.type} · {t.locationLabel}
                    </span>
                  </label>
                ))}
              <div className="flex w-full gap-2">
                <Button className="flex-1" icon={<ChevronLeftIcon />} size="lg" type="button" variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button className="flex-1" size="lg" type="button" onClick={() => setStep(2)}>
                  Next
                  <ChevronRightIcon aria-hidden className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
        {step === 2 ? (
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-base">
                <SlidersHorizontalIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                3 — Configure
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  <SlidersHorizontalIcon aria-hidden className="size-4 text-muted-foreground" />
                  Optimize for
                </Label>
                <p className="text-sm text-muted-foreground">Distance / Time / Fuel</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="md">Allow multi-drop</Label>
                <Switch checked={multiDrop} id="md" onCheckedChange={setMultiDrop} />
              </div>
              <div className="flex w-full gap-2">
                <Button className="flex-1" icon={<ChevronLeftIcon />} size="lg" type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" size="lg" type="button" onClick={() => setStep(3)}>
                  Next
                  <ChevronRightIcon aria-hidden className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
        {step === 3 ? (
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-base">
                <MapIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                4 — Review
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                <MapIcon aria-hidden className="size-8 text-muted-foreground/50" />
                Map preview with color-coded routes
              </div>
              <div className="flex w-full gap-2">
                <Button className="flex-1" icon={<ChevronLeftIcon />} size="lg" type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button className="flex-1" size="lg" type="button" onClick={() => setStep(4)}>
                  Next
                  <ChevronRightIcon aria-hidden className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
        {step === 4 ? (
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-base">
                <CircleCheckIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                5 — Confirm
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <ListChecksIcon aria-hidden className="size-4 shrink-0" />
                {selectedTasks.size} tasks · {selectedTrucks.size} trucks
              </p>
              <div className="flex w-full gap-2">
                <Button className="flex-1" icon={<ChevronLeftIcon />} size="lg" type="button" variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={generateRoutes.isPending}
                  loading={generateRoutes.isPending}
                  size="lg"
                  type="button"
                  onClick={() => void onFinish()}
                >
                  {generateRoutes.isPending ? (
                    "Generating..."
                  ) : (
                    <>
                      Dispatch
                      <SendIcon aria-hidden className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};
