"use client";

import type { ReactNode } from "react";

export function MethodCard({
    active,
    onClick,
    icon,
    title,
    sub,
}: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    title: string;
    sub: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`text-left rounded-2xl border p-5 transition ${active
                ? "border-primary ring-1 ring-primary bg-background"
                : "border-border bg-card hover:border-primary"
                }`}
        >
            <div className="flex items-center gap-2.5 font-semibold">
                {icon} {title}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
        </button>
    );
}

export function Field({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                {label}
            </label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        </div>
    );
}
