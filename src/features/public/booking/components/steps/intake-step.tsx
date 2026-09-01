"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Field } from "../booking-form-controls";

export function IntakeStep({
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPhone,
    setClientPhone,
    notes,
    setNotes,
    onBack,
    onNext,
}: {
    clientName: string;
    setClientName: (v: string) => void;
    clientEmail: string;
    setClientEmail: (v: string) => void;
    clientPhone: string;
    setClientPhone: (v: string) => void;
    notes: string;
    setNotes: (v: string) => void;
    onBack: () => void;
    onNext: () => void;
}) {
    return (
        <div className="space-y-6">
            <div className="bg-background rounded-2xl border-2 border-border p-7 md:p-9 shadow-sm">
                <div className="space-y-4">
                    <Field
                        label="Full name *"
                        value={clientName}
                        onChange={setClientName}
                        placeholder="Jane Doe"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                            label="Email *"
                            type="email"
                            value={clientEmail}
                            onChange={setClientEmail}
                            placeholder="jane@example.com"
                        />
                        <Field
                            label="Phone"
                            value={clientPhone}
                            onChange={setClientPhone}
                            placeholder="+254 7XX XXX XXX"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                            What brings you here? (optional)
                        </label>
                        <textarea
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Share anything you'd like your therapist to know before your first session..."
                            className="mt-2 w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!clientName.trim() || !clientEmail.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Payment <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

