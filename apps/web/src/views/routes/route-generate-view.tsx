import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { Checkbox } from "@innovate-test/ui/components/checkbox";
import { Label } from "@innovate-test/ui/components/label";
import { Switch } from "@innovate-test/ui/components/switch";
import { toast } from "sonner";

export const RouteGenerateView = () => {
  const navigate = useNavigate();
  const { data: tasks } = useTasks();
  const { data: trucks } = useFleet();
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

  const onFinish = () => {
    toast.success("Routes dispatched (mock)");
    navigate({ to: "/routes" });
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Route generation</h1>
        <p className="text-muted-foreground">Step {step + 1} of 5</p>
      </div>
      {step === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1 — Select tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {tasks?.map((t) => (
              <label key={t.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                <Checkbox
                  checked={selectedTasks.has(t.id)}
                  onCheckedChange={() => toggleTask(t.id)}
                />
                <span className="text-sm">
                  {t.title} · {t.originLabel} → {t.destinationLabel}
                </span>
              </label>
            ))}
            <Button type="button" onClick={() => setStep(1)}>
              Next
            </Button>
          </CardContent>
        </Card>
      ) : null}
      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2 — Select trucks</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {trucks
              ?.filter((t) => t.status === "idle")
              .map((t) => (
                <label key={t.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    checked={selectedTrucks.has(t.id)}
                    onCheckedChange={() => toggleTruck(t.id)}
                  />
                  <span className="text-sm">
                    {t.name} · {t.type} · {t.locationLabel}
                  </span>
                </label>
              ))}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep(2)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
      {step === 2 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3 — Configure</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Optimize for</Label>
              <p className="text-sm text-muted-foreground">Distance / Time / Fuel (mock)</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="md">Allow multi-drop</Label>
              <Switch checked={multiDrop} id="md" onCheckedChange={setMultiDrop} />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep(3)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
      {step === 3 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">4 — Review</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              Map preview with color-coded routes (mock)
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep(4)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
      {step === 4 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">5 — Confirm</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {selectedTasks.size} tasks · {selectedTrucks.size} trucks
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button type="button" onClick={onFinish}>
                Dispatch
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
