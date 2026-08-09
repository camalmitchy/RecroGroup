"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { submitGriefApplication } from "@/server/actions/grief-camp";
import type { PaymentMethod } from "@/features/public/shared/use-payment-checkout";
import { usePaymentCheckout } from "@/features/public/shared/use-payment-checkout";
import { ParentQuestionnaireStep } from "./steps/parent-questionnaire-step";
import { CamperSelfReportStep } from "./steps/camper-self-report-step";
import { OtherLossesStep } from "./steps/other-losses-step";
import { ParentSelfReportStep } from "./steps/parent-self-report-step";
import { RegistrationStep } from "./steps/registration-step";
import { HealthHistoryStep } from "./steps/health-history-step";
import { ConsentStep } from "./steps/consent-step";
import { PaymentStep } from "./steps/payment-step";
import type { CampPricing, GriefCampApplicationData } from "../../types";

const STEPS = [
    { id: 1, title: "Parent Questionnaire", component: ParentQuestionnaireStep },
    { id: 2, title: "Camper Self Report", component: CamperSelfReportStep },
    { id: 3, title: "Other Losses", component: OtherLossesStep },
    { id: 4, title: "Parent Self Report", component: ParentSelfReportStep },
    { id: 5, title: "Registration", component: RegistrationStep },
    { id: 6, title: "Health History", component: HealthHistoryStep },
    { id: 7, title: "Consent & Release", component: ConsentStep },
];

const PAYMENT_STEP = STEPS.length + 1;
const TOTAL_STEPS = PAYMENT_STEP;

export function GriefCampApplicationForm({ pricing }: { pricing: CampPricing }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<GriefCampApplicationData>>({});
    const checkout = usePaymentCheckout();

    // The application is persisted once; a payment retry reuses the same record.
    const applicationIdRef = useRef<string | null>(null);

    const handleNext = (stepData: Partial<GriefCampApplicationData>) => {
        setFormData((prev) => ({ ...prev, ...stepData }));
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            checkout.stopPolling();
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePay = async ({
        method,
        phone,
    }: {
        method: PaymentMethod;
        phone: string;
    }) => {
        const consent = formData.consent;
        if (!consent?.releaseConsent || !consent.medicalConsent) {
            toast.error("Please complete the consent step before paying");
            return { ok: false, error: "Consent is incomplete" };
        }

        if (!applicationIdRef.current) {
            const result = await submitGriefApplication({
                parentQuestionnaire: formData.parentQuestionnaire!,
                camperSelfReport: formData.camperSelfReport!,
                otherLosses: formData.otherLosses,
                parentSelfReport: formData.parentSelfReport,
                registration: formData.registration!,
                healthHistory: formData.healthHistory!,
                consent: {
                    ...consent,
                    releaseConsent: true,
                    medicalConsent: true,
                },
                parentPhone: phone || undefined,
                campSessionId: pricing.campSessionId,
            });

            if (!result.ok) {
                const detail = result.fieldErrors
                    ? Object.entries(result.fieldErrors)
                        .slice(0, 3)
                        .map(([field, messages]) => `${field}: ${messages[0]}`)
                        .join("; ")
                    : null;
                toast.error(result.error, detail ? { description: detail } : undefined);
                return { ok: false, error: result.error };
            }

            applicationIdRef.current = result.data.applicationId;
        }

        const started = await checkout.start({
            method,
            target: { griefApplicationId: applicationIdRef.current },
            phone: method === "MPESA" ? phone : undefined,
            email: formData.parentQuestionnaire?.parentEmail,
            name: formData.parentQuestionnaire?.parentName,
        });

        if (!started.ok) {
            if (started.error) toast.error(started.error);
            return { ok: false, error: started.error ?? undefined };
        }

        return { ok: true };
    };

    const progress = (currentStep / TOTAL_STEPS) * 100;
    const stepTitle =
        currentStep === PAYMENT_STEP ? "Payment" : STEPS[currentStep - 1].title;
    const CurrentStepComponent =
        currentStep === PAYMENT_STEP ? null : STEPS[currentStep - 1].component;

    return (
        <div className="min-h-screen bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="font-serif text-4xl text-foreground md:text-5xl">
                        Grief Camp Application
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        {pricing.campName} · {pricing.dateRange}
                    </p>
                </div>

                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                            Step {currentStep} of {TOTAL_STEPS}
                        </span>
                        <span className="text-sm text-muted-foreground">{stepTitle}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-primary-deep transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="mb-8 flex items-center justify-center gap-2">
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((id) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                if (id < currentStep) {
                                    checkout.stopPolling();
                                    setCurrentStep(id);
                                }
                            }}
                            disabled={id > currentStep}
                            className={`h-2 rounded-full transition-all ${id === currentStep
                                ? "w-8 bg-primary-deep"
                                : id < currentStep
                                    ? "w-2 cursor-pointer bg-primary-deep/60 hover:bg-primary-deep/80"
                                    : "w-2 bg-muted-foreground/30"
                                }`}
                            title={id === PAYMENT_STEP ? "Payment" : STEPS[id - 1].title}
                        />
                    ))}
                </div>

                <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
                    {CurrentStepComponent ? (
                        <CurrentStepComponent
                            data={formData}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    ) : (
                        <PaymentStep
                            data={formData}
                            pricing={pricing}
                            checkout={checkout}
                            onPrevious={handlePrevious}
                            onSubmit={handlePay}
                        />
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Need help? Contact us at{" "}
                        <a
                            href="mailto:info@recrogroup.com"
                            className="text-primary-deep hover:underline"
                        >
                            info@recrogroup.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
