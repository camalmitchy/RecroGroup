"use client";

import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import type { HealthHistoryData } from "../../../types/facilitator-types";

interface HealthHistoryStepProps {
    data: any;
    onPrevious: () => void;
    onSubmit: (data: { healthHistory: HealthHistoryData }) => void;
}

export function HealthHistoryStep({
    data,
    onPrevious,
    onSubmit,
}: HealthHistoryStepProps) {
    const [formData, setFormData] = useState<HealthHistoryData>(
        data.healthHistory || {
            nameAndDate: "",
            familyPhysician: "",
            allergiesOrIllnesses: "",
            recentSurgeryInjuryIllness: false,
            surgeryDetails: "",
            currentMedication: "",
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nameAndDate.trim()) {
            newErrors.nameAndDate = "Name and date are required";
        }
        if (!formData.familyPhysician.trim()) {
            newErrors.familyPhysician = "Family physician information is required";
        }
        if (!formData.allergiesOrIllnesses.trim()) {
            newErrors.allergiesOrIllnesses = "Please list allergies/illnesses or write 'None'";
        }
        if (formData.recentSurgeryInjuryIllness && !formData.surgeryDetails?.trim()) {
            newErrors.surgeryDetails = "Please explain the surgery, injury, or illness";
        }
        if (!formData.currentMedication.trim()) {
            newErrors.currentMedication = "Please list medications or write 'None'";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            setIsSubmitting(true);
            try {
                await onSubmit({ healthHistory: formData });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Page 3 of 3: Health History
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please provide your health information
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Name and Date *
                </label>
                <input
                    type="text"
                    value={formData.nameAndDate}
                    onChange={(e) => setFormData({ ...formData, nameAndDate: e.target.value })}
                    placeholder="Full Name, Date"
                    className={`w-full rounded-lg border ${errors.nameAndDate ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.nameAndDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.nameAndDate}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Family Physician & Phone No. *
                </label>
                <input
                    type="text"
                    value={formData.familyPhysician}
                    onChange={(e) => setFormData({ ...formData, familyPhysician: e.target.value })}
                    placeholder="Dr. Name, Phone Number"
                    className={`w-full rounded-lg border ${errors.familyPhysician ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.familyPhysician && (
                    <p className="mt-1 text-sm text-red-500">{errors.familyPhysician}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    List any allergies or illnesses and explain *
                </label>
                <textarea
                    value={formData.allergiesOrIllnesses}
                    onChange={(e) => setFormData({ ...formData, allergiesOrIllnesses: e.target.value })}
                    placeholder="List all allergies and illnesses, or write 'None' if not applicable"
                    rows={4}
                    className={`w-full rounded-lg border ${errors.allergiesOrIllnesses ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.allergiesOrIllnesses && (
                    <p className="mt-1 text-sm text-red-500">{errors.allergiesOrIllnesses}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Any recent surgery, injury, or illness? *
                </label>
                <div className="flex gap-6 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={formData.recentSurgeryInjuryIllness === true}
                            onChange={() => setFormData({ ...formData, recentSurgeryInjuryIllness: true })}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={formData.recentSurgeryInjuryIllness === false}
                            onChange={() =>
                                setFormData({
                                    ...formData,
                                    recentSurgeryInjuryIllness: false,
                                    surgeryDetails: "",
                                })
                            }
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">No</span>
                    </label>
                </div>

                {formData.recentSurgeryInjuryIllness && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            If yes, please explain.... *
                        </label>
                        <textarea
                            value={formData.surgeryDetails || ""}
                            onChange={(e) => setFormData({ ...formData, surgeryDetails: e.target.value })}
                            placeholder="Describe the surgery, injury, or illness and when it occurred"
                            rows={3}
                            className={`w-full rounded-lg border ${errors.surgeryDetails ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                        {errors.surgeryDetails && (
                            <p className="mt-1 text-sm text-red-500">{errors.surgeryDetails}</p>
                        )}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Are you currently taking any medication? If yes, please list and explain. *
                </label>
                <textarea
                    value={formData.currentMedication}
                    onChange={(e) => setFormData({ ...formData, currentMedication: e.target.value })}
                    placeholder="List all current medications with dosages and reasons, or write 'None' if not applicable"
                    rows={4}
                    className={`w-full rounded-lg border ${errors.currentMedication ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.currentMedication && (
                    <p className="mt-1 text-sm text-red-500">{errors.currentMedication}</p>
                )}
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-50 p-4 dark:bg-amber-950/20">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>Important:</strong> Please ensure all information provided is accurate and complete. Your application will be reviewed by our team and we will contact you regarding the next steps.
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
