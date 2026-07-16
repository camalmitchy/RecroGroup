"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CamperSelfReportStepProps {
    data: any;
    onNext: (data: any) => void;
    onPrevious: () => void;
}

const BEHAVIORS = [
    { id: 1, text: "My child seeks attention" },
    { id: 2, text: "My child cries easily" },
    { id: 3, text: "My child has sleeping problems" },
    { id: 4, text: "My child throws temper tantrums" },
    { id: 5, text: "My child tells tall tales or lies" },
    { id: 6, text: "My child manipulates situation" },
    { id: 7, text: "My child steals" },
    { id: 8, text: "My child frequently stares blankly into space" },
    { id: 9, text: "My child often complains of illness" },
    { id: 10, text: "My child expresses concern that something terrible will happen" },
];

const SCALE_OPTIONS = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: "N/A", label: "N/A" },
];

export function CamperSelfReportStep({
    data,
    onNext,
    onPrevious,
}: CamperSelfReportStepProps) {
    const [behaviors, setBehaviors] = useState<Record<number, { before: any; current: any }>>(
        data.camperSelfReport?.behaviors || {}
    );

    const handleBehaviorChange = (id: number, type: "before" | "current", value: any) => {
        setBehaviors((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [type]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({
            camperSelfReport: {
                ...data.camperSelfReport,
                behaviors,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Section 2: Camper Self Report — Behaviors
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Please indicate the frequency both before death and currently that your child displays these behaviors.
                </p>
                <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs font-medium text-foreground">
                        Scale: 1-Never, 2-Very Rarely, 3-Rarely, 4-Sometimes, 5-Frequently, 6-Always, N/A-Not Applicable
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {BEHAVIORS.map((behavior) => (
                    <div key={behavior.id} className="border-b border-border pb-6 last:border-0">
                        <p className="font-medium text-foreground mb-4">
                            {behavior.id}. {behavior.text}
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Before Death
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SCALE_OPTIONS.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name={`behavior-${behavior.id}-before`}
                                                value={option.value}
                                                checked={behaviors[behavior.id]?.before === option.value}
                                                onChange={() =>
                                                    handleBehaviorChange(behavior.id, "before", option.value)
                                                }
                                                className="size-4 text-primary-deep focus:ring-primary-deep"
                                            />
                                            <span className="text-sm text-foreground">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Currently
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SCALE_OPTIONS.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name={`behavior-${behavior.id}-current`}
                                                value={option.value}
                                                checked={behaviors[behavior.id]?.current === option.value}
                                                onChange={() =>
                                                    handleBehaviorChange(behavior.id, "current", option.value)
                                                }
                                                className="size-4 text-primary-deep focus:ring-primary-deep"
                                            />
                                            <span className="text-sm text-foreground">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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
