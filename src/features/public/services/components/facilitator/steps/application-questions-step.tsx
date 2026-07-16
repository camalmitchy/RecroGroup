"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApplicationQuestionsData } from "../../../types/facilitator-types";

interface ApplicationQuestionsStepProps {
    data: any;
    onNext: (data: { applicationQuestions: ApplicationQuestionsData }) => void;
    onPrevious: () => void;
}

export function ApplicationQuestionsStep({
    data,
    onNext,
    onPrevious,
}: ApplicationQuestionsStepProps) {
    const [formData, setFormData] = useState<ApplicationQuestionsData>(
        data.applicationQuestions || {
            consent: false,
            consentDate: "",
            philosophyOfChildren: "",
            experienceWithChildren: "",
            disciplineApproach: "",
            contributionToCamp: "",
            responsibilitiesDescription: "",
            reasonForInterest: "",
            previousExperience: "",
            additionalInformation: "",
            applicationType: "",
            groupsFacilitated: "",
            therapistCapacity: "",
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.consent) {
            newErrors.consent = "You must give consent to proceed";
        }
        if (!formData.consentDate) {
            newErrors.consentDate = "Consent date is required";
        }
        if (!formData.philosophyOfChildren.trim()) {
            newErrors.philosophyOfChildren = "This field is required";
        }
        if (!formData.experienceWithChildren.trim()) {
            newErrors.experienceWithChildren = "This field is required";
        }
        if (!formData.disciplineApproach.trim()) {
            newErrors.disciplineApproach = "This field is required";
        }
        if (!formData.contributionToCamp.trim()) {
            newErrors.contributionToCamp = "This field is required";
        }
        if (!formData.responsibilitiesDescription.trim()) {
            newErrors.responsibilitiesDescription = "This field is required";
        }
        if (!formData.reasonForInterest.trim()) {
            newErrors.reasonForInterest = "This field is required";
        }
        if (!formData.previousExperience.trim()) {
            newErrors.previousExperience = "This field is required";
        }
        if (!formData.additionalInformation.trim()) {
            newErrors.additionalInformation = "This field is required";
        }
        if (formData.applicationType === "Facilitator" && !formData.groupsFacilitated?.trim()) {
            newErrors.groupsFacilitated = "This field is required for group facilitators";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext({ applicationQuestions: formData });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Page 2 of 3: Application Questions
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please answer all questions thoughtfully
                </p>
            </div>

            {/* Medical Emergency Consent */}
            <div className="rounded-lg border border-border bg-muted/30 p-6">
                <p className="text-sm text-foreground mb-4">
                    In the event of an emergency I hereby authorize and consent to any medical or surgical diagnosis/treatment and or hospital service that may be rendered.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.consent}
                                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                className="mt-1 size-4 rounded text-primary-deep focus:ring-primary-deep"
                            />
                            <span className="text-sm font-medium text-foreground">
                                I give consent *
                            </span>
                        </label>
                        {errors.consent && (
                            <p className="mt-1 ml-7 text-sm text-red-500">{errors.consent}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Date *
                        </label>
                        <input
                            type="date"
                            value={formData.consentDate}
                            onChange={(e) => setFormData({ ...formData, consentDate: e.target.value })}
                            className={`w-full max-w-xs rounded-lg border ${errors.consentDate ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                        {errors.consentDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.consentDate}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        1. Write about your philosophy of children. *
                    </label>
                    <textarea
                        value={formData.philosophyOfChildren}
                        onChange={(e) => setFormData({ ...formData, philosophyOfChildren: e.target.value })}
                        rows={4}
                        className={`w-full rounded-lg border ${errors.philosophyOfChildren ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.philosophyOfChildren && (
                        <p className="mt-1 text-sm text-red-500">{errors.philosophyOfChildren}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        2. Describe experience(s) you've had working with children. *
                    </label>
                    <textarea
                        value={formData.experienceWithChildren}
                        onChange={(e) => setFormData({ ...formData, experienceWithChildren: e.target.value })}
                        rows={4}
                        className={`w-full rounded-lg border ${errors.experienceWithChildren ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.experienceWithChildren && (
                        <p className="mt-1 text-sm text-red-500">{errors.experienceWithChildren}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        3. Describe how you set limits or discipline children. *
                    </label>
                    <textarea
                        value={formData.disciplineApproach}
                        onChange={(e) => setFormData({ ...formData, disciplineApproach: e.target.value })}
                        rows={4}
                        className={`w-full rounded-lg border ${errors.disciplineApproach ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.disciplineApproach && (
                        <p className="mt-1 text-sm text-red-500">{errors.disciplineApproach}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        4. What contribution can you make to the children at Recro Grief Camp? *
                    </label>
                    <textarea
                        value={formData.contributionToCamp}
                        onChange={(e) => setFormData({ ...formData, contributionToCamp: e.target.value })}
                        rows={4}
                        className={`w-full rounded-lg border ${errors.contributionToCamp ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.contributionToCamp && (
                        <p className="mt-1 text-sm text-red-500">{errors.contributionToCamp}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        5. Describe what you feel your responsibilities as a therapist would include *
                    </label>
                    <textarea
                        value={formData.responsibilitiesDescription}
                        onChange={(e) => setFormData({ ...formData, responsibilitiesDescription: e.target.value })}
                        rows={4}
                        className={`w-full rounded-lg border ${errors.responsibilitiesDescription ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.responsibilitiesDescription && (
                        <p className="mt-1 text-sm text-red-500">{errors.responsibilitiesDescription}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        6. Why are you interested in participating as a Recro Grief Camp therapist? *
                    </label>
                    <textarea
                        value={formData.reasonForInterest}
                        onChange={(e) => setFormData({ ...formData, reasonForInterest: e.target.value })}
                        rows={4}
                        className={`w-full rounded-lg border ${errors.reasonForInterest ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.reasonForInterest && (
                        <p className="mt-1 text-sm text-red-500">{errors.reasonForInterest}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        7. Describe any previous experience as a camp therapist or group facilitator related activities you have participated in. *
                    </label>
                    <textarea
                        value={formData.previousExperience}
                        onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                        rows={4}
                        className={`w-full rounded-lg border ${errors.previousExperience ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.previousExperience && (
                        <p className="mt-1 text-sm text-red-500">{errors.previousExperience}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        8. Please feel free to add further information about yourself that you wish to have considered by the review committee for Recro Grief Camp. *
                    </label>
                    <textarea
                        value={formData.additionalInformation}
                        onChange={(e) => setFormData({ ...formData, additionalInformation: e.target.value })}
                        rows={4}
                        className={`w-full rounded-lg border ${errors.additionalInformation ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.additionalInformation && (
                        <p className="mt-1 text-sm text-red-500">{errors.additionalInformation}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                        9. Are you applying as a Therapist or Group Facilitator?
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-background px-4 py-3 transition hover:bg-muted">
                            <input
                                type="checkbox"
                                checked={formData.applicationType === "Therapist"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        applicationType: e.target.checked ? "Therapist" : "",
                                    })
                                }
                                className="size-4 rounded text-primary-deep focus:ring-primary-deep"
                            />
                            <span className="text-sm text-foreground">Therapist</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-background px-4 py-3 transition hover:bg-muted">
                            <input
                                type="checkbox"
                                checked={formData.applicationType === "Facilitator"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        applicationType: e.target.checked ? "Facilitator" : "",
                                    })
                                }
                                className="size-4 rounded text-primary-deep focus:ring-primary-deep"
                            />
                            <span className="text-sm text-foreground">Facilitator</span>
                        </label>
                    </div>
                </div>

                {formData.applicationType === "Facilitator" && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            10. Group facilitator — based on previous groups you have facilitated, what sort of groups have you facilitated? *
                        </label>
                        <textarea
                            value={formData.groupsFacilitated || ""}
                            onChange={(e) => setFormData({ ...formData, groupsFacilitated: e.target.value })}
                            rows={4}
                            className={`w-full rounded-lg border ${errors.groupsFacilitated ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                        {errors.groupsFacilitated && (
                            <p className="mt-1 text-sm text-red-500">{errors.groupsFacilitated}</p>
                        )}
                    </div>
                )}

                {formData.applicationType === "Therapist" && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            11. As a Therapist, what capacity have you worked with children previously?
                        </label>
                        <textarea
                            value={formData.therapistCapacity || ""}
                            onChange={(e) => setFormData({ ...formData, therapistCapacity: e.target.value })}
                            rows={4}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-transparent px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </button>
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
