"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { ServiceOption } from "../booking-types";

export function ServiceStep({
    services,
    selectedService,
    onSelectService,
    onNext,
}: {
    services: ServiceOption[];
    selectedService: ServiceOption | null;
    onSelectService: (service: ServiceOption) => void;
    onNext: () => void;
}) {
    return (
        <div className="space-y-6">
            {/* Service Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
                {services.map((service) => {
                    const isSelected = selectedService?.key === service.key;
                    return (
                        <button
                            key={service.key}
                            onClick={() => onSelectService(service)}
                            className={`text-left rounded-2xl border-2 p-6 transition bg-background shadow-sm ${isSelected
                                ? "border-primary"
                                : "border-border hover:border-primary/50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={service.icon}
                                    alt={service.title}
                                    width={32}
                                    height={32}
                                    className="shrink-0"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {service.duration} · Ksh {service.price.toLocaleString()}{" "}
                                        <span className="text-muted-foreground/80">
                                            (commitment Ksh{" "}
                                            {Math.round(service.price / 2).toLocaleString()})
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center justify-between pt-4">
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={16} /> Back to Services
                </Link>
                <button
                    onClick={onNext}
                    disabled={!selectedService}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

