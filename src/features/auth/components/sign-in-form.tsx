"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSignIn } from "@/features/auth/lib/queries";
import { signInSchema, type SignInInput } from "@/features/auth/lib/schemas";

const defaultValues: SignInInput = {
  email: "",
  password: "",
  rememberMe: true,
};

export function SignInForm() {
  const router = useRouter();
  const signIn = useSignIn();
  const [values, setValues] = useState<SignInInput>(defaultValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignInInput, string>>
  >({});

  function updateField<K extends keyof SignInInput>(
    key: K,
    value: SignInInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = signInSchema.safeParse(values);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      await signIn.mutateAsync(parsed.data);
      router.push("/dashboard");
      router.refresh();
    } catch {
      // mutation error is surfaced below
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage bookings, sessions, and your Recro account.
        </p>
      </div>

      {signIn.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{signIn.error.message}</AlertDescription>
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
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={!!fieldErrors.email}
            />
            <FieldError>{fieldErrors.email}</FieldError>
          </Field>

          <Field data-invalid={!!fieldErrors.password}>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-invalid={!!fieldErrors.password}
            />
            <FieldError>{fieldErrors.password}</FieldError>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="rememberMe"
              checked={values.rememberMe}
              onCheckedChange={(checked) =>
                updateField("rememberMe", checked === true)
              }
            />
            <FieldLabel htmlFor="rememberMe" className="font-normal">
              Keep me signed in
            </FieldLabel>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={signIn.isPending}
        >
          {signIn.isPending ? <Spinner /> : null}
          Sign in
        </Button>
      </form>

      <FieldDescription className="text-center">
        New to Recro?{" "}
        <Link href="/join-us" className="font-medium text-primary">
          Create an account
        </Link>
      </FieldDescription>
    </div>
  );
}
