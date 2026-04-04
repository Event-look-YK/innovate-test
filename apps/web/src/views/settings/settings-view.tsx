import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@innovate-test/ui/components/tabs";
import { useForm } from "react-hook-form";

import {
  companySchema,
  profileSchema,
  type CompanyValues,
  type ProfileValues,
} from "@/features/settings/lib/validation";
import { SettingsCompanyTab } from "@/features/settings/ui/settings-company-tab";
import { SettingsNotificationsTab } from "@/features/settings/ui/settings-notifications-tab";
import { SettingsProfileTab } from "@/features/settings/ui/settings-profile-tab";
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
          <SettingsProfileTab form={profileForm} userEmail={user?.email} />
        </TabsContent>
        {isAdmin ? (
          <TabsContent className="mt-4" value="company">
            <SettingsCompanyTab form={companyForm} />
          </TabsContent>
        ) : null}
        <TabsContent className="mt-4" value="notifications">
          <SettingsNotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
