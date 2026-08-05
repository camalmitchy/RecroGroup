"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

import type { PaymentMethod, ServiceOption, Step } from "./booking-types";
import { SERVICES, TIME_SLOTS } from "./booking-data";
import { ServiceStep } from "./steps/service-step";
import { TimeStep } from "./steps/time-step";
import { IntakeStep } from "./steps/intake-step";
import { PaymentStep } from "./steps/payment-step";
import { ConfirmationStep } from "./steps/confirmation-step";

export function BookingPage() {
    const searchParams = useSearchParams();
    const serviceParam = searchParams.get("service");

    const [step, setStep] = useState<Step>("service");

    // Service step
    const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);

    // Time step
    const [clinician, setClinician] = useState<string>("dr-karume");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");

    // Intake step
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [notes, setNotes] = useState("");

    // Payment step
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
    const [mpesaPhone, setMpesaPhone] = useState("");
    const [bankRef, setBankRef] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);

    // Pre-select service from URL param
    useEffect(() => {
        if (serviceParam) {
            const service = SERVICES.find((s) => s.key === serviceParam);
            if (service) {
                setSelectedService(service);
            }
        }
    }, [serviceParam]);

    // Generate available dates (next 14 days, excluding Sundays)
    const generateAvailableDates = () => {
        const dates: Date[] = [];
        const today = new Date();
        let daysAdded = 0;
        let offset = 1;

        while (daysAdded < 14) {
            const date = new Date(today);
            date.setDate(today.getDate() + offset);

            // Skip Sundays (0 = Sunday)
            if (date.getDay() !== 0) {
                dates.push(date);
                daysAdded++;
            }
            offset++;
        }
        return dates;
    };

    const availableDates = generateAvailableDates();

    const canProceedFromService = selectedService !== null;
    const canProceedFromTime = selectedDate && selectedTime && clinician;
    const canProceedFromIntake = clientName.trim() && clientEmail.trim();

    const handleServiceNext = () => {
        if (canProceedFromService) setStep("time");
    };

    const handleTimeNext = () => {
        if (canProceedFromTime) setStep("intake");
    };

    const handleIntakeNext = () => {
        if (canProceedFromIntake) setStep("pay");
    };

    const handlePayment = async () => {
        if (paymentMethod === "mpesa") {
            if (mpesaPhone.length !== 9) {
                alert("Please enter a valid 9-digit M-Pesa number");
                return;
            }
            setBusy(true);
            // TODO: Implement M-Pesa STK push
            setTimeout(() => {
                setBusy(false);
                setStep("done");
            }, 1500);
        } else if (paymentMethod === "card") {
            setBusy(true);
            // TODO: Implement Pesapal card payment
            setTimeout(() => {
                setBusy(false);
                setStep("done");
            }, 1500);
        } else if (paymentMethod === "bank") {
            if (!bankRef.trim() || !proofFile) {
                alert("Please upload your bank slip and enter the reference");
                return;
            }
            setBusy(true);
            // TODO: Upload proof and create booking
            setTimeout(() => {
                setBusy(false);
                setStep("done");
            }, 1500);
        }
    };

    const stepIndex = ["service", "time", "intake", "pay"].indexOf(step);

    return (
        <section className="bg-surface min-h-screen py-10">
            <div className="container-page max-w-6xl">
                {/* Page Title & Steps */}
                <div className="mb-10">
                    <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground mb-3">
                        BOOKING
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl text-primary-deep mb-8">
                        Book a session
                    </h1>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-12">
                        {[
                            { key: "service", label: "SERVICE", num: 1 },
                            { key: "time", label: "TIME", num: 2 },
                            { key: "intake", label: "INTAKE", num: 3 },
                            { key: "pay", label: "PAY", num: 4 },
                        ].map((s, idx) => {
                            const isComplete = stepIndex > idx;
                            const isCurrent = step === s.key;
                            return (
                                <div key={s.key} className="flex items-center gap-3">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition ${isComplete
                                            ? "bg-primary text-primary-foreground"
                                            : isCurrent
                                                ? "border-2 border-foreground text-foreground"
                                                : "border border-border text-muted-foreground"
                                            }`}
                                    >
                                        {isComplete ? <Check size={16} strokeWidth={3} /> : s.num}
                                    </div>
                                    <span
                                        className={`text-xs font-medium uppercase tracking-wider hidden sm:inline ${isCurrent || isComplete
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Steps Content */}
                {step === "service" && (
                    <ServiceStep
                        services={SERVICES}
                        selectedService={selectedService}
                        onSelectService={setSelectedService}
                        onNext={handleServiceNext}
                    />
                )}

                {step === "time" && (
                    <TimeStep
                        clinician={clinician}
                        setClinician={setClinician}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        availableDates={availableDates}
                        timeSlots={TIME_SLOTS}
                        onBack={() => setStep("service")}
                        onNext={handleTimeNext}
                    />
                )}

                {step === "intake" && (
                    <IntakeStep
                        clientName={clientName}
                        setClientName={setClientName}
                        clientEmail={clientEmail}
                        setClientEmail={setClientEmail}
                        clientPhone={clientPhone}
                        setClientPhone={setClientPhone}
                        notes={notes}
                        setNotes={setNotes}
                        onBack={() => setStep("time")}
                        onNext={handleIntakeNext}
                    />
                )}

                {step === "pay" && selectedService && selectedDate && (
                    <PaymentStep
                        service={selectedService}
                        date={selectedDate}
                        time={selectedTime}
                        clientName={clientName}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        mpesaPhone={mpesaPhone}
                        setMpesaPhone={setMpesaPhone}
                        bankRef={bankRef}
                        setBankRef={setBankRef}
                        proofFile={proofFile}
                        setProofFile={setProofFile}
                        busy={busy}
                        onBack={() => setStep("intake")}
                        onPay={handlePayment}
                    />
                )}

                {step === "done" && selectedService && selectedDate && (
                    <ConfirmationStep
                        clientName={clientName}
                        date={selectedDate}
                        time={selectedTime}
                        commitmentFee={Math.round(selectedService.price / 2)}
                    />
                )}
            </div>
        </section>
    );
}
