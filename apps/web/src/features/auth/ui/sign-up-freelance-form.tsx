import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
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
import { Stepper } from "@innovate-test/ui/components/stepper";
import { cn } from "@innovate-test/ui/lib/utils";
import { BadgeCheckIcon, ChevronLeftIcon, ChevronRightIcon, TruckIcon, UserRoundIcon } from "lucide-react";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useOnboard } from "@/features/auth/hooks/use-onboard";
import {
  signUpFreelanceStep1Schema,
  signUpFreelanceStep2Schema,
  type SignUpFreelanceStep1Values,
  type SignUpFreelanceStep2Values,
} from "@/features/auth/lib/validation";
import { authClient } from "@/shared/lib/auth-client";

const STEPS = [
  { title: "Account", description: "Sign-in" },
  { title: "Vehicle", description: "License & load" },
  { title: "Confirm", description: "Review" },
] as const;

const STEP_HEADLINES = [
  {
    Icon: UserRoundIcon,
    title: "Join as a driver",
    description: "Create secure credentials. You will use this email to sign in and get paid trip alerts.",
  },
  {
    Icon: TruckIcon,
    title: "Your rig",
    description: "We match loads to your vehicle class and capacity — be accurate so offers stay relevant.",
  },
  {
    Icon: BadgeCheckIcon,
    title: "Ready to roll",
    description: "Double-check everything, then tap create to start receiving freight offers.",
  },
] as const;

export const SignUpFreelanceForm = () => {
  const navigate = useNavigate();
  const onboard = useOnboard();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [s1, setS1] = useState<SignUpFreelanceStep1Values | null>(null);
  const [s2, setS2] = useState<SignUpFreelanceStep2Values | null>(null);

  const form1 = useForm<SignUpFreelanceStep1Values>({
    resolver: zodResolver(signUpFreelanceStep1Schema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const form2 = useForm<SignUpFreelanceStep2Values>({
    resolver: zodResolver(signUpFreelanceStep2Schema) as Resolver<SignUpFreelanceStep2Values>,
    defaultValues: {
      phone: "",
      licenseNumber: "",
      vehicleType: "Truck",
      payloadT: 10,
    },
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
        role: "FREELANCE_DRIVER",
        phone: s2.phone || undefined,
        licenseNumber: s2.licenseNumber,
        vehicleType: s2.vehicleType,
        payloadT: Number(s2.payloadT),
      });
      toast.success("Welcome, driver");
      await navigate({ to: "/offers", replace: true });
    } catch {
      toast.error("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { Icon: HeadIcon, title: headTitle, description: headDescription } = STEP_HEADLINES[step];

  return (
    <Card className="relative overflow-hidden border-border/60 shadow-xl shadow-primary/10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-emerald-500/6 blur-3xl dark:bg-emerald-400/8"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-12 size-52 rounded-full bg-primary/6 blur-2xl"
      />
      <div
        aria-hidden
        className="h-1 w-full bg-linear-to-r from-emerald-600/90 via-primary to-primary/70 dark:from-emerald-500/90"
      />
      <CardHeader className="relative z-1 gap-6 pb-2 pt-8">
        <Stepper activeIndex={step} className="px-1" steps={[...STEPS]} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-400",
            )}
          >
            <HeadIcon className="size-7" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">{headTitle}</CardTitle>
            <CardDescription className="text-pretty text-sm leading-relaxed">{headDescription}</CardDescription>
          </div>
        </div>
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
                  <FieldLabel htmlFor="fl-name">Full name</FieldLabel>
                  <Input
                    id="fl-name"
                    placeholder="Andriy Shevchenko"
                    aria-invalid={!!form1.formState.errors.fullName}
                    {...form1.register("fullName")}
                  />
                  <FieldError errors={[form1.formState.errors.fullName]} />
                </Field>
                <Field data-invalid={!!form1.formState.errors.email}>
                  <FieldLabel htmlFor="fl-email">Email</FieldLabel>
                  <Input
                    id="fl-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    aria-invalid={!!form1.formState.errors.email}
                    {...form1.register("email")}
                  />
                  <FieldError errors={[form1.formState.errors.email]} />
                </Field>
                <Field data-invalid={!!form1.formState.errors.password}>
                  <FieldLabel htmlFor="fl-password">Password</FieldLabel>
                  <Input
                    id="fl-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={!!form1.formState.errors.password}
                    {...form1.register("password")}
                  />
                  <FieldError errors={[form1.formState.errors.password]} />
                </Field>
                <Field data-invalid={!!form1.formState.errors.confirmPassword}>
                  <FieldLabel htmlFor="fl-confirm">Confirm password</FieldLabel>
                  <Input
                    id="fl-confirm"
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
                <Field data-invalid={!!form2.formState.errors.phone}>
                  <FieldLabel htmlFor="fl-phone">Phone</FieldLabel>
                  <Input
                    id="fl-phone"
                    type="tel"
                    placeholder="+380 67 000 0000"
                    aria-invalid={!!form2.formState.errors.phone}
                    {...form2.register("phone")}
                  />
                  <FieldError errors={[form2.formState.errors.phone]} />
                </Field>
                <Field data-invalid={!!form2.formState.errors.licenseNumber}>
                  <FieldLabel htmlFor="fl-license">Driver license number</FieldLabel>
                  <Input
                    id="fl-license"
                    placeholder="License document number"
                    aria-invalid={!!form2.formState.errors.licenseNumber}
                    {...form2.register("licenseNumber")}
                  />
                  <FieldError errors={[form2.formState.errors.licenseNumber]} />
                </Field>
                <Field data-invalid={!!form2.formState.errors.vehicleType}>
                  <FieldLabel>Vehicle type</FieldLabel>
                  <Select
                    onValueChange={(v) => form2.setValue("vehicleType", v as SignUpFreelanceStep2Values["vehicleType"])}
                    value={form2.watch("vehicleType")}
                  >
                    <SelectTrigger className="w-full" id="fl-vehicle" aria-invalid={!!form2.formState.errors.vehicleType}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Truck">Truck</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form2.formState.errors.vehicleType]} />
                </Field>
                <Field data-invalid={!!form2.formState.errors.payloadT}>
                  <FieldLabel htmlFor="fl-payload">Vehicle payload (t)</FieldLabel>
                  <Input
                    id="fl-payload"
                    step="0.1"
                    type="number"
                    placeholder="10"
                    aria-invalid={!!form2.formState.errors.payloadT}
                    {...form2.register("payloadT")}
                  />
                  <FieldError errors={[form2.formState.errors.payloadT]} />
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle</p>
                  <p className="font-medium text-foreground">{s2.vehicleType}</p>
                  <p className="text-sm text-muted-foreground">{s2.payloadT} t payload</p>
                  <p className="text-sm text-muted-foreground">License {s2.licenseNumber}</p>
                  <p className="text-sm text-muted-foreground">{s2.phone}</p>
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
      <CardFooter className="relative z-[1] flex justify-center border-t border-border/80 bg-muted/20 pt-6">
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
