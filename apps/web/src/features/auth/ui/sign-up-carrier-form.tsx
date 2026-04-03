import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import { Separator } from "@innovate-test/ui/components/separator";
import { Spinner } from "@innovate-test/ui/components/spinner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  signUpCarrierStep1Schema,
  signUpCarrierStep2Schema,
  type SignUpCarrierStep1Values,
  type SignUpCarrierStep2Values,
} from "@/features/auth/lib/validation";
import { authClient } from "@/shared/lib/auth-client";

const steps = ["Account", "Company", "Confirm"] as const;

export const SignUpCarrierForm = () => {
  const navigate = useNavigate();
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
      toast.success("Account created");
      await navigate({ to: "/dashboard", replace: true });
    } catch {
      toast.error("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/60 bg-card/80 shadow-lg shadow-primary/5 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-4 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={
                  i === step
                    ? "rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    : i < step
                      ? "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      : "rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                }
              >
                {i + 1}. {label}
              </span>
              {i < steps.length - 1 ? <Separator orientation="vertical" className="h-6" /> : null}
            </div>
          ))}
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">Carrier registration</CardTitle>
        <CardDescription>Create your company workspace</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 0 ? (
          <form className="flex flex-col gap-6" onSubmit={onNextFromStep1}>
            <FieldGroup>
              <Field data-invalid={!!form1.formState.errors.fullName}>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input id="fullName" aria-invalid={!!form1.formState.errors.fullName} {...form1.register("fullName")} />
                <FieldError errors={[form1.formState.errors.fullName]} />
              </Field>
              <Field data-invalid={!!form1.formState.errors.email}>
                <FieldLabel htmlFor="su-email">Email</FieldLabel>
                <Input
                  id="su-email"
                  type="email"
                  autoComplete="email"
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
                  aria-invalid={!!form1.formState.errors.confirmPassword}
                  {...form1.register("confirmPassword")}
                />
                <FieldError errors={[form1.formState.errors.confirmPassword]} />
              </Field>
            </FieldGroup>
            <Button type="submit">Continue</Button>
          </form>
        ) : null}

        {step === 1 ? (
          <form className="flex flex-col gap-6" onSubmit={onNextFromStep2}>
            <FieldGroup>
              <Field data-invalid={!!form2.formState.errors.companyName}>
                <FieldLabel htmlFor="companyName">Company name</FieldLabel>
                <Input
                  id="companyName"
                  aria-invalid={!!form2.formState.errors.companyName}
                  {...form2.register("companyName")}
                />
                <FieldError errors={[form2.formState.errors.companyName]} />
              </Field>
              <Field data-invalid={!!form2.formState.errors.taxId}>
                <FieldLabel htmlFor="taxId">Tax ID</FieldLabel>
                <Input id="taxId" aria-invalid={!!form2.formState.errors.taxId} {...form2.register("taxId")} />
                <FieldError errors={[form2.formState.errors.taxId]} />
              </Field>
              <Field data-invalid={!!form2.formState.errors.country}>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input id="country" aria-invalid={!!form2.formState.errors.country} {...form2.register("country")} />
                <FieldError errors={[form2.formState.errors.country]} />
              </Field>
              <Field data-invalid={!!form2.formState.errors.city}>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" aria-invalid={!!form2.formState.errors.city} {...form2.register("city")} />
                <FieldError errors={[form2.formState.errors.city]} />
              </Field>
            </FieldGroup>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button type="submit">Review</Button>
            </div>
          </form>
        ) : null}

        {step === 2 && s1 && s2 ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <p className="font-medium text-foreground">Account</p>
              <p className="text-muted-foreground">
                {s1.fullName} · {s1.email}
              </p>
              <p className="mt-3 font-medium text-foreground">Company</p>
              <p className="text-muted-foreground">
                {s2.companyName} · {s2.taxId}
              </p>
              <p className="text-muted-foreground">
                {s2.city}, {s2.country}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={isSubmitting} type="button" onClick={onSubmitFinal}>
                {isSubmitting ? <Spinner className="size-4" /> : "Create account"}
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="text-primary underline-offset-4 hover:underline" to="/auth/sign-in">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
