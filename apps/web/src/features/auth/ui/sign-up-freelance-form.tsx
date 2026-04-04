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
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  signUpFreelanceSchema,
  type SignUpFreelanceValues,
} from "@/features/auth/lib/validation";
import { authClient } from "@/shared/lib/auth-client";

export const SignUpFreelanceForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignUpFreelanceValues>({
    resolver: zodResolver(signUpFreelanceSchema) as Resolver<SignUpFreelanceValues>,
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      licenseNumber: "",
      vehicleType: "Truck",
      payloadT: 10,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.fullName,
      });
      if (error) {
        toast.error(error.message ?? "Registration failed");
        return;
      }
      toast.success("Welcome, driver");
      await navigate({ to: "/offers", replace: true });
    } catch {
      toast.error("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="border-border/60 shadow-xl shadow-primary/8 overflow-hidden">
      <div
        aria-hidden
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, oklch(0.540 0.200 267), oklch(0.580 0.200 300))" }}
      />
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Freelance driver</CardTitle>
        <CardDescription>Register to receive freight offers</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.fullName}>
              <FieldLabel htmlFor="fl-name">Full name</FieldLabel>
              <Input id="fl-name" aria-invalid={!!form.formState.errors.fullName} {...form.register("fullName")} />
              <FieldError errors={[form.formState.errors.fullName]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="fl-email">Email</FieldLabel>
              <Input
                id="fl-email"
                type="email"
                aria-invalid={!!form.formState.errors.email}
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel htmlFor="fl-password">Password</FieldLabel>
              <Input
                id="fl-password"
                type="password"
                aria-invalid={!!form.formState.errors.password}
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.phone}>
              <FieldLabel htmlFor="fl-phone">Phone</FieldLabel>
              <Input id="fl-phone" type="tel" aria-invalid={!!form.formState.errors.phone} {...form.register("phone")} />
              <FieldError errors={[form.formState.errors.phone]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.licenseNumber}>
              <FieldLabel htmlFor="fl-license">Driver license number</FieldLabel>
              <Input
                id="fl-license"
                aria-invalid={!!form.formState.errors.licenseNumber}
                {...form.register("licenseNumber")}
              />
              <FieldError errors={[form.formState.errors.licenseNumber]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.vehicleType}>
              <FieldLabel>Vehicle type</FieldLabel>
              <Select
                onValueChange={(v) => form.setValue("vehicleType", v as SignUpFreelanceValues["vehicleType"])}
                value={form.watch("vehicleType")}
              >
                <SelectTrigger className="w-full" id="fl-vehicle" aria-invalid={!!form.formState.errors.vehicleType}>
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
              <FieldError errors={[form.formState.errors.vehicleType]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.payloadT}>
              <FieldLabel htmlFor="fl-payload">Vehicle payload (t)</FieldLabel>
              <Input
                id="fl-payload"
                step="0.1"
                type="number"
                aria-invalid={!!form.formState.errors.payloadT}
                {...form.register("payloadT")}
              />
              <FieldError errors={[form.formState.errors.payloadT]} />
            </Field>
          </FieldGroup>
          <Button className="w-full" loading={isSubmitting} type="submit">
            Create account
          </Button>
        </form>
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
