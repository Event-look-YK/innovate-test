import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { SaveIcon } from "lucide-react";
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

import { useCreateTruck } from "@/features/fleet/hooks/use-fleet";
import { truckFormSchema, type TruckFormValues } from "@/features/fleet/lib/validation";

export const TruckCreateForm = () => {
  const navigate = useNavigate();
  const createTruck = useCreateTruck();
  const form = useForm<TruckFormValues>({
    resolver: zodResolver(truckFormSchema) as Resolver<TruckFormValues>,
    defaultValues: {
      name: "",
      type: "Truck",
      payloadT: 18,
      trackerId: "",
      locationLabel: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createTruck.mutateAsync(values);
      toast.success("Truck saved");
      await navigate({ to: "/fleet" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save truck");
    }
  });

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={onSubmit}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="tr-name">Name / plate</FieldLabel>
          <Input
            id="tr-name"
            aria-invalid={!!form.formState.errors.name}
            placeholder="e.g. AA 1234 BB or fleet nickname"
            {...form.register("name")}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.type}>
          <FieldLabel>Type</FieldLabel>
          <Select
            onValueChange={(v) => form.setValue("type", v as TruckFormValues["type"])}
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
          <FieldLabel htmlFor="tr-payload">Payload (t)</FieldLabel>
          <Input id="tr-payload" placeholder="18" type="number" {...form.register("payloadT")} />
          <FieldError errors={[form.formState.errors.payloadT]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.trackerId}>
          <FieldLabel htmlFor="tr-tracker">GPS tracker ID</FieldLabel>
          <Input id="tr-tracker" placeholder="Device ID from your GPS provider" {...form.register("trackerId")} />
          <FieldError errors={[form.formState.errors.trackerId]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.locationLabel}>
          <FieldLabel htmlFor="tr-loc">Location label</FieldLabel>
          <Input id="tr-loc" placeholder="e.g. Kyiv depot, on route to Odesa" {...form.register("locationLabel")} />
          <FieldError errors={[form.formState.errors.locationLabel]} />
        </Field>
      </FieldGroup>
      <div className="flex gap-2">
        <Button disabled={createTruck.isPending} icon={<SaveIcon />} type="submit">
          {createTruck.isPending ? "Saving..." : "Save truck"}
        </Button>
        <Button type="button" variant="outline" onClick={() => void navigate({ to: "/fleet" })}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
