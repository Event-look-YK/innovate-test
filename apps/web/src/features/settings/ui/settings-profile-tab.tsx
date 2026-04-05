import { Button } from "@innovate-test/ui/components/button";
import { Field, FieldLabel } from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { ProfileValues } from "@/features/settings/lib/validation";

type Props = {
  form: UseFormReturn<ProfileValues>;
  userEmail: string | null | undefined;
  isSaving?: boolean;
  onSubmit: (values: ProfileValues) => void | Promise<void>;
};

export const SettingsProfileTab = ({ form, userEmail, isSaving, onSubmit }: Props) => (
  <form
    className="flex flex-col gap-4"
    onSubmit={form.handleSubmit(async (values) => {
      try {
        await onSubmit(values);
        toast.success("Profile saved");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save profile");
      }
    })}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="pf-name">Full name</FieldLabel>
        <Input id="pf-name" placeholder="John Smith" {...form.register("fullName")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="pf-email">Email</FieldLabel>
        <Input id="pf-email" disabled readOnly placeholder="john@company.com" value={userEmail ?? ""} />
      </Field>
      <Field>
        <FieldLabel htmlFor="pf-phone">Phone</FieldLabel>
        <Input id="pf-phone" placeholder="+1 234 567 8900" {...form.register("phone")} />
      </Field>
    </div>
    <Button className="w-fit" disabled={isSaving} type="submit">
      {isSaving ? "Saving..." : "Save profile"}
    </Button>
  </form>
);
