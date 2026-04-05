import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@innovate-test/ui/components/button";
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
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useCreateDemand } from "@/features/demand/hooks/use-demand";
import { CARGO_TYPES } from "@/shared/constants/task-status";

const TRUCK_TYPES = ["Truck", "Semi", "Refrigerated", "Flatbed"] as const;

const demandFormSchema = z.object({
  requiredTruckType: z.enum(["Truck", "Semi", "Refrigerated", "Flatbed"]),
  cargoType: z.enum(["General", "Refrigerated", "Hazardous", "Oversized", "Fragile"]),
  payloadT: z.coerce.number().positive(),
  originLabel: z.string().min(1),
  destinationLabel: z.string().min(1),
  deadline: z.string().min(1),
  budgetUah: z.coerce.number().positive(),
});

type DemandFormValues = z.infer<typeof demandFormSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DemandFormDialog = ({ open, onOpenChange }: Props) => {
  const createDemand = useCreateDemand();
  const form = useForm<DemandFormValues>({
    resolver: zodResolver(demandFormSchema) as Resolver<DemandFormValues>,
    defaultValues: {
      requiredTruckType: "Truck",
      cargoType: "General",
      payloadT: 1,
      originLabel: "",
      destinationLabel: "",
      deadline: "",
      budgetUah: 0,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createDemand.mutateAsync(values);
      toast.success("Demand request created");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create demand request");
    }
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New demand request</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.requiredTruckType}>
              <FieldLabel>Truck type</FieldLabel>
              <Select
                onValueChange={(v) =>
                  form.setValue("requiredTruckType", v as DemandFormValues["requiredTruckType"])
                }
                value={form.watch("requiredTruckType")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TRUCK_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError errors={[form.formState.errors.requiredTruckType]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.cargoType}>
              <FieldLabel>Cargo type</FieldLabel>
              <Select
                onValueChange={(v) =>
                  form.setValue("cargoType", v as DemandFormValues["cargoType"])
                }
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

            <Field data-invalid={!!form.formState.errors.payloadT}>
              <FieldLabel htmlFor="dm-payload">Payload (t)</FieldLabel>
              <Input id="dm-payload" type="number" {...form.register("payloadT")} />
              <FieldError errors={[form.formState.errors.payloadT]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.originLabel}>
              <FieldLabel htmlFor="dm-origin">Origin</FieldLabel>
              <Input id="dm-origin" {...form.register("originLabel")} />
              <FieldError errors={[form.formState.errors.originLabel]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.destinationLabel}>
              <FieldLabel htmlFor="dm-destination">Destination</FieldLabel>
              <Input id="dm-destination" {...form.register("destinationLabel")} />
              <FieldError errors={[form.formState.errors.destinationLabel]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.deadline}>
              <FieldLabel htmlFor="dm-deadline">Deadline</FieldLabel>
              <Input id="dm-deadline" type="datetime-local" {...form.register("deadline")} />
              <FieldError errors={[form.formState.errors.deadline]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.budgetUah}>
              <FieldLabel htmlFor="dm-budget">Budget (UAH)</FieldLabel>
              <Input id="dm-budget" type="number" {...form.register("budgetUah")} />
              <FieldError errors={[form.formState.errors.budgetUah]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={createDemand.isPending} type="submit">
              {createDemand.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
