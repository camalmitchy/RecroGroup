"use client";

import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";

interface PaymentStepProps {
    data: any;
    onPrevious: () => void;
    onSubmit: (data: any) => void;
}

export function PaymentStep({ data, onPrevious, onSubmit }: PaymentStepProps) {
    const [mpesaCode, setMpesaCode] = useState(data.payment?.mpesaPaymentCode || "");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!mpesaCode.trim()) {
            setError("M-Pesa payment code is required");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ payment: { mpesaPaymentCode: mpesaCode } });
        } finally {
            setIsSubmitting(false);
        }
    };

    const attendingParentSession = data.consent?.attendingParentSession;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Section 7: Payment
                </h2>
                <p className="text-sm text-muted-foreground">
                    Complete your payment and submit your application
                </p>
            </div>

            {/* Camp Fee Information */}
            <div className="rounded-lg border border-border bg-muted/30 p-6">
                <h3 className="font-serif text-lg text-foreground mb-4">
                    2026 Camp Particulars & Camp Fee
                </h3>

                <div className="space-y-6">
                    {/* Camper Fee */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Fee: For Campers
                        </p>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-center justify-between">
                                <span>Mega deal by Aug 31st</span>
                                <span className="font-semibold">KES 30,000/-</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Early price after September 1st</span>
                                <span className="font-semibold">KES 32,000/-</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Regular price after October 30th</span>
                                <span className="font-semibold">KES 34,000/-</span>
                            </li>
                        </ul>
                    </div>

                    {/* Parent Fee */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Fee: For Parents
                        </p>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-center justify-between">
                                <span>Mega deal by Aug 31st</span>
                                <span className="font-semibold">KES 2,500/-</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Early price after September 2nd</span>
                                <span className="font-semibold">KES 4,500/-</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Regular price after October 30th</span>
                                <span className="font-semibold">KES 6,500/-</span>
                            </li>
                        </ul>
                    </div>

                    {/* Camp Details */}
                    <div className="border-t border-border pt-4">
                        <p className="text-sm text-foreground mb-2">
                            <span className="font-medium">Camp Date:</span> December 13th–15th, 2024
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Parents' session will be Friday morning only
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Summary */}
            {attendingParentSession !== undefined && (
                <div className="rounded-lg border border-primary-deep/20 bg-primary-soft p-6">
                    <h3 className="font-medium text-foreground mb-3">Your Selection</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Check className="size-4 text-primary-deep" />
                            <span className="text-foreground">Camper registration</span>
                        </li>
                        {attendingParentSession && (
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary-deep" />
                                <span className="text-foreground">Parent session attendance</span>
                            </li>
                        )}
                    </ul>
                    <p className="mt-4 text-xs text-muted-foreground">
                        Please ensure you pay the correct amount based on the pricing tier and your selections.
                    </p>
                </div>
            )}

            {/* M-Pesa Payment Instructions */}
            <div className="rounded-lg border border-border bg-background p-6">
                <h3 className="font-medium text-foreground mb-4">Payment Instructions</h3>

                <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                        <p className="font-medium text-foreground mb-2">M-PESA: Buy Goods and Services</p>
                        <div className="flex items-center gap-3">
                            <span>Till Number:</span>
                            <span className="rounded-lg bg-muted px-4 py-2 font-mono text-lg font-semibold text-foreground">
                                747736
                            </span>
                        </div>
                    </div>

                    <ol className="list-decimal list-inside space-y-2">
                        <li>Go to M-PESA on your phone</li>
                        <li>Select "Buy Goods and Services"</li>
                        <li>Enter Till Number: <strong>747736</strong></li>
                        <li>Enter the amount based on the pricing above</li>
                        <li>Enter your M-PESA PIN and confirm</li>
                        <li>You will receive a confirmation message with a code</li>
                        <li>Enter that M-PESA payment code below</li>
                    </ol>
                </div>
            </div>

            {/* M-Pesa Code Input */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    M-Pesa Payment Code *
                </label>
                <input
                    type="text"
                    value={mpesaCode}
                    onChange={(e) => {
                        setMpesaCode(e.target.value);
                        setError("");
                    }}
                    placeholder="e.g., QA12B3C4D5"
                    className={`w-full rounded-lg border ${error ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 font-mono text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                <p className="mt-2 text-xs text-muted-foreground">
                    Enter the M-PESA confirmation code you received after making the payment
                </p>
            </div>

            {/* Important Note */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-50 p-4 dark:bg-amber-950/20">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>Important:</strong> Please ensure you have completed the M-PESA payment before submitting this form. Your application will be processed once we verify your payment.
                </p>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-transparent px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-full bg-primary-deep px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep/90 disabled:opacity-50"
                >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    <Check className="size-4" />
                </button>
            </div>
        </form>
    );
}
