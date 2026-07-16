"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OtherLossesStepProps {
    data: any;
    onNext: (data: any) => void;
    onPrevious: () => void;
}

export function OtherLossesStep({ data, onNext, onPrevious }: OtherLossesStepProps) {
    const [formData, setFormData] = useState(
        data.otherLosses || {
            divorceDate: "",
            movingDate: "",
            friendsMovingDate: "",
            otherDeathsDate: "",
            otherDeathsWho: "",
            petDeathsDate: "",
            parentsJobChangeDate: "",
            parentsJobLossDate: "",
            fireTheftDate: "",
            otherChanges: "",
            howChildHandled: "",
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({ otherLosses: formData });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Section 3: Types of Other Losses
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please provide information about other significant changes or losses in your child's life
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Divorce or separation (Date if applicable)
                    </label>
                    <input
                        type="date"
                        value={formData.divorceDate}
                        onChange={(e) => setFormData({ ...formData, divorceDate: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Moving to a new community (Date if applicable)
                    </label>
                    <input
                        type="date"
                        value={formData.movingDate}
                        onChange={(e) => setFormData({ ...formData, movingDate: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Other deaths? If so, who and when?
                    </label>
                    <input
                        type="text"
                        placeholder="Who passed away?"
                        value={formData.otherDeathsWho}
                        onChange={(e) => setFormData({ ...formData, otherDeathsWho: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20 mb-2"
                    />
                    <input
                        type="date"
                        value={formData.otherDeathsDate}
                        onChange={(e) => setFormData({ ...formData, otherDeathsDate: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Pet deaths? (Date if applicable)
                    </label>
                    <input
                        type="date"
                        value={formData.petDeathsDate}
                        onChange={(e) => setFormData({ ...formData, petDeathsDate: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Other changes in child's life?
                    </label>
                    <textarea
                        value={formData.otherChanges}
                        onChange={(e) => setFormData({ ...formData, otherChanges: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        How did the child handle these changes?
                    </label>
                    <textarea
                        value={formData.howChildHandled}
                        onChange={(e) => setFormData({ ...formData, howChildHandled: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20"
                    />
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
