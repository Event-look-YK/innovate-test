import { Button } from "@innovate-test/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@innovate-test/ui/components/select";
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
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="pf-name">Full name</FieldLabel>
        <Input id="pf-name" {...form.register("fullName")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="pf-email">Email</FieldLabel>
        <Input id="pf-email" disabled readOnly value={userEmail ?? ""} />
      </Field>
      <Field>
        <FieldLabel htmlFor="pf-phone">Phone</FieldLabel>
        <Input id="pf-phone" {...form.register("phone")} />
      </Field>
      <Field>
        <FieldLabel>Language</FieldLabel>
        <Select
          onValueChange={(v) => form.setValue("language", v as ProfileValues["language"])}
          value={form.watch("language")}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="uk">Українська</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
    <Button disabled={isSaving} type="submit">
      {isSaving ? "Saving..." : "Save profile"}
    </Button>
  </form>
);
