import { Button } from "@innovate-test/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@innovate-test/ui/components/field";
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
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="co-name">Company name</FieldLabel>
        <Input id="co-name" {...form.register("companyName")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="co-tax">Tax ID</FieldLabel>
        <Input id="co-tax" {...form.register("taxId")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="co-country">Country</FieldLabel>
        <Input id="co-country" {...form.register("country")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="co-city">City</FieldLabel>
        <Input id="co-city" {...form.register("city")} />
      </Field>
    </FieldGroup>
    <Button disabled={isSaving} type="submit">
      {isSaving ? "Saving..." : "Save company"}
    </Button>
  </form>
);
