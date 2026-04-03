import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@innovate-test/ui/components/field";
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

import { taskCreateSchema, type TaskCreateValues } from "@/features/tasks/lib/validation";
import { CARGO_TYPES, TASK_PRIORITIES } from "@/shared/constants/task-status";

export const TaskForm = () => {
  const navigate = useNavigate();
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
      notes: "",
    },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success("Task created (mock)");
    navigate({ to: "/tasks" });
  });

  return (
    <form className="mx-auto flex max-w-xl flex-col gap-6" onSubmit={onSubmit}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.title}>
          <FieldLabel htmlFor="tf-title">Title</FieldLabel>
          <Input id="tf-title" {...form.register("title")} />
          <FieldError errors={[form.formState.errors.title]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.cargoDescription}>
          <FieldLabel htmlFor="tf-cargo">Cargo description</FieldLabel>
          <Textarea id="tf-cargo" rows={3} {...form.register("cargoDescription")} />
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
          <Input id="tf-weight" step="0.1" type="number" {...form.register("weightT")} />
          <FieldError errors={[form.formState.errors.weightT]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.originLabel}>
          <FieldLabel htmlFor="tf-a">Point A (origin)</FieldLabel>
          <Input id="tf-a" {...form.register("originLabel")} />
          <FieldError errors={[form.formState.errors.originLabel]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.destinationLabel}>
          <FieldLabel htmlFor="tf-b">Point B (destination)</FieldLabel>
          <Input id="tf-b" {...form.register("destinationLabel")} />
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
          <FieldLabel htmlFor="tf-notes">Notes</FieldLabel>
          <Textarea id="tf-notes" rows={2} {...form.register("notes")} />
        </Field>
      </FieldGroup>
      <div className="flex gap-2">
        <Button type="submit">Create task</Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/tasks" })}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
