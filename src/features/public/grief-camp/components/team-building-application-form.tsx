"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const STEPS = [
    { id: 1, title: "Personal Information" },
    { id: 2, title: "Application Questions" },
    { id: 3, title: "Health History" },
];

export function TeamBuildingApplicationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // TODO: Implement API call to submit the form
            console.log("Team Building application data:", formData);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting your application. Please try again.");
        }
    };

    const progress = (currentStep / STEPS.length) * 100;

    if (submitted) {
        return (
            <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="rounded-3xl border border-border bg-card p-12 shadow-lg">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
                                <CheckCircle className="h-10 w-10 text-primary-deep" />
                            </div>
                        </div>
                        <h1 className="font-serif text-3xl text-foreground md:text-4xl">
                            Application Submitted!
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Thank you for your interest in team building with Recro Grief Camp.
                            We will review your application and contact you soon.
                        </p>
                        <div className="mt-8">
                            <a href="/grief-camp" className="btn-primary">
                                Return to Grief Camp
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="font-serif text-4xl text-foreground md:text-5xl">
                        Team Builder Application
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        Join our team of volunteers supporting children through grief
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
                <form onSubmit={handleSubmit}>
                    <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
                        {currentStep === 1 && (
                            <PersonalInformationStep data={formData} onChange={handleInputChange} />
                        )}
                        {currentStep === 2 && (
                            <ApplicationQuestionsStep data={formData} onChange={handleInputChange} />
                        )}
                        {currentStep === 3 && (
                            <HealthHistoryStep data={formData} onChange={handleInputChange} />
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft size={16} />
                                Previous
                            </button>

                            {currentStep < STEPS.length ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="btn-primary"
                                >
                                    Next
                                    <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" className="btn-primary">
                                    Submit Application
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </form>

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

// Step 1: Personal Information
function PersonalInformationStep({ data, onChange }: any) {
    return (
        <div className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">Personal Information</h2>
            <p className="text-sm text-muted-foreground">Fields marked with * are required</p>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={data.name || ""}
                        onChange={(e) => onChange("name", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Date of Birth *
                    </label>
                    <input
                        type="date"
                        required
                        value={data.dateOfBirth || ""}
                        onChange={(e) => onChange("dateOfBirth", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        required
                        value={data.email || ""}
                        onChange={(e) => onChange("email", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Home Address
                    </label>
                    <textarea
                        value={data.homeAddress || ""}
                        onChange={(e) => onChange("homeAddress", e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Work Phone
                    </label>
                    <input
                        type="tel"
                        value={data.workPhone || ""}
                        onChange={(e) => onChange("workPhone", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Work Address
                    </label>
                    <input
                        type="text"
                        value={data.workAddress || ""}
                        onChange={(e) => onChange("workAddress", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Place of Employment or University *
                    </label>
                    <input
                        type="text"
                        required
                        value={data.employment || ""}
                        onChange={(e) => onChange("employment", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Educational Background *
                    </label>
                    <input
                        type="text"
                        required
                        value={data.education || ""}
                        onChange={(e) => onChange("education", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        References (2 professional and 1 personal) *
                    </label>
                    <textarea
                        required
                        value={data.references || ""}
                        onChange={(e) => onChange("references", e.target.value)}
                        rows={4}
                        placeholder="Include names, relationship, and contact information"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        In Case of Emergency Please Contact (3 names and phone numbers) *
                    </label>
                    <textarea
                        required
                        value={data.emergencyContacts || ""}
                        onChange={(e) => onChange("emergencyContacts", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        I authorize and consent to medical treatment in case of emergency *
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                required
                                name="medicalConsent"
                                value="yes"
                                checked={data.medicalConsent === "yes"}
                                onChange={(e) => onChange("medicalConsent", e.target.value)}
                                className="text-primary-deep"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                required
                                name="medicalConsent"
                                value="no"
                                checked={data.medicalConsent === "no"}
                                onChange={(e) => onChange("medicalConsent", e.target.value)}
                                className="text-primary-deep"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Step 2: Application Questions
function ApplicationQuestionsStep({ data, onChange }: any) {
    return (
        <div className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">Application Questions</h2>
            <p className="text-sm text-muted-foreground">
                We ask volunteers to commit to a one-day training session.
            </p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        1. Write about your philosophy of children *
                    </label>
                    <textarea
                        required
                        value={data.philosophyOfChildren || ""}
                        onChange={(e) => onChange("philosophyOfChildren", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        2. Describe experience(s) you've had working with children *
                    </label>
                    <textarea
                        required
                        value={data.experienceWithChildren || ""}
                        onChange={(e) => onChange("experienceWithChildren", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        3. Describe how you set limits or discipline children *
                    </label>
                    <textarea
                        required
                        value={data.disciplineApproach || ""}
                        onChange={(e) => onChange("disciplineApproach", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        4. What contribution can you make to the children at Recro Grief Camp? *
                    </label>
                    <textarea
                        required
                        value={data.contribution || ""}
                        onChange={(e) => onChange("contribution", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        5. Describe what you feel your responsibilities as a team builder would include *
                    </label>
                    <textarea
                        required
                        value={data.responsibilities || ""}
                        onChange={(e) => onChange("responsibilities", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        6. Why are you interested in participating as a Recro Grief Camp team builder? *
                    </label>
                    <textarea
                        required
                        value={data.interest || ""}
                        onChange={(e) => onChange("interest", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        7. Describe any previous experience as a camp team builder or related activities *
                    </label>
                    <textarea
                        required
                        value={data.previousExperience || ""}
                        onChange={(e) => onChange("previousExperience", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        8. Additional information you wish to share (optional)
                    </label>
                    <textarea
                        value={data.additionalInfo || ""}
                        onChange={(e) => onChange("additionalInfo", e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>
            </div>
        </div>
    );
}

// Step 3: Health History
function HealthHistoryStep({ data, onChange }: any) {
    return (
        <div className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">Health History</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Family Physician & Contact Details
                    </label>
                    <input
                        type="text"
                        value={data.physicianContact || ""}
                        onChange={(e) => onChange("physicianContact", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        List any allergies or illnesses and explain *
                    </label>
                    <textarea
                        required
                        value={data.allergies || ""}
                        onChange={(e) => onChange("allergies", e.target.value)}
                        rows={3}
                        placeholder="Enter 'None' if not applicable"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Any recent surgery, injury, or illness? *
                    </label>
                    <div className="flex gap-4 mb-3">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                required
                                name="recentSurgery"
                                value="yes"
                                checked={data.recentSurgery === "yes"}
                                onChange={(e) => onChange("recentSurgery", e.target.value)}
                                className="text-primary-deep"
                            />
                            <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                required
                                name="recentSurgery"
                                value="no"
                                checked={data.recentSurgery === "no"}
                                onChange={(e) => onChange("recentSurgery", e.target.value)}
                                className="text-primary-deep"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>

                    {data.recentSurgery === "yes" && (
                        <textarea
                            required
                            value={data.surgeryDetails || ""}
                            onChange={(e) => onChange("surgeryDetails", e.target.value)}
                            rows={3}
                            placeholder="Please explain"
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Are you currently taking any medication? If yes, please list and explain *
                    </label>
                    <textarea
                        required
                        value={data.medications || ""}
                        onChange={(e) => onChange("medications", e.target.value)}
                        rows={3}
                        placeholder="Enter 'None' if not applicable"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
