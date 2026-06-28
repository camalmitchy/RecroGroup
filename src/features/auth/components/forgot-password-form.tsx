"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
import {
  applyServerFieldErrors,
  getFormErrorMessage,
} from "@/features/auth/lib/form-errors";
import { useForgotPassword } from "@/features/auth/lib/queries";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/lib/schemas";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword.mutateAsync(data);
      setSubmitted(true);
    } catch (error) {
      if (!applyServerFieldErrors(error, setError)) {
        toast.error(getFormErrorMessage(error));
      }
    }
  });

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

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={isSubmitting || forgotPassword.isPending}
        >
          {isSubmitting || forgotPassword.isPending ? <Spinner /> : null}
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
