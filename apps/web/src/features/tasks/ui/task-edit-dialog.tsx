import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@innovate-test/ui/components/button";
import { SaveIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@innovate-test/ui/components/dialog";
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

import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { useUpdateTask } from "@/features/tasks/hooks/use-tasks";
import { taskCreateSchema, type TaskCreateValues } from "@/features/tasks/lib/validation";
import { CARGO_TYPES, TASK_PRIORITIES } from "@/shared/constants/task-status";
import type { Task } from "@/shared/types/task";

type Props = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TaskEditDialog = ({ task, open, onOpenChange }: Props) => {
  const updateTask = useUpdateTask();
  const { data: trucks } = useFleet();
  const form = useForm<TaskCreateValues>({
    resolver: zodResolver(taskCreateSchema) as Resolver<TaskCreateValues>,
    defaultValues: {
      title: task.title,
      cargoDescription: task.cargoDescription,
      cargoType: task.cargoType,
      weightT: task.weightT,
      originLabel: task.originLabel,
      destinationLabel: task.destinationLabel,
      deadline: task.deadline,
      priority: task.priority,
      assignedTruckId: task.assignedTruckId ?? "",
      notes: task.notes ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: task.title,
        cargoDescription: task.cargoDescription,
        cargoType: task.cargoType,
        weightT: task.weightT,
        originLabel: task.originLabel,
        destinationLabel: task.destinationLabel,
        deadline: task.deadline,
        priority: task.priority,
        assignedTruckId: task.assignedTruckId ?? "",
        notes: task.notes ?? "",
      });
    }
  }, [open, task, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
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
      toast.success("Task updated");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    }
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="te-title">Title</FieldLabel>
              <Input id="te-title" {...form.register("title")} />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.cargoDescription}>
              <FieldLabel htmlFor="te-cargo">Cargo description</FieldLabel>
              <Textarea id="te-cargo" rows={3} {...form.register("cargoDescription")} />
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
              <FieldLabel htmlFor="te-weight">Weight (t)</FieldLabel>
              <Input id="te-weight" step="0.1" type="number" {...form.register("weightT")} />
              <FieldError errors={[form.formState.errors.weightT]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.originLabel}>
              <FieldLabel htmlFor="te-a">Point A (origin)</FieldLabel>
              <Input id="te-a" {...form.register("originLabel")} />
              <FieldError errors={[form.formState.errors.originLabel]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.destinationLabel}>
              <FieldLabel htmlFor="te-b">Point B (destination)</FieldLabel>
              <Input id="te-b" {...form.register("destinationLabel")} />
              <FieldError errors={[form.formState.errors.destinationLabel]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.deadline}>
              <FieldLabel htmlFor="te-deadline">Deadline</FieldLabel>
              <Input id="te-deadline" type="datetime-local" {...form.register("deadline")} />
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
            <Field>
              <FieldLabel htmlFor="te-notes">Notes</FieldLabel>
              <Textarea id="te-notes" rows={2} {...form.register("notes")} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={updateTask.isPending} icon={<SaveIcon />} type="submit">
              {updateTask.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
