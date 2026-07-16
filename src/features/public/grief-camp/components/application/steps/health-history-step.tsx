"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HealthHistoryStepProps {
    data: any;
    onNext: (data: any) => void;
    onPrevious: () => void;
}

const HEALTH_CONDITIONS = [
    "Insect Stings",
    "Bee Stings",
    "Heart Condition",
    "Frequent Colds",
    "Drugs",
    "Chronic Asthma",
    "Other Allergies",
    "Hay Fever",
    "Diabetes",
    "Physical Handicap",
    "Epilepsy",
    "Headache",
    "Frequent Stomach Upsets",
    "Chronic Bronchitis",
    "Chronic Respiratory Infections",
];

const APPROVED_MEDICATIONS = [
    "Pain (Panadol Brufen)",
    "Fever (Paracetamol, Brufen)",
    "Eye/Ear (Drops)",
    "Stomach (Zinc, Buscopan, Floranol)",
    "Cold Medications/Allergy/Cough Syrups",
];

export function HealthHistoryStep({ data, onNext, onPrevious }: HealthHistoryStepProps) {
    const [formData, setFormData] = useState(
        data.healthHistory || {
            conditions: [],
            otherCondition: "",
            lastTetanus: "",
            lastBooster: "",
            lastTBTest: "",
            immunizationsUpToDate: true,
            recentOperationInjuryIllness: false,
            operationDetails: "",
            allergicReactions: "",
            medications: "",
            approvedMedications: [],
            otherApprovedMedication: "",
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.lastTetanus) newErrors.lastTetanus = "Required";
        if (!formData.allergicReactions.trim()) newErrors.allergicReactions = "Required (write 'None' if not applicable)";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext({ healthHistory: formData });
        }
    };

    const toggleCondition = (condition: string) => {
        const updated = formData.conditions.includes(condition)
            ? formData.conditions.filter((c: string) => c !== condition)
            : [...formData.conditions, condition];
        setFormData({ ...formData, conditions: updated });
    };

    const toggleApprovedMedication = (medication: string) => {
        const updated = formData.approvedMedications.includes(medication)
            ? formData.approvedMedications.filter((m: string) => m !== medication)
            : [...formData.approvedMedications, medication];
        setFormData({ ...formData, approvedMedications: updated });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Section 5: Health History
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please provide your child's health information
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                    Health Conditions (Select all that apply)
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                    {HEALTH_CONDITIONS.map((condition) => (
                        <label
                            key={condition}
                            className="flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-background px-4 py-2.5 transition hover:bg-muted"
                        >
                            <input
                                type="checkbox"
                                checked={formData.conditions.includes(condition)}
                                onChange={() => toggleCondition(condition)}
                                className="size-4 rounded text-primary-deep focus:ring-primary-deep"
                            />
                            <span className="text-sm text-foreground">{condition}</span>
                        </label>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="If other, please specify"
                    value={formData.otherCondition}
                    onChange={(e) => setFormData({ ...formData, otherCondition: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Date of last tetanus immunization *
                    </label>
                    <input
                        type="date"
                        value={formData.lastTetanus}
                        onChange={(e) => setFormData({ ...formData, lastTetanus: e.target.value })}
                        className={`w-full rounded-lg border ${errors.lastTetanus ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Date of last booster
                    </label>
                    <input
                        type="date"
                        value={formData.lastBooster}
                        onChange={(e) => setFormData({ ...formData, lastBooster: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Date of last TB Test
                    </label>
                    <input
                        type="date"
                        value={formData.lastTBTest}
                        onChange={(e) => setFormData({ ...formData, lastTBTest: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Are your child's immunization shots up to date? *
                </label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={formData.immunizationsUpToDate === true}
                            onChange={() => setFormData({ ...formData, immunizationsUpToDate: true })}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={formData.immunizationsUpToDate === false}
                            onChange={() => setFormData({ ...formData, immunizationsUpToDate: false })}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">No</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Any recent operation, injury, or illness? *
                </label>
                <div className="flex gap-6 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={formData.recentOperationInjuryIllness === true}
                            onChange={() => setFormData({ ...formData, recentOperationInjuryIllness: true })}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={formData.recentOperationInjuryIllness === false}
                            onChange={() => setFormData({ ...formData, recentOperationInjuryIllness: false })}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">No</span>
                    </label>
                </div>
                {formData.recentOperationInjuryIllness && (
                    <textarea
                        placeholder="Please explain and indicate date"
                        value={formData.operationDetails}
                        onChange={(e) => setFormData({ ...formData, operationDetails: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Allergic reactions to food, environment, or medicine? *
                </label>
                <textarea
                    value={formData.allergicReactions}
                    onChange={(e) => setFormData({ ...formData, allergicReactions: e.target.value })}
                    placeholder="List all allergies or write 'None' if not applicable"
                    rows={3}
                    className={`w-full rounded-lg border ${errors.allergicReactions ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.allergicReactions && (
                    <p className="mt-1 text-sm text-red-500">{errors.allergicReactions}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    List ALL MEDICATIONS that will be sent with your child to camp
                </label>
                <textarea
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    placeholder="Include prescription and over the counter medications"
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                    Medications you approve for our RN to administer if needed *
                </label>
                <div className="space-y-2">
                    {APPROVED_MEDICATIONS.map((medication) => (
                        <label
                            key={medication}
                            className="flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-background px-4 py-2.5 transition hover:bg-muted"
                        >
                            <input
                                type="checkbox"
                                checked={formData.approvedMedications.includes(medication)}
                                onChange={() => toggleApprovedMedication(medication)}
                                className="size-4 rounded text-primary-deep focus:ring-primary-deep"
                            />
                            <span className="text-sm text-foreground">{medication}</span>
                        </label>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Other medications (please specify)"
                    value={formData.otherApprovedMedication}
                    onChange={(e) => setFormData({ ...formData, otherApprovedMedication: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                />
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
