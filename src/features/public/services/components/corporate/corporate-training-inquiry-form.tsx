"use client";

import { useState, useTransition } from "react";
import { ArrowRight, CheckCircle, Calendar, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { submitInquiry } from "@/server/actions/inquiry";
import {
    formatInquiryMessage,
    truncateSubject,
} from "@/features/public/shared/inquiry-message";

type CorporateInquiryData = {
    organizationName: string;
    contactName: string;
    email: string;
    phone: string;
    topic: string;
    trainingDate: string;
    numberOfPeople: string;
    additionalInfo: string;
};

const FIELD_FOR_INQUIRY_KEY: Record<string, keyof CorporateInquiryData> = {
    name: "contactName",
    email: "email",
    phone: "phone",
    message: "topic",
    subject: "organizationName",
};

export function CorporateTrainingInquiryForm() {
    const [formData, setFormData] = useState<CorporateInquiryData>({
        organizationName: "",
        contactName: "",
        email: "",
        phone: "",
        topic: "",
        trainingDate: "",
        numberOfPeople: "",
        additionalInfo: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof CorporateInquiryData, string>>>({});
    const [isPending, startTransition] = useTransition();

    const handleInputChange = (field: keyof CorporateInquiryData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPending) return;

        setErrors({});

        startTransition(async () => {
            const result = await submitInquiry({
                type: "CORPORATE",
                name: formData.contactName,
                email: formData.email,
                phone: formData.phone || undefined,
                subject: truncateSubject(
                    `Corporate training — ${formData.organizationName}`,
                ),
                message: formatInquiryMessage([
                    {
                        heading: "Organization",
                        fields: [
                            ["Organization", formData.organizationName],
                            ["Contact person", formData.contactName],
                            ["Email", formData.email],
                            ["Phone", formData.phone],
                        ],
                    },
                    {
                        heading: "Training details",
                        fields: [
                            ["Requested topic", formData.topic],
                            ["Preferred date", formData.trainingDate],
                            ["Number of people", formData.numberOfPeople],
                            ["Additional information", formData.additionalInfo],
                        ],
                    },
                ]),
            });

            if (!result.ok) {
                if (result.fieldErrors) {
                    const mapped: Partial<Record<keyof CorporateInquiryData, string>> = {};
                    for (const [key, messages] of Object.entries(result.fieldErrors)) {
                        const field = FIELD_FOR_INQUIRY_KEY[key];
                        if (field && messages[0]) mapped[field] = messages[0];
                    }
                    setErrors(mapped);
                }
                toast.error(result.error);
                return;
            }

            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
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
                            Thank You for Your Inquiry!
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We&apos;ve received your corporate training request.
                        </p>
                        <div className="mt-6 rounded-2xl bg-primary-soft/30 p-6 border border-primary/20">
                            <p className="text-base font-semibold text-foreground">
                                We will contact you shortly
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Our team will review your request and reach out within 1-2 business days to discuss your training needs and customize a solution for your organization.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/services/corporate" className="btn-primary">
                                Back to Corporate Services
                            </Link>
                            <Link href="/services" className="btn-secondary">
                                Explore All Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="font-serif text-4xl text-foreground md:text-5xl">
                        Corporate Training Inquiry
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Tell us about your training needs and we&apos;ll create a customized program for your organization
                    </p>
                </div>

                {/* Info Cards */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                            <MessageSquare className="h-5 w-5 text-primary-deep" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Step 1
                            </p>
                            <p className="text-sm font-medium text-foreground">Share your needs</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                            <Calendar className="h-5 w-5 text-primary-deep" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Step 2
                            </p>
                            <p className="text-sm font-medium text-foreground">We&apos;ll contact you</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                            <Users className="h-5 w-5 text-primary-deep" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Step 3
                            </p>
                            <p className="text-sm font-medium text-foreground">Customized solution</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
                        <div className="space-y-6">
                            {/* Organization Information */}
                            <div>
                                <h2 className="font-serif text-xl text-foreground mb-4">
                                    Organization Information
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Organization Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.organizationName}
                                            onChange={(e) => handleInputChange("organizationName", e.target.value)}
                                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        />
                                        {errors.organizationName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Contact Person Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.contactName}
                                            onChange={(e) => handleInputChange("contactName", e.target.value)}
                                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        />
                                        {errors.contactName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.contactName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Training Details */}
                            <div className="pt-6 border-t border-border">
                                <h2 className="font-serif text-xl text-foreground mb-4">
                                    Training Details
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            What topic would you like for your organization? *
                                        </label>
                                        <textarea
                                            required
                                            value={formData.topic}
                                            onChange={(e) => handleInputChange("topic", e.target.value)}
                                            rows={4}
                                            placeholder="E.g., Stress management, Team building, Mental health awareness, Leadership development, Work-life balance..."
                                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        />
                                        {errors.topic && (
                                            <p className="mt-1 text-sm text-red-500">{errors.topic}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                When do you need the training? *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.trainingDate}
                                                onChange={(e) => handleInputChange("trainingDate", e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Number of people *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={formData.numberOfPeople}
                                                onChange={(e) => handleInputChange("numberOfPeople", e.target.value)}
                                                placeholder="E.g., 20"
                                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Additional Information (Optional)
                                        </label>
                                        <textarea
                                            value={formData.additionalInfo}
                                            onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                                            rows={3}
                                            placeholder="Any specific requirements, goals, or questions you'd like to share..."
                                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Submitting..." : "Submit Inquiry"}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </form>

                {/* Help Text */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Need immediate assistance? Contact us at{" "}
                        <a
                            href="mailto:info@recrogroup.com"
                            className="text-primary-deep hover:underline font-medium"
                        >
                            info@recrogroup.com
                        </a>{" "}
                        or call{" "}
                        <a
                            href="tel:0717787807"
                            className="text-primary-deep hover:underline font-medium"
                        >
                            0717-78-78-07
                        </a>{" "}
                        /{" "}
                        <a
                            href="tel:0717787808"
                            className="text-primary-deep hover:underline font-medium"
                        >
                            0717-78-78-08
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
