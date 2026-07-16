"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { ParentQuestionnaireData } from "../../../types";

interface ParentQuestionnaireStepProps {
    data: any;
    onNext: (data: { parentQuestionnaire: ParentQuestionnaireData }) => void;
}

export function ParentQuestionnaireStep({
    data,
    onNext,
}: ParentQuestionnaireStepProps) {
    const [formData, setFormData] = useState<ParentQuestionnaireData>(
        data.parentQuestionnaire || {
            childName: "",
            gender: "Male",
            dateOfBirth: "",
            religiousAffiliation: "",
            dateOfDeath: "",
            parentName: "",
            parentEmail: "",
            relationshipToChild: "",
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.childName.trim()) {
            newErrors.childName = "Child's name is required";
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required";
        }
        if (!formData.dateOfDeath) {
            newErrors.dateOfDeath = "Date of death is required";
        }
        if (!formData.parentName.trim()) {
            newErrors.parentName = "Your name is required";
        }
        if (!formData.parentEmail.trim()) {
            newErrors.parentEmail = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
            newErrors.parentEmail = "Please enter a valid email";
        }
        if (!formData.relationshipToChild.trim()) {
            newErrors.relationshipToChild = "Relationship to child is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext({ parentQuestionnaire: formData });
        }
    };

    const handleChange = (field: keyof ParentQuestionnaireData, value: string) => {
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
                    Section 1: Parent Questionnaire
                </h2>
                <p className="text-sm text-muted-foreground">
                    Fields marked with * are required
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Child's Name *
                </label>
                <input
                    type="text"
                    value={formData.childName}
                    onChange={(e) => handleChange("childName", e.target.value)}
                    className={`w-full rounded-lg border ${errors.childName ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.childName && (
                    <p className="mt-1 text-sm text-red-500">{errors.childName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Gender *
                </label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={(e) => handleChange("gender", e.target.value)}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={(e) => handleChange("gender", e.target.value)}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">Female</span>
                    </label>
                </div>
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
                    Religious Affiliation
                </label>
                <input
                    type="text"
                    value={formData.religiousAffiliation || ""}
                    onChange={(e) => handleChange("religiousAffiliation", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Date of the Sibling's or Parent's Death *
                </label>
                <input
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={(e) => handleChange("dateOfDeath", e.target.value)}
                    className={`w-full rounded-lg border ${errors.dateOfDeath ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.dateOfDeath && (
                    <p className="mt-1 text-sm text-red-500">{errors.dateOfDeath}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name *
                </label>
                <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => handleChange("parentName", e.target.value)}
                    className={`w-full rounded-lg border ${errors.parentName ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.parentName && (
                    <p className="mt-1 text-sm text-red-500">{errors.parentName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Your Email *
                </label>
                <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => handleChange("parentEmail", e.target.value)}
                    className={`w-full rounded-lg border ${errors.parentEmail ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.parentEmail && (
                    <p className="mt-1 text-sm text-red-500">{errors.parentEmail}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Relationship to Child *
                </label>
                <input
                    type="text"
                    value={formData.relationshipToChild}
                    onChange={(e) => handleChange("relationshipToChild", e.target.value)}
                    placeholder="e.g., Mother, Father, Guardian"
                    className={`w-full rounded-lg border ${errors.relationshipToChild ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.relationshipToChild && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.relationshipToChild}
                    </p>
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
