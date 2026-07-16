"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RegistrationStepProps {
    data: any;
    onNext: (data: any) => void;
    onPrevious: () => void;
}

export function RegistrationStep({ data, onNext, onPrevious }: RegistrationStepProps) {
    const [formData, setFormData] = useState(
        data.registration || {
            childName: data.parentQuestionnaire?.childName || "",
            dateOfBirth: data.parentQuestionnaire?.dateOfBirth || "",
            ageAndGrade: "",
            gender: data.parentQuestionnaire?.gender || "Male",
            address: "",
            phoneAndEmail: data.parentQuestionnaire?.parentEmail || "",
            medicalInsuranceProvider: "",
            medicalInsuranceBillingAddress: "",
            religiousAffiliation: data.parentQuestionnaire?.religiousAffiliation || "",
            fathersName: "",
            mothersName: "",
            nameOfDeceased: "",
            relationshipToDeceased: "",
            deceasedDateOfBirth: "",
            deceasedDateOfDeath: data.parentQuestionnaire?.dateOfDeath || "",
            causeOfDeath: "",
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.childName.trim()) newErrors.childName = "Required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Required";
        if (!formData.ageAndGrade.trim()) newErrors.ageAndGrade = "Required";
        if (!formData.address.trim()) newErrors.address = "Required";
        if (!formData.phoneAndEmail.trim()) newErrors.phoneAndEmail = "Required";
        if (!formData.fathersName.trim()) newErrors.fathersName = "Required";
        if (!formData.mothersName.trim()) newErrors.mothersName = "Required";
        if (!formData.nameOfDeceased.trim()) newErrors.nameOfDeceased = "Required";
        if (!formData.relationshipToDeceased.trim()) newErrors.relationshipToDeceased = "Required";
        if (!formData.deceasedDateOfDeath) newErrors.deceasedDateOfDeath = "Required";
        if (!formData.causeOfDeath.trim()) newErrors.causeOfDeath = "Required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext({ registration: formData });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Section 4: Registration Form
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please complete all required fields marked with *
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Child's Name *
                    </label>
                    <input
                        type="text"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        className={`w-full rounded-lg border ${errors.childName ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                    {errors.childName && (
                        <p className="mt-1 text-sm text-red-500">{errors.childName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Date of Birth *
                    </label>
                    <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className={`w-full rounded-lg border ${errors.dateOfBirth ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Age & Class or Grade *
                    </label>
                    <input
                        type="text"
                        value={formData.ageAndGrade}
                        onChange={(e) => setFormData({ ...formData, ageAndGrade: e.target.value })}
                        placeholder="e.g., 12 years, Grade 7"
                        className={`w-full rounded-lg border ${errors.ageAndGrade ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Gender *
                    </label>
                    <div className="flex gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === "Male"}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="size-4 text-primary-deep focus:ring-primary-deep"
                            />
                            <span className="text-sm text-foreground">Female</span>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Address / Zip code & City *
                </label>
                <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className={`w-full rounded-lg border ${errors.address ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Phone number & Email address *
                    </label>
                    <input
                        type="text"
                        value={formData.phoneAndEmail}
                        onChange={(e) => setFormData({ ...formData, phoneAndEmail: e.target.value })}
                        className={`w-full rounded-lg border ${errors.phoneAndEmail ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Medical Insurance Provider
                    </label>
                    <input
                        type="text"
                        value={formData.medicalInsuranceProvider}
                        onChange={(e) => setFormData({ ...formData, medicalInsuranceProvider: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Father's Name & Contacts *
                    </label>
                    <input
                        type="text"
                        value={formData.fathersName}
                        onChange={(e) => setFormData({ ...formData, fathersName: e.target.value })}
                        className={`w-full rounded-lg border ${errors.fathersName ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Mother's Name & Contacts *
                    </label>
                    <input
                        type="text"
                        value={formData.mothersName}
                        onChange={(e) => setFormData({ ...formData, mothersName: e.target.value })}
                        className={`w-full rounded-lg border ${errors.mothersName ? "border-red-500" : "border-border"
                            } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                    />
                </div>
            </div>

            <div className="border-t border-border pt-6">
                <h3 className="font-serif text-lg text-foreground mb-4">Deceased Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Name of Deceased *
                        </label>
                        <input
                            type="text"
                            value={formData.nameOfDeceased}
                            onChange={(e) => setFormData({ ...formData, nameOfDeceased: e.target.value })}
                            className={`w-full rounded-lg border ${errors.nameOfDeceased ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Child's Relationship to Deceased *
                        </label>
                        <input
                            type="text"
                            value={formData.relationshipToDeceased}
                            onChange={(e) => setFormData({ ...formData, relationshipToDeceased: e.target.value })}
                            placeholder="e.g., Mother, Father, Sibling"
                            className={`w-full rounded-lg border ${errors.relationshipToDeceased ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Deceased Date of Death *
                        </label>
                        <input
                            type="date"
                            value={formData.deceasedDateOfDeath}
                            onChange={(e) => setFormData({ ...formData, deceasedDateOfDeath: e.target.value })}
                            className={`w-full rounded-lg border ${errors.deceasedDateOfDeath ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Cause of Death *
                        </label>
                        <input
                            type="text"
                            value={formData.causeOfDeath}
                            onChange={(e) => setFormData({ ...formData, causeOfDeath: e.target.value })}
                            className={`w-full rounded-lg border ${errors.causeOfDeath ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                    </div>
                </div>
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
