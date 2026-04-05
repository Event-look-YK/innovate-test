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
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUpdateTruck } from "@/features/fleet/hooks/use-fleet";
import { truckEditSchema, type TruckEditValues } from "@/features/fleet/lib/validation";
import type { Truck } from "@/shared/types/truck";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  truck: Truck;
};

export const TruckEditDialog = ({ open, onOpenChange, truck }: Props) => {
  const updateTruck = useUpdateTruck();
  const form = useForm<TruckEditValues>({
    resolver: zodResolver(truckEditSchema) as Resolver<TruckEditValues>,
    defaultValues: {
      name: truck.name,
      type: truck.type,
      payloadT: truck.payloadT,
      trackerId: truck.trackerId,
      locationLabel: truck.locationLabel,
      status: truck.status,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateTruck.mutateAsync({ truckId: truck.id, ...values });
      toast.success("Truck updated");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update truck");
    }
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit truck</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="tr-edit-name">Name / plate</FieldLabel>
              <Input id="tr-edit-name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.type}>
              <FieldLabel>Type</FieldLabel>
              <Select
                onValueChange={(v) => form.setValue("type", v as TruckEditValues["type"])}
                value={form.watch("type")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Semi">Semi</SelectItem>
                    <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                    <SelectItem value="Flatbed">Flatbed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError errors={[form.formState.errors.type]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.payloadT}>
              <FieldLabel htmlFor="tr-edit-payload">Payload (t)</FieldLabel>
              <Input id="tr-edit-payload" type="number" {...form.register("payloadT")} />
              <FieldError errors={[form.formState.errors.payloadT]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.trackerId}>
              <FieldLabel htmlFor="tr-edit-tracker">GPS tracker ID</FieldLabel>
              <Input id="tr-edit-tracker" {...form.register("trackerId")} />
              <FieldError errors={[form.formState.errors.trackerId]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.locationLabel}>
              <FieldLabel htmlFor="tr-edit-loc">Location label</FieldLabel>
              <Input id="tr-edit-loc" {...form.register("locationLabel")} />
              <FieldError errors={[form.formState.errors.locationLabel]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.status}>
              <FieldLabel>Status</FieldLabel>
              <Select
                onValueChange={(v) => form.setValue("status", v as TruckEditValues["status"])}
                value={form.watch("status")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="on_road">On road</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError errors={[form.formState.errors.status]} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={updateTruck.isPending} icon={<SaveIcon />} type="submit">
              {updateTruck.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
