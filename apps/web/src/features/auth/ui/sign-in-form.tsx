import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@innovate-test/ui/components/field";
import { Input } from "@innovate-test/ui/components/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signInSchema, type SignInValues } from "@/features/auth/lib/validation";
import { authClient } from "@/shared/lib/auth-client";

export const SignInForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error(error.message ?? "Sign in failed");
        return;
      }
      toast.success("Signed in");
      await navigate({ to: "/dashboard", replace: true });
    } catch {
      toast.error("Sign in failed");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="border-border/60 shadow-xl shadow-primary/8 overflow-hidden">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to your logistics workspace</CardDescription>
      </CardHeader>
      <CardContent className="pb-7">
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                aria-invalid={!!form.formState.errors.email}
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!form.formState.errors.password}
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
          </FieldGroup>
          <Button className="w-full font-semibold" loading={isSubmitting} type="submit" size="lg">
            Sign in
          </Button>
          <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
            <p>
              New carrier?{" "}
              <Link className="font-semibold text-primary underline-offset-4 hover:underline" to="/auth/sign-up">
                Create an account
              </Link>
            </p>
            <p>
              Freelance driver?{" "}
              <Link className="font-semibold text-primary underline-offset-4 hover:underline" to="/auth/sign-up/freelance">
                Join here
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
