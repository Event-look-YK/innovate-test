import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@innovate-test/ui/components/tabs";
import { useEffect } from "react";
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
import { http } from "@/shared/lib/http";
import type { CompanyProfile } from "@/shared/types/profile";

export const SettingsView = () => {
  const { user, profile } = useCurrentUser();
  const isAdmin = user?.role === ROLES.CARRIER_ADMIN;

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "", language: "en" },
  });

  const companyForm = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { companyName: "", taxId: "", country: "", city: "" },
  });

  const companyQuery = useQuery({
    queryKey: ["company"],
    queryFn: () => http.get<CompanyProfile>("/api/company"),
    enabled: isAdmin,
  });

  const updateProfile = useMutation({
    mutationFn: (values: ProfileValues) => http.post<{ success: true }>("/api/profile", values),
  });

  const updateCompany = useMutation({
    mutationFn: (values: CompanyValues) =>
      http.post<CompanyProfile>("/api/company", {
        name: values.companyName,
        taxId: values.taxId,
        country: values.country,
        city: values.city,
      }),
  });

  useEffect(() => {
    if (!profile) return;
    profileForm.reset({
      fullName: profile.name,
      phone: profile.phone ?? "",
      language: profile.language,
    });
  }, [profile, profileForm]);

  useEffect(() => {
    if (!companyQuery.data) return;
    companyForm.reset({
      companyName: companyQuery.data.name,
      taxId: companyQuery.data.taxId,
      country: companyQuery.data.country,
      city: companyQuery.data.city,
    });
  }, [companyForm, companyQuery.data]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Profile and preferences</p>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {isAdmin ? <TabsTrigger value="company">Company</TabsTrigger> : null}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value="profile">
          <SettingsProfileTab
            form={profileForm}
            userEmail={user?.email}
            isSaving={updateProfile.isPending}
            onSubmit={async (values) => {
              await updateProfile.mutateAsync(values);
            }}
          />
        </TabsContent>
        {isAdmin ? (
          <TabsContent className="mt-4" value="company">
            <SettingsCompanyTab
              form={companyForm}
              isSaving={updateCompany.isPending}
              onSubmit={async (values) => {
                await updateCompany.mutateAsync(values);
              }}
            />
          </TabsContent>
        ) : null}
        <TabsContent className="mt-4" value="notifications">
          <SettingsNotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
