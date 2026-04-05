import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@innovate-test/ui/components/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import { Stepper } from "@innovate-test/ui/components/stepper";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useOnboard } from "@/features/auth/hooks/use-onboard";
import {
  signUpCarrierStep1Schema,
  signUpCarrierStep2Schema,
  type SignUpCarrierStep1Values,
  type SignUpCarrierStep2Values,
} from "@/features/auth/lib/validation";
import { authClient } from "@/shared/lib/auth-client";

const STEPS = [
  { title: "Account", description: "Credentials" },
  { title: "Company", description: "Workspace" },
  { title: "Confirm", description: "Review" },
] as const;

export const SignUpCarrierForm = () => {
  const navigate = useNavigate();
  const onboard = useOnboard();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [s1, setS1] = useState<SignUpCarrierStep1Values | null>(null);
  const [s2, setS2] = useState<SignUpCarrierStep2Values | null>(null);

  const form1 = useForm<SignUpCarrierStep1Values>({
    resolver: zodResolver(signUpCarrierStep1Schema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const form2 = useForm<SignUpCarrierStep2Values>({
    resolver: zodResolver(signUpCarrierStep2Schema),
    defaultValues: { companyName: "", taxId: "", country: "", city: "" },
  });

  const onNextFromStep1 = form1.handleSubmit((data) => {
    setS1(data);
    setStep(1);
  });

  const onNextFromStep2 = form2.handleSubmit((data) => {
    setS2(data);
    setStep(2);
  });

  const onSubmitFinal = async () => {
    if (!s1 || !s2) return;
    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        email: s1.email,
        password: s1.password,
        name: s1.fullName,
      });
      if (error) {
        toast.error(error.message ?? "Registration failed");
        return;
      }
      await onboard.mutateAsync({
        role: "CARRIER_ADMIN",
        companyName: s2.companyName,
        taxId: s2.taxId,
        country: s2.country,
        city: s2.city,
      });
      toast.success("Account created");
      await navigate({ to: "/dashboard", replace: true });
    } catch {
      toast.error("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border-border/60 shadow-xl shadow-primary/10">
      <CardHeader className="relative z-1 gap-6 pt-2">
        <Stepper activeIndex={step} className="px-1" steps={[...STEPS]} />

      </CardHeader>
      <CardContent className="relative z-1">
        <div
          key={step}
          className="animate-in fade-in-0 slide-in-from-right-3 duration-300 fill-mode-both"
        >
          {step === 0 ? (
            <form className="flex flex-col gap-6" onSubmit={onNextFromStep1}>
              <FieldGroup>
                <Field data-invalid={!!form1.formState.errors.fullName}>
                  <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                  <Input
                    id="fullName"
                    placeholder="Olena Kovalenko"
                    aria-invalid={!!form1.formState.errors.fullName}
                    {...form1.register("fullName")}
                  />
                  <FieldError errors={[form1.formState.errors.fullName]} />
                </Field>
                <Field data-invalid={!!form1.formState.errors.email}>
                  <FieldLabel htmlFor="su-email">Email</FieldLabel>
                  <Input
                    id="su-email"
                    type="email"
                    autoComplete="email"
                    placeholder="ops@yourcompany.com"
                    aria-invalid={!!form1.formState.errors.email}
                    {...form1.register("email")}
                  />
                  <FieldError errors={[form1.formState.errors.email]} />
                </Field>
                <Field data-invalid={!!form1.formState.errors.password}>
                  <FieldLabel htmlFor="su-password">Password</FieldLabel>
                  <Input
                    id="su-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={!!form1.formState.errors.password}
                    {...form1.register("password")}
                  />
                  <FieldError errors={[form1.formState.errors.password]} />
                </Field>
                <Field data-invalid={!!form1.formState.errors.confirmPassword}>
                  <FieldLabel htmlFor="su-confirm">Confirm password</FieldLabel>
                  <Input
                    id="su-confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Same as above"
                    aria-invalid={!!form1.formState.errors.confirmPassword}
                    {...form1.register("confirmPassword")}
                  />
                  <FieldError errors={[form1.formState.errors.confirmPassword]} />
                </Field>
              </FieldGroup>
              <Button className="w-full sm:w-auto" size="lg" type="submit">
                Continue
                <ChevronRightIcon className="size-4" />
              </Button>
            </form>
          ) : null}

          {step === 1 ? (
            <form className="flex flex-col gap-6" onSubmit={onNextFromStep2}>
              <FieldGroup>
                <Field data-invalid={!!form2.formState.errors.companyName}>
                  <FieldLabel htmlFor="companyName">Company name</FieldLabel>
                  <Input
                    id="companyName"
                    placeholder="ACME Logistics LLC"
                    aria-invalid={!!form2.formState.errors.companyName}
                    {...form2.register("companyName")}
                  />
                  <FieldError errors={[form2.formState.errors.companyName]} />
                </Field>
                <Field data-invalid={!!form2.formState.errors.taxId}>
                  <FieldLabel htmlFor="taxId">Tax ID</FieldLabel>
                  <Input
                    id="taxId"
                    placeholder="Tax or VAT ID"
                    aria-invalid={!!form2.formState.errors.taxId}
                    {...form2.register("taxId")}
                  />
                  <FieldError errors={[form2.formState.errors.taxId]} />
                </Field>
                <Field data-invalid={!!form2.formState.errors.country}>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    id="country"
                    placeholder="Ukraine"
                    aria-invalid={!!form2.formState.errors.country}
                    {...form2.register("country")}
                  />
                  <FieldError errors={[form2.formState.errors.country]} />
                </Field>
                <Field data-invalid={!!form2.formState.errors.city}>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input id="city" placeholder="Kyiv" aria-invalid={!!form2.formState.errors.city} {...form2.register("city")} />
                  <FieldError errors={[form2.formState.errors.city]} />
                </Field>
              </FieldGroup>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  className="w-full sm:w-auto"
                  icon={<ChevronLeftIcon />}
                  size="lg"
                  type="button"
                  variant="outline"
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button className="w-full sm:w-auto" size="lg" type="submit">
                  Review
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </form>
          ) : null}

          {step === 2 && s1 && s2 ? (
            <div className="flex flex-col gap-6">
              <div className="grid gap-4 rounded-xl border border-border/80 bg-muted/30 p-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account</p>
                  <p className="font-medium text-foreground">{s1.fullName}</p>
                  <p className="text-sm text-muted-foreground">{s1.email}</p>
                </div>
                <div className="space-y-2 sm:border-s sm:border-border/60 sm:ps-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company</p>
                  <p className="font-medium text-foreground">{s2.companyName}</p>
                  <p className="text-sm text-muted-foreground">{s2.taxId}</p>
                  <p className="text-sm text-muted-foreground">
                    {s2.city}, {s2.country}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  className="w-full sm:w-auto"
                  icon={<ChevronLeftIcon />}
                  size="lg"
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button className="w-full sm:w-auto" loading={isSubmitting} size="lg" type="button" onClick={onSubmitFinal}>
                  Create account
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="relative z-1 flex justify-center border-t border-border/80 bg-muted/20 pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-semibold text-primary underline-offset-4 hover:underline" to="/auth/sign-in">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
