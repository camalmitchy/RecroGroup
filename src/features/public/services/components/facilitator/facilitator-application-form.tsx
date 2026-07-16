"use client";

import { useState } from "react";
import { PersonalInformationStep } from "./steps/personal-information-step";
import { ApplicationQuestionsStep } from "./steps/application-questions-step";
import { HealthHistoryStep } from "./steps/health-history-step";
import type { FacilitatorApplicationData } from "../../types/facilitator-types";

const STEPS = [
    { id: 1, title: "Personal Information", component: PersonalInformationStep },
    { id: 2, title: "Application Questions", component: ApplicationQuestionsStep },
    { id: 3, title: "Health History", component: HealthHistoryStep },
];

export function FacilitatorApplicationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<FacilitatorApplicationData>>({});

    const CurrentStepComponent = STEPS[currentStep - 1].component;

    const handleNext = (stepData: any) => {
        setFormData((prev) => ({ ...prev, ...stepData }));
        if (currentStep < STEPS.length) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleSubmit = async (stepData: any) => {
        const finalData = { ...formData, ...stepData };

        try {
            // TODO: Implement API call to submit the form
            console.log("Final facilitator application data:", finalData);

            // For now, show success message
            alert("Application submitted successfully! We will contact you soon.");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting your application. Please try again.");
        }
    };

    const progress = (currentStep / STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="font-serif text-4xl text-foreground md:text-5xl">
                        Therapist / Group Facilitator Application
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        Join our team of professionals supporting children and families through grief
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                            Step {currentStep} of {STEPS.length}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {STEPS[currentStep - 1].title}
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-primary-deep transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step Navigation Dots */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    {STEPS.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                            disabled={step.id > currentStep}
                            className={`h-2 rounded-full transition-all ${step.id === currentStep
                                    ? "w-8 bg-primary-deep"
                                    : step.id < currentStep
                                        ? "w-2 cursor-pointer bg-primary-deep/60 hover:bg-primary-deep/80"
                                        : "w-2 bg-muted-foreground/30"
                                }`}
                            title={step.title}
                        />
                    ))}
                </div>

                {/* Form Content */}
                <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
                    <CurrentStepComponent
                        data={formData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        onSubmit={handleSubmit}
                    />
                </div>

                {/* Help Text */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Need help? Contact us at{" "}
                        <a
                            href="mailto:info@recrogroup.com"
                            className="text-primary-deep hover:underline"
                        >
                            info@recrogroup.com
                        </a>{" "}
                        or call 0717-78-78-07 / 0717-78-78-08
                    </p>
                </div>
            </div>
        </div>
    );
}
