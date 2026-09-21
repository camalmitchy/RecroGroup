"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    Smartphone,
    CreditCard,
    Building2,
    Loader2,
    HandHeart,
    Check,
    ArrowLeft,
} from "lucide-react";

import { createDonation } from "@/server/actions/donation";
import { PaymentStatusPanel } from "@/features/public/shared/payment-status-panel";
import { usePaymentCheckout } from "@/features/public/shared/use-payment-checkout";

const PRESET_AMOUNTS = [2500, 5000, 11000, 15000, 45000];
const MIN_DONATION_KES = 100;

function parseKesAmount(raw: string) {
    return parseInt(raw.replace(/\D/g, ""), 10) || 0;
}

function toMpesaLocal(phone: string) {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("254") && digits.length >= 12) return digits.slice(3, 12);
    if (digits.startsWith("0") && digits.length >= 10) return digits.slice(1, 10);
    return digits.slice(0, 9);
}

export function SponsorChildPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState(11000);
    const [customAmount, setCustomAmount] = useState("");
    const [message, setMessage] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [mpesaPhone, setMpesaPhone] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [payError, setPayError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const checkout = usePaymentCheckout();
    const donationIdRef = useRef<string | null>(null);
    const amountRef = useRef<number | null>(null);

    const effectiveAmount = customAmount ? parseKesAmount(customAmount) : amount;
    const amountValid = effectiveAmount >= MIN_DONATION_KES;
    const busy = checkout.busy || submitting;

    const validate = useCallback(() => {
        const next: Record<string, string> = {};
        if (!fullName.trim()) next.fullName = "Please enter your full name";
        if (!email.trim()) next.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            next.email = "Enter a valid email address";
        }
        if (!amountValid) {
            next.amount = `Minimum sponsorship is Ksh ${MIN_DONATION_KES.toLocaleString()}`;
        }
        if (!/^(7|1)\d{8}$/.test(mpesaPhone)) {
            next.mpesaPhone = "Enter a valid 9-digit M-Pesa number (without +254)";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }, [fullName, email, amountValid, mpesaPhone]);

    const pay = async () => {
        if (busy || !validate()) return;
        setPayError("");
        setSubmitting(true);

        try {
            if (donationIdRef.current && amountRef.current !== effectiveAmount) {
                donationIdRef.current = null;
                checkout.reset();
            }

            if (!donationIdRef.current) {
                const result = await createDonation({
                    donorName: fullName.trim(),
                    donorEmail: email.trim(),
                    donorPhone: `+254${mpesaPhone}`,
                    amountKes: effectiveAmount,
                    isAnonymous: anonymous,
                    message: message.trim() || undefined,
                });

                if (!result.ok) {
                    if (result.fieldErrors?.amountKes?.[0]) {
                        setErrors((prev) => ({
                            ...prev,
                            amount: result.fieldErrors!.amountKes[0],
                        }));
                    }
                    if (result.fieldErrors?.donorPhone?.[0]) {
                        setErrors((prev) => ({
                            ...prev,
                            mpesaPhone: result.fieldErrors!.donorPhone[0],
                        }));
                    }
                    setPayError(result.error);
                    toast.error(result.error);
                    return;
                }

                donationIdRef.current = result.data.donationId;
                amountRef.current = effectiveAmount;
            }

            const started = await checkout.start({
                method: "MPESA",
                target: { donationId: donationIdRef.current },
                phone: `+254${mpesaPhone}`,
                email: email.trim(),
                name: fullName.trim(),
            });

            if (!started.ok && started.error) {
                setPayError(started.error);
                toast.error(started.error);
            }
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (checkout.phase === "paid") setDone(true);
    }, [checkout.phase]);

    if (done) {
        return (
            <>
                <SponsorHero />
                <section className="container-page py-14 max-w-3xl">
                    <div className="text-center py-14 rounded-3xl border border-border bg-card">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                            <Check size={26} />
                        </span>
                        <h2 className="mt-5 font-serif text-3xl font-semibold">Thank you</h2>
                        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                            Your sponsorship of{" "}
                            <span className="font-medium text-foreground">
                                Ksh {effectiveAmount.toLocaleString()}
                            </span>{" "}
                            is recorded. A coordinator will confirm by email and share how your
                            gift is being put to work.
                        </p>
                        {checkout.reference && (
                            <p className="mt-4 font-mono text-sm text-muted-foreground">
                                Reference: {checkout.reference}
                            </p>
                        )}
                        <div className="mt-8">
                            <Link href="/grief-camp" className="btn-secondary">
                                Back to Grief Camp
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    const showStatus =
        checkout.phase !== "idle" && checkout.phase !== "initiating";

    return (
        <>
            <SponsorHero />

            <section className="container-page py-14 max-w-3xl">
                <div className="rounded-3xl border border-border bg-card p-7 md:p-9 shadow-[var(--shadow-soft)]">
                    <h2 className="font-serif text-2xl font-semibold flex items-center gap-2 text-primary-deep">
                        <HandHeart size={22} className="text-primary" /> Your details
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Any amount helps — choose a preset or enter a custom amount, then pay
                        with M-Pesa.
                    </p>

                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        <Field
                            label="Full name *"
                            value={fullName}
                            onChange={setFullName}
                            placeholder="Jane Doe"
                            error={errors.fullName}
                            disabled={busy}
                        />
                        <Field
                            label="Email *"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="jane@example.com"
                            error={errors.email}
                            disabled={busy}
                        />
                    </div>

                    <div className="mt-8">
                        <p className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                            Sponsorship amount (KES)
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                            {PRESET_AMOUNTS.map((preset) => {
                                const selected = !customAmount && preset === amount;
                                return (
                                    <button
                                        key={preset}
                                        type="button"
                                        disabled={busy}
                                        onClick={() => {
                                            setAmount(preset);
                                            setCustomAmount("");
                                        }}
                                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                            selected
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "border-border bg-card hover:border-primary"
                                        }`}
                                    >
                                        Ksh {preset.toLocaleString()}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4">
                            <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                                Or enter a custom amount
                            </label>
                            <input
                                value={customAmount}
                                onChange={(e) =>
                                    setCustomAmount(e.target.value.replace(/\D/g, ""))
                                }
                                inputMode="numeric"
                                placeholder="e.g. 7500"
                                disabled={busy}
                                className={`mt-2 w-full rounded-2xl border bg-card px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
                                    errors.amount
                                        ? "border-red-500"
                                        : "border-border focus:border-primary"
                                }`}
                            />
                            {errors.amount && (
                                <p className="mt-2 text-xs text-red-500">{errors.amount}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                            Message (optional)
                        </label>
                        <textarea
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="A word of encouragement for the sponsored child…"
                            disabled={busy}
                            className="mt-2 w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                        />
                    </div>

                    <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                            disabled={busy}
                            className="accent-primary"
                        />
                        Sponsor anonymously
                    </label>
                    {anonymous && (
                        <p className="mt-2 text-xs text-muted-foreground italic pl-6">
                            Your name will not be shown publicly. We still need your contact
                            details to send your receipt.
                        </p>
                    )}

                    <div className="mt-10 border-t border-border pt-8">
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="font-serif text-2xl font-semibold text-primary-deep">
                                Pay with M-Pesa
                            </h3>
                            <span className="font-serif text-xl font-semibold">
                                {amountValid ? `Ksh ${effectiveAmount.toLocaleString()}` : "—"}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We&apos;ll send an STK push to your phone for the amount above.
                        </p>

                        {showStatus ? (
                            <div className="mt-6">
                                <PaymentStatusPanel
                                    phase={checkout.phase}
                                    reference={checkout.reference}
                                    customerMessage={checkout.customerMessage}
                                    failureReason={checkout.failureReason}
                                    secondsLeft={checkout.secondsLeft}
                                    onRetry={checkout.reset}
                                />
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                                    M-Pesa number *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none font-medium">
                                        +254
                                    </span>
                                    <input
                                        value={mpesaPhone}
                                        onChange={(e) => {
                                            setMpesaPhone(toMpesaLocal(e.target.value));
                                            if (errors.mpesaPhone) {
                                                setErrors((prev) => {
                                                    const next = { ...prev };
                                                    delete next.mpesaPhone;
                                                    return next;
                                                });
                                            }
                                        }}
                                        placeholder="712345678"
                                        maxLength={9}
                                        inputMode="numeric"
                                        disabled={busy}
                                        className={`w-full rounded-2xl border bg-card pl-16 pr-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
                                            errors.mpesaPhone
                                                ? "border-red-500"
                                                : "border-border focus:border-primary"
                                        }`}
                                    />
                                </div>
                                {errors.mpesaPhone && (
                                    <p className="text-xs text-red-500">{errors.mpesaPhone}</p>
                                )}
                                {payError && (
                                    <p className="text-sm text-red-600">{payError}</p>
                                )}
                                <p className="text-xs rounded-full bg-primary-soft text-primary-deep px-3 py-1.5 inline-block">
                                    Buy Goods · Till 747736 · Recro Group Limited
                                </p>
                                <button
                                    type="button"
                                    onClick={() => void pay()}
                                    disabled={busy || !amountValid}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {busy ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" /> Sending
                                            STK…
                                        </>
                                    ) : (
                                        <>
                                            <Smartphone size={15} /> Pay{" "}
                                            {amountValid
                                                ? `Ksh ${effectiveAmount.toLocaleString()}`
                                                : ""}{" "}
                                            with M-Pesa
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="mt-6 grid sm:grid-cols-2 gap-3">
                            <ComingSoonCard
                                icon={<CreditCard size={18} />}
                                title="Visa / Mastercard"
                                sub="Coming soon"
                            />
                            <ComingSoonCard
                                icon={<Building2 size={18} />}
                                title="Bank transfer"
                                sub="Coming soon"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <Link
                            href="/grief-camp"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft size={16} /> Back to Grief Camp
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

function SponsorHero() {
    return (
        <section className="relative bg-primary-deep text-white py-20">
            <div className="container-page text-center">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary-soft">
                    Grief Camp · Sponsorship
                </span>
                <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl">
                    Sponsor a Child
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white/90">
                    Your generosity gives a grieving child a safe place to heal —
                    accommodation, meals, therapy and gentle time in nature.
                </p>
            </div>
        </section>
    );
}

function ComingSoonCard({
    icon,
    title,
    sub,
}: {
    icon: React.ReactNode;
    title: string;
    sub: string;
}) {
    return (
        <div className="text-left rounded-2xl border border-dashed border-border bg-muted/40 p-5 opacity-70">
            <div className="flex items-center gap-2.5 font-semibold">
                {icon} {title}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled = false,
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
}) {
    return (
        <div>
            <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                {label}
            </label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`mt-2 w-full rounded-2xl border bg-card px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
                    error ? "border-red-500" : "border-border focus:border-primary"
                } ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : ""}`}
            />
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}
