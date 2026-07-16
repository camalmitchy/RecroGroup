"use client";

import { useState } from "react";
import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

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

        // Essay
        essayFile: null as File | null,
    });

    const [referees, setReferees] = useState([
        { name: "", phone: "", email: "", organization: "" },
        { name: "", phone: "", email: "", organization: "" },
        { name: "", phone: "", email: "", organization: "" },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", { formData, referees });
        // Handle form submission
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, essayFile: e.target.files[0] });
        }
    };

    const updateReferee = (index: number, field: string, value: string) => {
        const newReferees = [...referees];
        newReferees[index] = { ...newReferees[index], [field]: value };
        setReferees(newReferees);
    };

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
                                Minimum 150 words. Typed in 12pt font. Please upload as a PDF or Word document.
                            </p>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Upload Essay *
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {formData.essayFile && (
                                        <p className="mt-2 text-xs text-primary-deep">
                                            Selected: {formData.essayFile.name}
                                        </p>
                                    )}
                                </div>
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
                            className="w-full rounded-full bg-primary-deep hover:bg-primary-deep/90 sm:w-auto"
                        >
                            Submit Application
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
