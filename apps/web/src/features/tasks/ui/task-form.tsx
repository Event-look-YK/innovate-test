import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { Field, FieldError, FieldLabel } from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@innovate-test/ui/components/select";
import { Textarea } from "@innovate-test/ui/components/textarea";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { useCreateTask } from "@/features/tasks/hooks/use-tasks";
import { taskCreateSchema, type TaskCreateValues } from "@/features/tasks/lib/validation";
import { CARGO_TYPES, TASK_PRIORITIES } from "@/shared/constants/task-status";

export const TaskForm = () => {
  const navigate = useNavigate();
  const { data: trucks } = useFleet();
  const createTask = useCreateTask();
  const form = useForm<TaskCreateValues>({
    resolver: zodResolver(taskCreateSchema) as Resolver<TaskCreateValues>,
    defaultValues: {
      title: "",
      cargoDescription: "",
      cargoType: "General",
      weightT: 1,
      originLabel: "",
      destinationLabel: "",
      deadline: "",
      priority: "MEDIUM",
      assignedTruckId: "",
      notes: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createTask.mutateAsync({
        title: values.title,
        cargoDescription: values.cargoDescription,
        cargoType: values.cargoType,
        weightT: values.weightT,
        originLabel: values.originLabel,
        destinationLabel: values.destinationLabel,
        deadline: values.deadline,
        priority: values.priority,
        assignedTruckId: values.assignedTruckId || null,
        notes: values.notes,
      });
      toast.success("Task created");
      navigate({ to: "/tasks" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create task");
    }
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2" data-invalid={!!form.formState.errors.title}>
          <FieldLabel htmlFor="tf-title">Title</FieldLabel>
          <Input id="tf-title" placeholder="Deliver refrigerated goods to Lviv" {...form.register("title")} />
          <FieldError errors={[form.formState.errors.title]} />
        </Field>
        <Field className="sm:col-span-2" data-invalid={!!form.formState.errors.cargoDescription}>
          <FieldLabel htmlFor="tf-cargo">Cargo description</FieldLabel>
          <Textarea id="tf-cargo" rows={3} placeholder="Describe the cargo contents, packaging, and handling requirements…" {...form.register("cargoDescription")} />
          <FieldError errors={[form.formState.errors.cargoDescription]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.cargoType}>
          <FieldLabel>Cargo type</FieldLabel>
          <Select
            onValueChange={(v) => form.setValue("cargoType", v as TaskCreateValues["cargoType"])}
            value={form.watch("cargoType")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CARGO_TYPES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError errors={[form.formState.errors.cargoType]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.weightT}>
          <FieldLabel htmlFor="tf-weight">Weight (t)</FieldLabel>
          <Input id="tf-weight" step="0.1" type="number" placeholder="5.0" {...form.register("weightT")} />
          <FieldError errors={[form.formState.errors.weightT]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.originLabel}>
          <FieldLabel htmlFor="tf-a">Point A (origin)</FieldLabel>
          <Input id="tf-a" placeholder="Kyiv, Ukraine" {...form.register("originLabel")} />
          <FieldError errors={[form.formState.errors.originLabel]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.destinationLabel}>
          <FieldLabel htmlFor="tf-b">Point B (destination)</FieldLabel>
          <Input id="tf-b" placeholder="Lviv, Ukraine" {...form.register("destinationLabel")} />
          <FieldError errors={[form.formState.errors.destinationLabel]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.deadline}>
          <FieldLabel htmlFor="tf-deadline">Deadline</FieldLabel>
          <Input id="tf-deadline" type="datetime-local" {...form.register("deadline")} />
          <FieldError errors={[form.formState.errors.deadline]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.priority}>
          <FieldLabel>Priority</FieldLabel>
          <Select
            onValueChange={(v) => form.setValue("priority", v as TaskCreateValues["priority"])}
            value={form.watch("priority")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TASK_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError errors={[form.formState.errors.priority]} />
        </Field>
        <Field>
          <FieldLabel>Assign truck</FieldLabel>
          <Select
            onValueChange={(v) => form.setValue("assignedTruckId", v ?? undefined)}
            value={form.watch("assignedTruckId") ?? ""}
          >
            <SelectTrigger className="w-full">
              <span className="text-sm">
                {trucks?.find((t) => t.id === (form.watch("assignedTruckId") ?? undefined))?.name ?? "Unassigned"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {trucks?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="tf-notes">Notes</FieldLabel>
          <Textarea id="tf-notes" rows={2} placeholder="Any special instructions or remarks…" {...form.register("notes")} />
        </Field>
      </div>
      <div className="flex gap-2">
        <Button disabled={createTask.isPending} type="submit">
          {createTask.isPending ? "Creating..." : "Create task"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/tasks" })}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
