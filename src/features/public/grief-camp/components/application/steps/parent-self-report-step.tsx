"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ParentSelfReportStepProps {
    data: any;
    onNext: (data: any) => void;
    onPrevious: () => void;
}

const QUESTIONS = [
    { id: 1, text: "I've lost interest in my family, friends, and outside activities." },
    { id: 2, text: "I feel a need to do things that the deceased had wanted to do." },
    { id: 3, text: "I still cry when I think of the person who died." },
    { id: 4, text: "Even now it's painful to recall memories of the person who died." },
    { id: 5, text: "I still struggle to function in a normal daily routine because of the grief and loss I feel for this person." },
];

const SCALE_OPTIONS = [
    { value: 1, label: "Completely True" },
    { value: 2, label: "Mostly True" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Mostly False" },
    { value: 5, label: "Completely False" },
];

export function ParentSelfReportStep({ data, onNext, onPrevious }: ParentSelfReportStepProps) {
    const [responses, setResponses] = useState<Record<number, number>>(
        data.parentSelfReport || {}
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({ parentSelfReport: responses });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">
                    Section 3: Parent Self Report
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Please answer the following questions in regards to your experience, not your child's.
                </p>
                <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs font-medium text-foreground">
                        Scale: 1-Completely True, 2-Mostly True, 3-Neutral, 4-Mostly False, 5-Completely False
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {QUESTIONS.map((question) => (
                    <div key={question.id} className="border-b border-border pb-6 last:border-0">
                        <p className="font-medium text-foreground mb-4">
                            {question.id}. {question.text}
                        </p>
                        <div className="space-y-2">
                            {SCALE_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center gap-3 cursor-pointer rounded-lg border border-border bg-background px-4 py-3 transition hover:bg-muted"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option.value}
                                        checked={responses[question.id] === option.value}
                                        onChange={() =>
                                            setResponses({ ...responses, [question.id]: option.value })
                                        }
                                        className="size-4 text-primary-deep focus:ring-primary-deep"
                                    />
                                    <span className="text-sm text-foreground">{option.label}</span>
                                </label>
                            ))}
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
