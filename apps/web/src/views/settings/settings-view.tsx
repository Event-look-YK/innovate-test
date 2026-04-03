import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@innovate-test/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import { Label } from "@innovate-test/ui/components/label";
import { Switch } from "@innovate-test/ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@innovate-test/ui/components/tabs";
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

import {
  companySchema,
  profileSchema,
  type CompanyValues,
  type ProfileValues,
} from "@/features/settings/lib/validation";
import { ROLES } from "@/shared/constants/roles";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

export const SettingsView = () => {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === ROLES.CARRIER_ADMIN;

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: user?.name ?? "", phone: "", language: "en" },
  });

  const companyForm = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { companyName: "", taxId: "", country: "Ukraine", city: "Kyiv" },
  });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Profile and preferences</p>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {isAdmin ? <TabsTrigger value="company">Company</TabsTrigger> : null}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value="profile">
          <form
            className="flex flex-col gap-4"
            onSubmit={profileForm.handleSubmit(() => toast.success("Profile saved (mock)"))}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="pf-name">Full name</FieldLabel>
                <Input id="pf-name" {...profileForm.register("fullName")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="pf-email">Email</FieldLabel>
                <Input id="pf-email" disabled readOnly value={user?.email ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="pf-phone">Phone</FieldLabel>
                <Input id="pf-phone" {...profileForm.register("phone")} />
              </Field>
              <Field>
                <FieldLabel>Language</FieldLabel>
                <Select
                  onValueChange={(v) => profileForm.setValue("language", v as ProfileValues["language"])}
                  value={profileForm.watch("language")}
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
            <Button type="submit">Save profile</Button>
          </form>
        </TabsContent>
        {isAdmin ? (
          <TabsContent className="mt-4" value="company">
            <form
              className="flex flex-col gap-4"
              onSubmit={companyForm.handleSubmit(() => toast.success("Company saved (mock)"))}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="co-name">Company name</FieldLabel>
                  <Input id="co-name" {...companyForm.register("companyName")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="co-tax">Tax ID</FieldLabel>
                  <Input id="co-tax" {...companyForm.register("taxId")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="co-country">Country</FieldLabel>
                  <Input id="co-country" {...companyForm.register("country")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="co-city">City</FieldLabel>
                  <Input id="co-city" {...companyForm.register("city")} />
                </Field>
              </FieldGroup>
              <Button type="submit">Save company</Button>
            </form>
          </TabsContent>
        ) : null}
        <TabsContent className="mt-4 flex flex-col gap-4" value="notifications">
          {[
            "Task assignments",
            "Route updates",
            "Offer received",
            "Messages",
            "Emergency alerts",
          ].map((label) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <Label htmlFor={label}>{label}</Label>
              <Switch defaultChecked id={label} />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
