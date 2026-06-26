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
import { useSignUp } from "@/features/auth/lib/queries";
import { signUpSchema, type SignUpInput } from "@/features/auth/lib/schemas";

const defaultValues: SignUpInput = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  commsEmail: true,
  commsSms: false,
};

export function SignUpForm() {
  const router = useRouter();
  const signUp = useSignUp();
  const [values, setValues] = useState<SignUpInput>(defaultValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignUpInput, string>>
  >({});

  function updateField<K extends keyof SignUpInput>(
    key: K,
    value: SignUpInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = signUpSchema.safeParse(values);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
        confirmPassword: errors.confirmPassword?.[0],
        phone: errors.phone?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      await signUp.mutateAsync(parsed.data);
      router.push("/dashboard");
      router.refresh();
    } catch {
      // mutation error is surfaced below
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Join Recro</h1>
        <p className="text-sm text-muted-foreground">
          Create your account to book sessions, track appointments, and access
          your care journey.
        </p>
      </div>

      {signUp.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{signUp.error.message}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field data-invalid={!!fieldErrors.name}>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Jane Doe"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              aria-invalid={!!fieldErrors.name}
            />
            <FieldError>{fieldErrors.name}</FieldError>
          </Field>

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

          <Field data-invalid={!!fieldErrors.phone}>
            <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+254 7XX XXX XXX"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              aria-invalid={!!fieldErrors.phone}
            />
            <FieldError>{fieldErrors.phone}</FieldError>
          </Field>

          <Field data-invalid={!!fieldErrors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-invalid={!!fieldErrors.password}
            />
            <FieldDescription>
              At least 8 characters with a letter and a number.
            </FieldDescription>
            <FieldError>{fieldErrors.password}</FieldError>
          </Field>

          <Field data-invalid={!!fieldErrors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={values.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              aria-invalid={!!fieldErrors.confirmPassword}
            />
            <FieldError>{fieldErrors.confirmPassword}</FieldError>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="commsEmail"
              checked={values.commsEmail}
              onCheckedChange={(checked) =>
                updateField("commsEmail", checked === true)
              }
            />
            <FieldLabel htmlFor="commsEmail" className="font-normal">
              Email me appointment reminders and updates
            </FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="commsSms"
              checked={values.commsSms}
              onCheckedChange={(checked) =>
                updateField("commsSms", checked === true)
              }
            />
            <FieldLabel htmlFor="commsSms" className="font-normal">
              Send SMS reminders when available
            </FieldLabel>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={signUp.isPending}
        >
          {signUp.isPending ? <Spinner /> : null}
          Create account
        </Button>
      </form>

      <FieldDescription className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </FieldDescription>
    </div>
  );
}
