"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ConsentStepProps {
    data: any;
    onNext: (data: any) => void;
    onPrevious: () => void;
}

export function ConsentStep({ data, onNext, onPrevious }: ConsentStepProps) {
    const [formData, setFormData] = useState(
        data.consent || {
            releaseConsent: false,
            releaseConsentDate: "",
            medicalConsent: false,
            medicalConsentDate: "",
            signature: "",
            attendingParentSession: false,
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.releaseConsent) {
            newErrors.releaseConsent = "You must give consent to proceed";
        }
        if (!formData.releaseConsentDate) {
            newErrors.releaseConsentDate = "Date is required";
        }
        if (!formData.medicalConsent) {
            newErrors.medicalConsent = "You must give medical consent to proceed";
        }
        if (!formData.medicalConsentDate) {
            newErrors.medicalConsentDate = "Date is required";
        }
        if (!formData.signature.trim()) {
            newErrors.signature = "Signature is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext({ consent: formData });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Section 6: Consent & Release
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please read and acknowledge the following consents
                </p>
            </div>

            {/* Release and Assumption of Risk */}
            <div className="rounded-lg border border-border bg-muted/30 p-6">
                <h3 className="font-serif text-lg text-foreground mb-3">
                    Release and Assumption of Risk Agreement
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                        Everything reasonable has been done to assure that our activities are as safe as possible. However, we wish to inform you that these activities are not without risk. As in any strenuous activity, the activities have inherent risks and may result in serious injury or death.
                    </p>
                    <p>
                        I realize that hiking and sports activities have inherent risks. I knowingly accept and assume these risks, and agree to release Recro Grief Camp and its parent organizations from any and all claims, damages, injuries, and expenses arising out of or resulting from my child's participation in all these camp activities.
                    </p>
                    <p>
                        I further agree to release, acquit, and covenant not to sue said organizations for any and all action, claims or damages, damages in law, or remedies in equity of whatever kind, including the negligence of said organizations. I understand "said organizations" includes their agents and employees.
                    </p>
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.releaseConsent}
                                onChange={(e) => setFormData({ ...formData, releaseConsent: e.target.checked })}
                                className="mt-1 size-4 rounded text-primary-deep focus:ring-primary-deep"
                            />
                            <span className="text-sm font-medium text-foreground">
                                I give consent and acknowledge that I have read and understood this agreement *
                            </span>
                        </label>
                        {errors.releaseConsent && (
                            <p className="mt-1 ml-7 text-sm text-red-500">{errors.releaseConsent}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Consent Date *
                        </label>
                        <input
                            type="date"
                            value={formData.releaseConsentDate}
                            onChange={(e) => setFormData({ ...formData, releaseConsentDate: e.target.value })}
                            className={`w-full max-w-xs rounded-lg border ${errors.releaseConsentDate ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                        {errors.releaseConsentDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.releaseConsentDate}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Medical Consent */}
            <div className="rounded-lg border border-border bg-muted/30 p-6">
                <h3 className="font-serif text-lg text-foreground mb-3">
                    Medical Consent
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                        I (We) the undersigned parent(s) or guardian of the child named above, a minor, give my/our consent for him/her to attend Recro Grief Camp and to participate in its activities. We give further consent for the camp nurse to do an initial triage at the beginning of camp and render necessary first aid in the event of accident or nursing care in the event of sickness and to control the administration of prescribed medication brought to camp by the camper.
                    </p>
                    <p>
                        I understand that in the event of minor injuries I give consent for the camp nurse to give the necessary first aid.
                    </p>
                    <p>
                        It is understood that in the event of a medical emergency or need for medical aid, your child will be taken to the nearest health care provider, whether it be an emergency room or otherwise. REASONABLE EFFORT WILL BE MADE to reach the undersigned prior to rendering treatment to the patient, but any necessary treatment will not be withheld if the undersigned cannot be reached.
                    </p>
                    <p>
                        I understand that once my child is taken to the nearest health care provider, you will be financially responsible for all costs incurred in rendering or providing medical attention to your child and Recro Group Limited is not obligated to provide insurance nor will it assume responsibility for medical assistance provided.
                    </p>
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.medicalConsent}
                                onChange={(e) => setFormData({ ...formData, medicalConsent: e.target.checked })}
                                className="mt-1 size-4 rounded text-primary-deep focus:ring-primary-deep"
                            />
                            <span className="text-sm font-medium text-foreground">
                                I/We give medical consent and acknowledge that I have read and understood this agreement *
                            </span>
                        </label>
                        {errors.medicalConsent && (
                            <p className="mt-1 ml-7 text-sm text-red-500">{errors.medicalConsent}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Consent Date *
                        </label>
                        <input
                            type="date"
                            value={formData.medicalConsentDate}
                            onChange={(e) => setFormData({ ...formData, medicalConsentDate: e.target.value })}
                            className={`w-full max-w-xs rounded-lg border ${errors.medicalConsentDate ? "border-red-500" : "border-border"
                                } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                        />
                        {errors.medicalConsentDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.medicalConsentDate}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Signature */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Signature (Full Name) *
                </label>
                <input
                    type="text"
                    value={formData.signature}
                    onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                    placeholder="Type your full name as signature"
                    className={`w-full rounded-lg border ${errors.signature ? "border-red-500" : "border-border"
                        } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                />
                {errors.signature && (
                    <p className="mt-1 text-sm text-red-500">{errors.signature}</p>
                )}
            </div>

            {/* Parent Session */}
            <div className="rounded-lg border border-border bg-background p-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                    Will you be attending the parent session? *
                </label>
                <p className="text-sm text-muted-foreground mb-4">
                    If Yes, kindly include your parent session fee when making the payment.
                </p>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={formData.attendingParentSession === true}
                            onChange={() => setFormData({ ...formData, attendingParentSession: true })}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={formData.attendingParentSession === false}
                            onChange={() => setFormData({ ...formData, attendingParentSession: false })}
                            className="size-4 text-primary-deep focus:ring-primary-deep"
                        />
                        <span className="text-sm text-foreground">No</span>
                    </label>
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
