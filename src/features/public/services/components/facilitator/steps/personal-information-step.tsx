"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { PersonalInformationData } from "../../../types/facilitator-types";

interface PersonalInformationStepProps {
    data: any;
    onNext: (data: { personalInformation: PersonalInformationData }) => void;
}

export function PersonalInformationStep({
    data,
    onNext,
}: PersonalInformationStepProps) {
    const [formData, setFormData] = useState<PersonalInformationData>(
        data.personalInformation || {
            name: "",
            dateOfBirth: "",
            emailAndPhone: "",
            workAddress: "",
            placeOfEmployment: "",
            educationalBackground: "",
            references: "",
            emergencyContacts: "",
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required";
        }
        if (!formData.emailAndPhone.trim()) {
            newErrors.emailAndPhone = "Email and phone number are required";
        }
        if (!formData.placeOfEmployment.trim()) {
            newErrors.placeOfEmployment = "Place of employment or university is required";
        }
        if (!formData.educationalBackground.trim()) {
            newErrors.educationalBackground = "Educational background is required";
        }
        if (!formData.references.trim()) {
            newErrors.references = "References are required";
        }
        if (!formData.emergencyContacts.trim()) {
            newErrors.emergencyContacts = "Emergency contacts are required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext({ personalInformation: formData });
        }
    };

    const handleChange = (field: keyof PersonalInformationData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Page 1 of 3: Personal Information
                </h2>
                <p className="text-sm text-muted-foreground">
                    Fields marked with * are required
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Name *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Full Name"
                    className={`w-full rounded-lg border ${errors.name ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Date of Birth *
                </label>
                <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    className={`w-full rounded-lg border ${errors.dateOfBirth ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Email and Phone Numbers *
                </label>
                <textarea
                    value={formData.emailAndPhone}
                    onChange={(e) => handleChange("emailAndPhone", e.target.value)}
                    placeholder="Email: example@email.com&#10;Phone: +254 XXX XXX XXX"
                    rows={3}
                    className={`w-full rounded-lg border ${errors.emailAndPhone ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.emailAndPhone && (
                    <p className="mt-1 text-sm text-red-500">{errors.emailAndPhone}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Work Address & Work Phone
                </label>
                <textarea
                    value={formData.workAddress || ""}
                    onChange={(e) => handleChange("workAddress", e.target.value)}
                    placeholder="Work address and phone number"
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Place of Employment or University *
                </label>
                <input
                    type="text"
                    value={formData.placeOfEmployment}
                    onChange={(e) => handleChange("placeOfEmployment", e.target.value)}
                    className={`w-full rounded-lg border ${errors.placeOfEmployment ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.placeOfEmployment && (
                    <p className="mt-1 text-sm text-red-500">{errors.placeOfEmployment}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Educational Background *
                </label>
                <textarea
                    value={formData.educationalBackground}
                    onChange={(e) => handleChange("educationalBackground", e.target.value)}
                    placeholder="Describe your educational qualifications, degrees, certifications..."
                    rows={4}
                    className={`w-full rounded-lg border ${errors.educationalBackground ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.educationalBackground && (
                    <p className="mt-1 text-sm text-red-500">{errors.educationalBackground}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    References *
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                    Please include two professional and one personal reference
                </p>
                <textarea
                    value={formData.references}
                    onChange={(e) => handleChange("references", e.target.value)}
                    placeholder="Reference 1: Name, Relationship, Phone/Email&#10;Reference 2: Name, Relationship, Phone/Email&#10;Reference 3: Name, Relationship, Phone/Email"
                    rows={6}
                    className={`w-full rounded-lg border ${errors.references ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.references && (
                    <p className="mt-1 text-sm text-red-500">{errors.references}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    In Case of Emergency, Please Contact: *
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                    Include 3 contact names and phone numbers
                </p>
                <textarea
                    value={formData.emergencyContacts}
                    onChange={(e) => handleChange("emergencyContacts", e.target.value)}
                    placeholder="Emergency Contact 1: Name, Phone&#10;Emergency Contact 2: Name, Phone&#10;Emergency Contact 3: Name, Phone"
                    rows={5}
                    className={`w-full rounded-lg border ${errors.emergencyContacts ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.emergencyContacts && (
                    <p className="mt-1 text-sm text-red-500">{errors.emergencyContacts}</p>
                )}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-primary-deep px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
                >
                    Next Step
                    <ChevronRight className="size-4" />
                </button>
            </div>
        </form>
    );
}
