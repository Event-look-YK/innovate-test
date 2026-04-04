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
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useInviteTeammate } from "@/features/team/hooks/use-team";
import { inviteSchema, type InviteValues } from "@/features/team/lib/validation";
import { ROLES } from "@/shared/constants/roles";

export const TeamInviteForm = () => {
  const navigate = useNavigate();
  const inviteMutation = useInviteTeammate();
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", fullName: "", role: ROLES.CARRIER_MANAGER },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await inviteMutation.mutateAsync(values);
      toast.success("Invite sent");
      navigate({ to: "/team" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invite");
    }
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="inv-email">Email</FieldLabel>
          <Input id="inv-email" type="email" {...form.register("email")} />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.fullName}>
          <FieldLabel htmlFor="inv-name">Full name</FieldLabel>
          <Input id="inv-name" {...form.register("fullName")} />
          <FieldError errors={[form.formState.errors.fullName]} />
        </Field>
        <Field>
          <FieldLabel>Role</FieldLabel>
          <Select
            onValueChange={(v) => form.setValue("role", v as InviteValues["role"])}
            value={form.watch("role")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ROLES.CARRIER_MANAGER}>Operations manager</SelectItem>
                <SelectItem value={ROLES.CARRIER_DRIVER}>Driver</SelectItem>
                <SelectItem value={ROLES.CARRIER_WAREHOUSE_MANAGER}>Warehouse manager</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
      <div className="flex gap-2">
        <Button disabled={inviteMutation.isPending} type="submit">
          {inviteMutation.isPending ? "Sending..." : "Send invite"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/team" })}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
