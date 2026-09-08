"use client";

import Image from "next/image";
import {
    Calendar,
    Clock,
    User,
    MapPin,
    CreditCard,
    ArrowLeft,
    Smartphone,
    Building2,
    Loader2,
} from "lucide-react";

import type { ServiceOption } from "../booking-types";
import { Field, MethodCard } from "../booking-form-controls";

export function PaymentStep({
    service,
    date,
    time,
    clientName,
    paymentMethod,
    setPaymentMethod,
    mpesaPhone,
    setMpesaPhone,
    bankRef,
    setBankRef,
    proofFile,
    setProofFile,
    busy,
    onBack,
    onPay,
}: {
    service: ServiceOption;
    date: Date;
    time: string;
    clientName: string;
    paymentMethod: "mpesa" | "card" | "bank";
    setPaymentMethod: (m: "mpesa" | "card" | "bank") => void;
    mpesaPhone: string;
    setMpesaPhone: (v: string) => void;
    bankRef: string;
    setBankRef: (v: string) => void;
    proofFile: File | null;
    setProofFile: (f: File | null) => void;
    busy: boolean;
    onBack: () => void;
    onPay: () => void;
}) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const commitmentFee = Math.round(service.price / 2);
    const balanceDue = service.price - commitmentFee;
    const weekdayLabel = date.toLocaleDateString("en-US", { weekday: "long" });

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 bg-background rounded-2xl border-2 border-border p-7 shadow-sm">
                <h2 className="font-serif text-2xl font-semibold text-primary-deep mb-2">
                    Commitment fee
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    Pay half the session fee now to secure your slot. The remaining
                    balance is paid when you attend your session.
                </p>

                {/* Payment Methods */}
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                        Payment Method
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                        <MethodCard
                            active={paymentMethod === "mpesa"}
                            onClick={() => setPaymentMethod("mpesa")}
                            icon={<Smartphone size={18} />}
                            title="M-Pesa STK"
                            sub="Instant payment"
                        />
                        <MethodCard
                            active={paymentMethod === "card"}
                            onClick={() => setPaymentMethod("card")}
                            icon={<CreditCard size={18} />}
                            title="Visa / Mastercard"
                            sub="Secure checkout"
                        />
                        <MethodCard
                            active={paymentMethod === "bank"}
                            onClick={() => setPaymentMethod("bank")}
                            icon={<Building2 size={18} />}
                            title="Bank Transfer"
                            sub="Upload slip"
                        />
                    </div>

                    {/* M-Pesa Form */}
                    {paymentMethod === "mpesa" && (
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
                        </div>
                    )}

                    {/* Card Form */}
                    {paymentMethod === "card" && (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed">
                                You&apos;ll be redirected to Pesapal&apos;s secure checkout to complete
                                your commitment fee. Card details are never stored on our servers.
                            </div>
                        </div>
                    )}

                    {/* Bank Transfer Form */}
                    {paymentMethod === "bank" && (
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
                                    onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                                    className="mt-2 block w-full text-sm"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button
                        onClick={onPay}
                        disabled={busy}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {busy ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard size={16} /> Pay Ksh{" "}
                                {commitmentFee.toLocaleString()} commitment
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
                <div className="rounded-2xl border-2 border-border bg-background p-6 sticky top-6 shadow-sm">
                    <h3 className="font-serif text-xl font-semibold mb-4">
                        Booking Summary
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                            <Image
                                src={service.icon}
                                alt={service.title}
                                width={32}
                                height={32}
                                className="shrink-0 mt-1"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{service.title}</p>
                                <p className="text-muted-foreground text-xs mt-1">
                                    {service.duration}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar size={14} className="shrink-0" />
                                <span>{formatDate(date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock size={14} className="shrink-0" />
                                <span>{time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin size={14} className="shrink-0" />
                                <span>In-Person</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User size={14} className="shrink-0" />
                                <span>{clientName || "—"}</span>
                            </div>
                        </div>
                        <p className="rounded-xl bg-surface px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                            Permanent slot: every{" "}
                            <strong className="text-foreground">
                                {weekdayLabel} at {time}
                            </strong>{" "}
                            until your sessions finish.
                        </p>
                        <div className="pt-4 border-t border-border space-y-2">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Session fee</span>
                                <span>Ksh {service.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Balance at session</span>
                                <span>Ksh {balanceDue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-border">
                                <span>Due now</span>
                                <span>Ksh {commitmentFee.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

