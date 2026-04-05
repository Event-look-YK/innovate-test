import { Button } from "@innovate-test/ui/components/button";
import { SaveIcon } from "lucide-react";
import { Field, FieldLabel } from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { CompanyValues } from "@/features/settings/lib/validation";

type Props = {
  form: UseFormReturn<CompanyValues>;
  isSaving?: boolean;
  onSubmit: (values: CompanyValues) => void | Promise<void>;
};

export const SettingsCompanyTab = ({ form, isSaving, onSubmit }: Props) => (
  <form
    className="flex flex-col gap-4"
    onSubmit={form.handleSubmit(async (values) => {
      try {
        await onSubmit(values);
        toast.success("Company saved");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save company");
      }
    })}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="co-name">Company name</FieldLabel>
        <Input id="co-name" placeholder="Acme Logistics LLC" {...form.register("companyName")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="co-tax">Tax ID</FieldLabel>
        <Input id="co-tax" placeholder="123456789" {...form.register("taxId")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="co-country">Country</FieldLabel>
        <Input id="co-country" placeholder="Ukraine" {...form.register("country")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="co-city">City</FieldLabel>
        <Input id="co-city" placeholder="Kyiv" {...form.register("city")} />
      </Field>
    </div>
    <Button className="w-fit" disabled={isSaving} icon={<SaveIcon />} type="submit">
      {isSaving ? "Saving..." : "Save company"}
    </Button>
  </form>
);
