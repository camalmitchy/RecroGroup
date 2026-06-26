"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/features/auth/lib/queries";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/lib/schemas";

const defaultValues: ForgotPasswordInput = {
  email: "",
};

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const [values, setValues] = useState<ForgotPasswordInput>(defaultValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ForgotPasswordInput, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = forgotPasswordSchema.safeParse(values);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: errors.email?.[0] });
      return;
    }

    setFieldErrors({});

    try {
      await forgotPassword.mutateAsync(parsed.data);
      setSubmitted(true);
    } catch {
      // mutation error is surfaced below
    }
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <Alert>
          <CheckCircle2 />
          <AlertDescription>
            If an account exists for that email, we&apos;ve sent password reset
            instructions. Check your inbox and spam folder.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="w-full rounded-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the email linked to your account and we&apos;ll send reset
          instructions.
        </p>
      </div>

      {forgotPassword.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{forgotPassword.error.message}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field data-invalid={!!fieldErrors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={(event) => {
                setValues({ email: event.target.value });
                setFieldErrors({});
              }}
              aria-invalid={!!fieldErrors.email}
            />
            <FieldError>{fieldErrors.email}</FieldError>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={forgotPassword.isPending}
        >
          {forgotPassword.isPending ? <Spinner /> : null}
          Send reset link
        </Button>
      </form>

      <FieldDescription className="text-center">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </FieldDescription>
    </div>
  );
}
