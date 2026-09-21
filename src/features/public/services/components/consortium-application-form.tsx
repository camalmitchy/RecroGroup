"use client";

import { useState, useTransition } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { submitInquiry } from "@/server/actions/inquiry";
import {
    formatInquiryMessage,
    truncateSubject,
} from "@/features/public/shared/inquiry-message";

export function ConsortiumApplicationForm() {
    const [formData, setFormData] = useState({
        // Demographic Information
        names: "",
        phoneNumber: "",
        emailAddress: "",

        // Education/Career
        degrees: "",
        universities: "",
        professionalLicenseNumber: "",
        professionalBoard: "",
        memberNumber: "",
        clinicalExpertise: "",
        researchInterest: "",
        currentEmployment: "",
        essay: "",
    });

    const [referees, setReferees] = useState([
        { name: "", phone: "", email: "", organization: "" },
        { name: "", phone: "", email: "", organization: "" },
        { name: "", phone: "", email: "", organization: "" },
    ]);

    const [submitted, setSubmitted] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPending) return;

        const wordCount = formData.essay.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 150) {
            toast.error("The essay needs at least 150 words.");
            return;
        }

        startTransition(async () => {
            const result = await submitInquiry({
                type: "CONTACT",
                name: formData.names,
                email: formData.emailAddress,
                phone: formData.phoneNumber || undefined,
                subject: truncateSubject("Consortium application"),
                message: formatInquiryMessage([
                    {
                        heading: "Applicant",
                        fields: [
                            ["Name", formData.names],
                            ["Email", formData.emailAddress],
                            ["Phone", formData.phoneNumber],
                        ],
                    },
                    {
                        heading: "Education and career",
                        fields: [
                            ["Degrees", formData.degrees],
                            ["Universities", formData.universities],
                            ["License number", formData.professionalLicenseNumber],
                            ["Professional board", formData.professionalBoard],
                            ["Member number", formData.memberNumber],
                            ["Clinical expertise", formData.clinicalExpertise],
                            ["Research interest", formData.researchInterest],
                            ["Current employment", formData.currentEmployment],
                        ],
                    },
                    {
                        heading: "Essay",
                        fields: [["Personal values and career plans", formData.essay]],
                    },
                    {
                        heading: "Referees",
                        fields: referees.flatMap((referee, index) => [
                            [`Referee ${index + 1} name`, referee.name],
                            [`Referee ${index + 1} phone`, referee.phone],
                            [`Referee ${index + 1} email`, referee.email],
                            [`Referee ${index + 1} organization`, referee.organization],
                        ]),
                    },
                ]),
            });

            if (!result.ok) {
                toast.error(result.error);
                return;
            }

            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    const updateReferee = (index: number, field: string, value: string) => {
        const newReferees = [...referees];
        newReferees[index] = { ...newReferees[index], [field]: value };
        setReferees(newReferees);
    };

    if (submitted) {
        return (
            <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-soft)]">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
                    <CheckCircle className="h-8 w-8 text-primary-deep" />
                </div>
                <h2 className="font-serif text-3xl text-primary-deep">
                    Application received
                </h2>
                <p className="mt-4 text-muted-foreground">
                    Thank you. The consortium committee will review your application and
                    contact you.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-12">
                <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
                    Consortium Application Form
                </h2>
                <p className="mt-4 text-muted-foreground">
                    Please complete all sections of this application form. Your information will be reviewed by our consortium committee.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-10">
                    {/* Demographic Information */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-foreground">
                            Demographic Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Full Names *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.names}
                                    onChange={(e) =>
                                        setFormData({ ...formData, names: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phoneNumber: e.target.value })
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.emailAddress}
                                        onChange={(e) =>
                                            setFormData({ ...formData, emailAddress: e.target.value })
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Education/Career */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-foreground">
                            Education/Career
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Degree(s) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., MSc in Clinical Psychology, PhD in Marriage and Family Therapy"
                                    value={formData.degrees}
                                    onChange={(e) =>
                                        setFormData({ ...formData, degrees: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Name(s) of University where you earned your degree(s) *
                                </label>
                                <textarea
                                    rows={2}
                                    required
                                    value={formData.universities}
                                    onChange={(e) =>
                                        setFormData({ ...formData, universities: e.target.value })
                                    }
                                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                        Professional License Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="If applicable"
                                        value={formData.professionalLicenseNumber}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                professionalLicenseNumber: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                        Professional Board *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., CPB, AAMFT, APA, KMA"
                                        value={formData.professionalBoard}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                professionalBoard: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Member Number *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your membership number with the professional board(s) listed above"
                                    value={formData.memberNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, memberNumber: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Clinical Area of Expertise *
                                </label>
                                <textarea
                                    rows={2}
                                    required
                                    value={formData.clinicalExpertise}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            clinicalExpertise: e.target.value,
                                        })
                                    }
                                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Research Area of Interest *
                                </label>
                                <textarea
                                    rows={2}
                                    required
                                    value={formData.researchInterest}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            researchInterest: e.target.value,
                                        })
                                    }
                                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Current Employment *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.currentEmployment}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            currentEmployment: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Essay */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-foreground">
                            Essay
                        </h3>
                        <div className="rounded-xl border border-border bg-surface p-6">
                            <p className="text-sm text-muted-foreground">
                                Briefly explain how your <strong>a) Personal values</strong> and{" "}
                                <strong>b) Professional career plans</strong> meet the objectives
                                of Recro Group Limited-Consortium.
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Minimum 150 words.
                            </p>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Essay *
                                </label>
                                <textarea
                                    required
                                    rows={10}
                                    className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    onChange={(e) =>
                                        setFormData({ ...formData, essay: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Referees */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-foreground">
                            Professional Referees
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Kindly provide three professional referees with your application.
                        </p>

                        <div className="space-y-6">
                            {referees.map((referee, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-border bg-surface p-6"
                                >
                                    <h4 className="mb-4 font-medium text-foreground">
                                        Referee {index + 1}
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={referee.name}
                                                    onChange={(e) =>
                                                        updateReferee(index, "name", e.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                    Phone *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={referee.phone}
                                                    onChange={(e) =>
                                                        updateReferee(index, "phone", e.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={referee.email}
                                                    onChange={(e) =>
                                                        updateReferee(index, "email", e.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                    Organization *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={referee.organization}
                                                    onChange={(e) =>
                                                        updateReferee(index, "organization", e.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="rounded-xl border border-primary/20 bg-primary-soft p-6">
                        <p className="mb-4 text-sm text-foreground">
                            By submitting this application, I confirm that all information provided
                            is accurate and complete. I understand that membership requires adherence
                            to ethical guidelines and regular participation in monthly meetings.
                        </p>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isPending}
                            className="w-full rounded-full bg-primary-deep hover:bg-primary-deep/90 sm:w-auto"
                        >
                            {isPending ? "Submitting…" : "Submit Application"}
                            <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </div>
                </form>

                <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6">
                    <p className="text-sm text-muted-foreground">
                        <strong>Questions about the application?</strong>
                        <br />
                        Contact us at 0717-78-78-07 / 0717-78-78-08 or{" "}
                        <a
                            href="mailto:info@recrogroup.org"
                            className="text-primary-deep hover:underline"
                        >
                            info@recrogroup.org
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
