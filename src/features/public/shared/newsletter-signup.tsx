"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { subscribeNewsletter } from "@/server/actions/newsletter";

type NewsletterSignupProps = {
  placeholder?: string;
  buttonClassName?: string;
  inputClassName?: string;
  layoutClassName?: string;
};

export function NewsletterSignup({
  placeholder = "Your email address",
  buttonClassName = "btn-primary shrink-0",
  inputClassName = "flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none",
  layoutClassName = "flex flex-col gap-3 sm:flex-row md:min-w-[380px]",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className={layoutClassName}
      onSubmit={(event) => {
        event.preventDefault();
        if (isPending) return;

        startTransition(async () => {
          const result = await subscribeNewsletter({ email });
          if (!result.ok) {
            toast.error(result.error);
            return;
          }

          setEmail("");
          toast.success(
            result.data.alreadySubscribed
              ? "You are already on the list."
              : "You are subscribed. We will be in touch.",
          );
        });
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        required
        disabled={isPending}
        className={inputClassName}
      />
      <button type="submit" disabled={isPending} className={buttonClassName}>
        {isPending ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
