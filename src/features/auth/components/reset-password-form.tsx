"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { useResetPassword } from "@/features/auth/lib/queries";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/lib/schemas";

export function ResetPasswordForm({ token }: { token: string | undefined }) {
  const router = useRouter();
  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset link is invalid
          </h1>
          <p className="text-sm text-muted-foreground">
            Request a new password reset email and use the latest link.
          </p>
        </div>
        <Button asChild className="w-full rounded-full" size="lg">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword.mutateAsync({ token, password: data.password });
      toast.success("Password updated. You can sign in now.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      if (!applyServerFieldErrors(error, setError)) {
        toast.error(getFormErrorMessage(error));
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Choose a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter a new password for your Recro account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldDescription>
              At least 8 characters with a letter and a number.
            </FieldDescription>
            <FieldError errors={[errors.password]} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={isSubmitting || resetPassword.isPending}
        >
          {isSubmitting || resetPassword.isPending ? <Spinner /> : null}
          Update password
        </Button>
      </form>
    </div>
  );
}
