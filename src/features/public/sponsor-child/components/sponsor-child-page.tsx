"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Smartphone,
    CreditCard,
    Building2,
    Upload,
    Loader2,
    HandHeart,
    Check,
    ArrowLeft,
} from "lucide-react";

const PRESET_AMOUNTS = [2500, 5000, 11000, 15000, 45000];

export function SponsorChildPage() {
    const [step, setStep] = useState<"details" | "pay" | "done">("details");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState<number>(11000);
    const [customAmount, setCustomAmount] = useState("");
    const [message, setMessage] = useState("");
    const [anonymous, setAnonymous] = useState(false);

    const effectiveAmount = customAmount
        ? Math.max(0, parseInt(customAmount.replace(/\D/g, ""), 10) || 0)
        : amount;

    const onContinue = () => {
        if (!anonymous && !fullName.trim()) {
            alert("Please enter your full name");
            return;
        }
        if (!email.trim()) {
            alert("Email is required");
            return;
        }
        if (effectiveAmount < 100) {
            alert("Minimum sponsorship is Ksh 100");
            return;
        }
        setStep("pay");
    };

    return (
        <>
            {/* Hero Section */}
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

            {/* Main Content */}
            <section className="container-page py-14 max-w-3xl">
                {step === "details" && (
                    <div className="rounded-3xl border border-border bg-card p-7 md:p-9 shadow-[var(--shadow-soft)]">
                        <h2 className="font-serif text-2xl font-semibold flex items-center gap-2 text-primary-deep">
                            <HandHeart size={22} className="text-primary" /> Your details
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Every camper's place is Ksh 15,000. Any amount helps — choose a
                            preset or enter a custom amount.
                        </p>

                        <div className="mt-6 grid sm:grid-cols-2 gap-4">
                            <Field
                                label="Full name *"
                                value={fullName}
                                onChange={setFullName}
                                placeholder="Jane Doe"
                                disabled={anonymous}
                            />
                            <Field
                                label="Email *"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                placeholder="jane@example.com"
                            />
                            <Field
                                label="Phone"
                                value={phone}
                                onChange={setPhone}
                                placeholder="+254 7XX XXX XXX"
                                disabled={anonymous}
                            />
                        </div>

                        <div className="mt-8">
                            <p className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                                Sponsorship amount (KES)
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2.5">
                                {PRESET_AMOUNTS.map((a) => {
                                    const sel = !customAmount && a === amount;
                                    return (
                                        <button
                                            key={a}
                                            type="button"
                                            onClick={() => {
                                                setAmount(a);
                                                setCustomAmount("");
                                            }}
                                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${sel
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "border-border bg-card hover:border-primary"
                                                }`}
                                        >
                                            Ksh {a.toLocaleString()}
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
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    inputMode="numeric"
                                    placeholder="e.g. 7500"
                                    className="mt-2 w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
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
                                className="mt-2 w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                            />
                        </div>

                        <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                            <input
                                type="checkbox"
                                checked={anonymous}
                                onChange={(e) => setAnonymous(e.target.checked)}
                                className="accent-primary"
                            />
                            Sponsor anonymously
                        </label>
                        {anonymous && (
                            <p className="mt-2 text-xs text-muted-foreground italic pl-6">
                                Your name and phone will not be shared. Only email is required for confirmation.
                            </p>
                        )}

                        <div className="mt-8 flex items-center justify-between">
                            <Link
                                href="/grief-camp"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft size={16} /> Back to Grief Camp
                            </Link>
                            <button onClick={onContinue} className="btn-primary">
                                Continue to payment
                            </button>
                        </div>
                    </div>
                )}

                {step === "pay" && (
                    <SponsorPayment
                        fullName={anonymous ? "Anonymous Sponsor" : fullName}
                        realName={fullName}
                        email={email}
                        phone={phone}
                        amount={effectiveAmount}
                        message={message}
                        anonymous={anonymous}
                        onBack={() => setStep("details")}
                        onPaid={() => setStep("done")}
                    />
                )}

                {step === "done" && (
                    <div className="text-center py-14 rounded-3xl border border-border bg-card">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                            <Check size={26} />
                        </span>
                        <h2 className="mt-5 font-serif text-3xl font-semibold">
                            Thank you
                        </h2>
                        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                            Your sponsorship is recorded. A coordinator will confirm by email
                            and share how your gift is being put to work.
                        </p>
                        <div className="mt-8">
                            <Link href="/grief-camp" className="btn-secondary">
                                Back to Grief Camp
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}

function SponsorPayment({
    fullName,
    realName,
    email,
    phone,
    amount,
    message,
    anonymous,
    onBack,
    onPaid,
}: {
    fullName: string;
    realName: string;
    email: string;
    phone: string;
    amount: number;
    message: string;
    anonymous: boolean;
    onBack: () => void;
    onPaid: () => void;
}) {
    const [method, setMethod] = useState<"mpesa" | "card" | "bank">("mpesa");
    const [mpesaPhone, setMpesaPhone] = useState(
        phone.startsWith("+254") ? phone.slice(4) : phone.replace(/^0/, "")
    );
    const [busy, setBusy] = useState(false);
    const [bankRef, setBankRef] = useState("");
    const [proof, setProof] = useState<File | null>(null);

    const purpose = `Grief Camp sponsorship${anonymous ? " (anonymous)" : ` — ${realName}`
        }${message ? ` · Note: ${message.slice(0, 120)}` : ""}`;

    const triggerStk = async () => {
        if (mpesaPhone.length !== 9) {
            alert("Please enter a valid 9-digit M-Pesa number (without +254)");
            return;
        }
        setBusy(true);
        // TODO: Implement M-Pesa STK push
        setTimeout(() => {
            setBusy(false);
            alert(`STK push would be sent to +254${mpesaPhone}. Integration pending.`);
            onPaid();
        }, 1500);
    };

    const triggerCard = async () => {
        setBusy(true);
        // TODO: Implement Pesapal integration
        setTimeout(() => {
            setBusy(false);
            alert("Card payment would redirect here. Integration pending.");
            onPaid();
        }, 1500);
    };

    const submitBank = async () => {
        if (!proof) {
            alert("Please upload your bank slip");
            return;
        }
        if (!bankRef.trim()) {
            alert("Enter the transfer reference");
            return;
        }
        setBusy(true);
        // TODO: Implement bank transfer proof upload
        setTimeout(() => {
            setBusy(false);
            alert("Proof would be uploaded here. Integration pending.");
            onPaid();
        }, 1500);
    };

    return (
        <div className="rounded-3xl border border-border bg-card p-7 md:p-9 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold text-primary-deep">
                    Payment
                </h2>
                <span className="font-serif text-2xl font-semibold">
                    Ksh {amount.toLocaleString()}
                </span>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <MethodCard
                    active={method === "mpesa"}
                    onClick={() => setMethod("mpesa")}
                    icon={<Smartphone size={18} />}
                    title="M-Pesa STK"
                    sub="Prompt sent to your phone."
                />
                <MethodCard
                    active={method === "card"}
                    onClick={() => setMethod("card")}
                    icon={<CreditCard size={18} />}
                    title="Visa / Mastercard"
                    sub="Secure Pesapal hosted checkout."
                />
                <MethodCard
                    active={method === "bank"}
                    onClick={() => setMethod("bank")}
                    icon={<Building2 size={18} />}
                    title="SBM Bank transfer"
                    sub="KES / USD · upload slip."
                />
            </div>

            {method === "mpesa" && (
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
                                const value = e.target.value.replace(/\D/g, "");
                                setMpesaPhone(value.slice(0, 9));
                            }}
                            placeholder="712345678"
                            maxLength={9}
                            inputMode="numeric"
                            className="w-full rounded-2xl border border-border bg-card pl-16 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    {mpesaPhone && mpesaPhone.length !== 9 && (
                        <p className="text-xs text-red-500">
                            Phone number must be exactly 9 digits
                        </p>
                    )}
                    <p className="text-xs rounded-full bg-primary-soft text-primary-deep px-3 py-1.5 inline-block">
                        Buy Goods · Till 747736 · Recro Group Limited
                    </p>
                    <button
                        onClick={triggerStk}
                        disabled={busy || mpesaPhone.length !== 9}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {busy ? (
                            <>
                                <Loader2 size={15} className="animate-spin" /> Sending STK…
                            </>
                        ) : (
                            <>
                                <CreditCard size={15} /> Sponsor now
                            </>
                        )}
                    </button>
                </div>
            )}

            {method === "card" && (
                <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed">
                        You'll be redirected to Pesapal's secure hosted checkout to enter
                        card details. Card information never touches our servers.
                    </div>
                    <button
                        onClick={triggerCard}
                        disabled={busy}
                        className="btn-primary disabled:opacity-50"
                    >
                        {busy ? (
                            <>
                                <Loader2 size={15} className="animate-spin" /> Redirecting…
                            </>
                        ) : (
                            <>
                                <CreditCard size={15} /> Continue to secure checkout
                            </>
                        )}
                    </button>
                </div>
            )}

            {method === "bank" && (
                <div className="mt-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-primary-soft p-4 text-xs leading-relaxed">
                            <p className="font-semibold text-primary-deep mb-1">
                                Kenya Shilling Account
                            </p>
                            <p>
                                <strong>Bank:</strong> SBM Bank
                            </p>
                            <p>
                                <strong>Account name:</strong> Recro Group Limited
                            </p>
                            <p>
                                <strong>Account number:</strong> 0182074946001
                            </p>
                            <p>
                                <strong>Swift:</strong> CKENKENA
                            </p>
                        </div>
                        <div className="rounded-2xl bg-surface p-4 text-xs leading-relaxed border border-border">
                            <p className="font-semibold text-primary-deep mb-1">
                                USD Account
                            </p>
                            <p>
                                <strong>Bank:</strong> SBM Bank
                            </p>
                            <p>
                                <strong>Account name:</strong> Recro Group Limited
                            </p>
                            <p>
                                <strong>Account number:</strong> 0182074946003
                            </p>
                            <p>
                                <strong>Swift:</strong> SBMKKENA
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Under narration, please indicate <strong>RECRO GRIEF CAMP</strong>.
                    </p>
                    <Field
                        label="Bank reference / slip number"
                        value={bankRef}
                        onChange={setBankRef}
                        placeholder="e.g. TXN20260620-9381"
                    />
                    <label className="block">
                        <span className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                            Proof of payment (PDF or image)
                        </span>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => setProof(e.target.files?.[0] ?? null)}
                            className="mt-2 block w-full text-sm"
                        />
                    </label>
                    <button
                        onClick={submitBank}
                        disabled={busy}
                        className="btn-primary disabled:opacity-50"
                    >
                        {busy ? (
                            <>
                                <Loader2 size={15} className="animate-spin" /> Uploading…
                            </>
                        ) : (
                            <>
                                <Upload size={15} /> Submit for verification
                            </>
                        )}
                    </button>
                </div>
            )}

            <div className="mt-8">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={16} /> Edit details
                </button>
            </div>
        </div>
    );
}

function MethodCard({
    active,
    onClick,
    icon,
    title,
    sub,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    sub: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`text-left rounded-2xl border p-5 transition ${active
                    ? "border-primary ring-1 ring-primary bg-background"
                    : "border-border bg-card hover:border-primary"
                }`}
        >
            <div className="flex items-center gap-2.5 font-semibold">
                {icon} {title}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
        </button>
    );
}

function Field({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled = false,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
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
                className={`mt-2 w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : ""
                    }`}
            />
        </div>
    );
}
