"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import {
  applyServerFieldErrors,
  getFormErrorMessage,
} from "@/features/auth/lib/form-errors";
import { useSignUp } from "@/features/auth/lib/queries";
import { signUpSchema, type SignUpInput } from "@/features/auth/lib/schemas";

export function SignUpForm() {
  const router = useRouter();
  const signUp = useSignUp();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      commsEmail: true,
      commsSms: false,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp.mutateAsync(data);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      if (!applyServerFieldErrors(error, setError)) {
        toast.error(getFormErrorMessage(error));
      }
    }
  });

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
    toast.info("Google sign-up coming soon");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign up to continue.</h1>
        <p className="text-sm text-muted-foreground">
          Create your account to book sessions, track appointments, and access
          your care journey.
        </p>
      </div>

      {/* Google Sign Up */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center gap-3 rounded-full border-2 border-border bg-muted/30 px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-muted-foreground">OR</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Jane Doe"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

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

          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+254 7XX XXX XXX"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
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

          <Controller
            name="commsEmail"
            control={control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="commsEmail"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <FieldLabel htmlFor="commsEmail" className="font-normal">
                  Email me appointment reminders and updates
                </FieldLabel>
              </Field>
            )}
          />

          <Controller
            name="commsSms"
            control={control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="commsSms"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <FieldLabel htmlFor="commsSms" className="font-normal">
                  Send SMS reminders when available
                </FieldLabel>
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={isSubmitting || signUp.isPending}
        >
          {isSubmitting || signUp.isPending ? <Spinner /> : null}
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
