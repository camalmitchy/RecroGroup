"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { submitInquiry } from "@/server/actions/inquiry";
import {
    formatInquiryMessage,
    truncateSubject,
} from "@/features/public/shared/inquiry-message";
import { PersonalInformationStep } from "./steps/personal-information-step";
import { ApplicationQuestionsStep } from "./steps/application-questions-step";
import { HealthHistoryStep } from "./steps/health-history-step";
import type { FacilitatorApplicationData } from "../../types/facilitator-types";

const STEPS = [
    { id: 1, title: "Personal Information", component: PersonalInformationStep },
    { id: 2, title: "Application Questions", component: ApplicationQuestionsStep },
    { id: 3, title: "Health History", component: HealthHistoryStep },
];

const EMAIL_PATTERN = /[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+/;
const PHONE_PATTERN = /\+?[\d][\d\s()-]{6,}/;

export function FacilitatorApplicationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<FacilitatorApplicationData>>({});
    const [submitted, setSubmitted] = useState(false);

    const CurrentStepComponent = STEPS[currentStep - 1].component;

    const handleNext = (stepData: Partial<FacilitatorApplicationData>) => {
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

    const handleSubmit = async (stepData: Partial<FacilitatorApplicationData>) => {
        const personal = formData.personalInformation;
        const questions = formData.applicationQuestions;
        const health = stepData.healthHistory ?? formData.healthHistory;

        if (!personal || !questions || !health) {
            toast.error("Please complete all three steps before submitting");
            return;
        }

        const contact = personal.emailAndPhone;
        const email = EMAIL_PATTERN.exec(contact)?.[0];
        if (!email) {
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.error("We couldn't find an email address", {
                description:
                    "Please include a valid email address in the Email and Phone Numbers field.",
            });
            return;
        }

        const phone = PHONE_PATTERN.exec(contact.replace(email, ""))?.[0].trim();
        const role = questions.applicationType || "Applicant";

        const result = await submitInquiry({
            type: "CORPORATE",
            name: personal.name,
            email,
            phone: phone && phone.length >= 7 ? phone : undefined,
            subject: truncateSubject(`${role} application — ${personal.name}`),
            message: formatInquiryMessage([
                {
                    heading: "Personal information",
                    fields: [
                        ["Name", personal.name],
                        ["Date of birth", personal.dateOfBirth],
                        ["Email and phone", contact],
                        ["Work address and phone", personal.workAddress],
                        ["Place of employment or university", personal.placeOfEmployment],
                        ["Educational background", personal.educationalBackground],
                        ["References", personal.references],
                        ["Emergency contacts", personal.emergencyContacts],
                    ],
                },
                {
                    heading: "Application questions",
                    fields: [
                        ["Applying as", questions.applicationType],
                        ["Consent to emergency medical treatment", questions.consent],
                        ["Consent date", questions.consentDate],
                        ["1. Philosophy of children", questions.philosophyOfChildren],
                        ["2. Experience working with children", questions.experienceWithChildren],
                        ["3. Setting limits and discipline", questions.disciplineApproach],
                        ["4. Contribution to the camp", questions.contributionToCamp],
                        ["5. Responsibilities in the role", questions.responsibilitiesDescription],
                        ["6. Reason for interest", questions.reasonForInterest],
                        ["7. Previous experience", questions.previousExperience],
                        ["8. Additional information", questions.additionalInformation],
                        ["9. Groups facilitated", questions.groupsFacilitated],
                        ["10. Capacity worked with children", questions.therapistCapacity],
                    ],
                },
                {
                    heading: "Health history",
                    fields: [
                        ["Name and date", health.nameAndDate],
                        ["Family physician", health.familyPhysician],
                        ["Allergies or illnesses", health.allergiesOrIllnesses],
                        ["Recent surgery, injury or illness", health.recentSurgeryInjuryIllness],
                        ["Surgery details", health.surgeryDetails],
                        ["Current medication", health.currentMedication],
                    ],
                },
            ]),
        });

        if (!result.ok) {
            const detail = result.fieldErrors
                ? Object.values(result.fieldErrors)
                    .map((messages) => messages[0])
                    .filter(Boolean)
                    .join("; ")
                : null;
            toast.error(result.error, detail ? { description: detail } : undefined);
            return;
        }

        setFormData((prev) => ({ ...prev, ...stepData }));
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-3xl border border-border bg-card p-12 shadow-lg text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
                                <CheckCircle className="h-10 w-10 text-primary-deep" />
                            </div>
                        </div>
                        <h1 className="font-serif text-3xl text-foreground md:text-4xl">
                            Application Submitted!
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Thank you for applying. Our team will review your application and
                            contact you regarding the next steps.
                        </p>
                        <div className="mt-8">
                            <Link href="/services" className="btn-primary">
                                Explore All Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
