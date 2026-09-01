"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
    Calendar,
    Clock,
    User,
    MapPin,
    CreditCard,
    Check,
    ArrowLeft,
    ArrowRight,
    Smartphone,
    Building2,
    Loader2,
    Mail,
} from "lucide-react";

import { createBooking } from "@/server/actions/booking";
import { recordBankTransfer } from "@/server/actions/payments";

type Step = "service" | "time" | "intake" | "pay" | "done";

export type ServiceOption = {
    key: string;
    title: string;
    duration: string;
    icon: string;
    price: number;
    depositKes: number;
};

export type ClinicianOption = {
    id: string;
    name: string;
    title: string;
    photo: string;
    specialties: string[];
};

export type PaymentMethodKey = "mpesa" | "card" | "bank";

type PaymentStatus =
    | "PENDING"
    | "PROCESSING"
    | "PAID"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";

type InitiateResponse = {
    paymentId: string;
    reference: string;
    status: PaymentStatus;
    amountKes: number;
    redirectUrl?: string | null;
    customerMessage?: string | null;
};

type StatusResponse = {
    reference: string;
    status: PaymentStatus;
    amountKes: number;
    settledAmountKes: number | null;
    method: string;
    mpesaReceipt: string | null;
    failureReason: string | null;
    paidAt: string | null;
};

type BookingRecord = {
    bookingId: string;
    reference: string;
    totalKes: number;
    depositKes: number;
    balanceKes: number;
    signature: string;
};

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120_000;

// Generate time slots (9 AM to 5 PM, hourly)
const TIME_SLOTS = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
});

export function BookingPage({
    services,
    clinicians,
    paymentMethods,
    defaultClient,
}: {
    services: ServiceOption[];
    clinicians: ClinicianOption[];
    paymentMethods: PaymentMethodKey[];
    defaultClient?: { name: string; email: string; phone: string };
}) {
    const searchParams = useSearchParams();
    const serviceParam = searchParams.get("service");

    const [step, setStep] = useState<Step>("service");

    // Service step
    const [selectedService, setSelectedService] = useState<ServiceOption | null>(
        () => services.find((s) => s.key === serviceParam) ?? null,
    );

    // Time step
    const [clinician, setClinician] = useState<string>(clinicians[0]?.id ?? "");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");

    // Intake step
    const [clientName, setClientName] = useState(defaultClient?.name ?? "");
    const [clientEmail, setClientEmail] = useState(defaultClient?.email ?? "");
    const [clientPhone, setClientPhone] = useState(defaultClient?.phone ?? "");
    const [notes, setNotes] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [creatingBooking, setCreatingBooking] = useState(false);

    // Payment step
    const [booking, setBooking] = useState<BookingRecord | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>(
        paymentMethods.includes("mpesa")
            ? "mpesa"
            : paymentMethods.includes("card")
                ? "card"
                : "bank",
    );
    const [mpesaPhone, setMpesaPhone] = useState("");
    const [bankRef, setBankRef] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [idempotencyKey, setIdempotencyKey] = useState<string>(() =>
        crypto.randomUUID(),
    );
    const [pending, setPending] = useState<{
        reference: string;
        amountKes: number;
        message: string | null;
    } | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [timedOut, setTimedOut] = useState(false);
    const [payError, setPayError] = useState<string | null>(null);
    const [paidAmountKes, setPaidAmountKes] = useState<number | null>(null);

    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = useCallback(() => {
        if (pollRef.current !== null) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
    }, []);

    useEffect(() => stopPolling, [stopPolling]);

    useEffect(() => {
        if (step !== "pay") stopPolling();
    }, [step, stopPolling]);

    const [lastServiceParam, setLastServiceParam] = useState(serviceParam);
    if (serviceParam !== lastServiceParam) {
        setLastServiceParam(serviceParam);
        const preselected = services.find((s) => s.key === serviceParam);
        if (preselected) setSelectedService(preselected);
    }

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
    const canProceedFromTime =
        selectedDate && selectedTime && (clinicians.length === 0 || Boolean(clinician));
    const canProceedFromIntake =
        clientName.trim() && clientEmail.trim() && clientPhone.trim();

    const handleServiceNext = () => {
        if (canProceedFromService) setStep("time");
    };

    const handleTimeNext = () => {
        if (canProceedFromTime) setStep("intake");
    };

    const handleIntakeNext = async () => {
        if (creatingBooking || !canProceedFromIntake || !selectedService || !selectedDate)
            return;

        const signature = JSON.stringify([
            selectedService.key,
            clientName.trim(),
            clientEmail.trim(),
            clientPhone.trim(),
            toDateOnly(selectedDate),
            selectedTime,
            notes.trim(),
        ]);

        if (booking && booking.signature === signature) {
            setStep("pay");
            return;
        }

        setCreatingBooking(true);
        setFieldErrors({});

        try {
            const result = await createBooking({
                serviceSlug: selectedService.key,
                clientName,
                clientEmail,
                clientPhone,
                preferredDate: toDateOnly(selectedDate),
                preferredTime: selectedTime,
                sessionMode: "IN_PERSON",
                notes: notes.trim() || undefined,
                therapistId: clinician || undefined,
            });

            if (!result.ok) {
                setFieldErrors(result.fieldErrors ?? {});
                if (!result.fieldErrors) toast.error(result.error);
                return;
            }

            setBooking({ ...result.data, signature });
            handleRetry();
            if (!mpesaPhone) setMpesaPhone(toLocalDigits(clientPhone));
            setStep("pay");
        } finally {
            setCreatingBooking(false);
        }
    };

    const pollUntilSettled = useCallback(
        (reference: string) => {
            stopPolling();
            const deadline = Date.now() + POLL_TIMEOUT_MS;
            setSecondsLeft(Math.round(POLL_TIMEOUT_MS / 1000));

            pollRef.current = setInterval(async () => {
                if (Date.now() >= deadline) {
                    stopPolling();
                    setBusy(false);
                    setTimedOut(true);
                    setSecondsLeft(0);
                    return;
                }

                setSecondsLeft(Math.max(0, Math.round((deadline - Date.now()) / 1000)));

                let status: StatusResponse;
                try {
                    const response = await fetch(`/api/payments/status/${reference}`, {
                        cache: "no-store",
                    });
                    if (!response.ok) return;
                    status = (await response.json()) as StatusResponse;
                } catch {
                    return;
                }

                if (status.status === "PAID") {
                    stopPolling();
                    setBusy(false);
                    setPaidAmountKes(status.settledAmountKes ?? status.amountKes);
                    setStep("done");
                    return;
                }

                if (status.status === "FAILED" || status.status === "CANCELLED") {
                    stopPolling();
                    setBusy(false);
                    setPending(null);
                    setIdempotencyKey(crypto.randomUUID());
                    setPayError(
                        status.failureReason ??
                            (status.status === "CANCELLED"
                                ? "The payment was cancelled."
                                : "The payment did not go through."),
                    );
                }
            }, POLL_INTERVAL_MS);
        },
        [stopPolling],
    );

    const initiatePayment = async (
        method: "MPESA" | "CARD",
        phone?: string,
    ): Promise<InitiateResponse | null> => {
        if (!booking) return null;

        const response = await fetch("/api/payments/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                method,
                bookingId: booking.bookingId,
                phone,
                email: clientEmail,
                name: clientName,
                idempotencyKey,
            }),
        });

        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
            const message =
                payload && typeof payload === "object" && "error" in payload
                    ? String((payload as { error: unknown }).error)
                    : "Could not start payment. Please try again.";
            throw new Error(message);
        }

        return payload as InitiateResponse;
    };

    const handlePayment = async () => {
        if (busy || !booking) return;

        setPayError(null);
        setTimedOut(false);

        if (paymentMethod === "mpesa") {
            if (mpesaPhone.length !== 9) {
                setPayError("Enter a valid 9-digit M-Pesa number");
                return;
            }

            setBusy(true);
            try {
                const result = await initiatePayment("MPESA", `254${mpesaPhone}`);
                if (!result) return;

                if (result.status === "PAID") {
                    setPaidAmountKes(result.amountKes);
                    setBusy(false);
                    setStep("done");
                    return;
                }

                setPending({
                    reference: result.reference,
                    amountKes: result.amountKes,
                    message: result.customerMessage ?? null,
                });
                pollUntilSettled(result.reference);
            } catch (error) {
                setBusy(false);
                toast.error(
                    error instanceof Error ? error.message : "Could not start payment",
                );
            }
            return;
        }

        if (paymentMethod === "card") {
            setBusy(true);
            try {
                const result = await initiatePayment("CARD");
                if (!result) return;

                if (!result.redirectUrl) {
                    throw new Error("The card provider did not return a checkout link.");
                }

                window.location.href = result.redirectUrl;
            } catch (error) {
                setBusy(false);
                toast.error(
                    error instanceof Error ? error.message : "Could not start payment",
                );
            }
            return;
        }

        if (!bankRef.trim()) {
            setPayError("Enter the bank reference from your transfer slip");
            return;
        }

        setBusy(true);
        const result = await recordBankTransfer({
            bookingId: booking.bookingId,
            bankReference: bankRef.trim(),
        });
        setBusy(false);

        if (!result.ok) {
            setPayError(result.error);
            return;
        }

        setPaidAmountKes(result.data.amountKes);
        setStep("done");
    };

    const handleRetry = () => {
        stopPolling();
        setPending(null);
        setPayError(null);
        setTimedOut(false);
        setBusy(false);
        setSecondsLeft(0);
        setIdempotencyKey(crypto.randomUUID());
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
                    services.length === 0 ? (
                        <EmptyServicesState />
                    ) : (
                        <ServiceStep
                            services={services}
                            selectedService={selectedService}
                            onSelectService={setSelectedService}
                            onNext={handleServiceNext}
                        />
                    )
                )}

                {step === "time" && (
                    <TimeStep
                        clinicians={clinicians}
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
                        fieldErrors={fieldErrors}
                        busy={creatingBooking}
                        onBack={() => setStep("time")}
                        onNext={handleIntakeNext}
                    />
                )}

                {step === "pay" && selectedService && selectedDate && booking && (
                    <PaymentStep
                        service={selectedService}
                        booking={booking}
                        date={selectedDate}
                        time={selectedTime}
                        clientName={clientName}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={(method) => {
                            handleRetry();
                            setPaymentMethod(method);
                        }}
                        availableMethods={paymentMethods}
                        mpesaPhone={mpesaPhone}
                        setMpesaPhone={setMpesaPhone}
                        bankRef={bankRef}
                        setBankRef={setBankRef}
                        proofFile={proofFile}
                        setProofFile={setProofFile}
                        busy={busy}
                        pending={pending}
                        secondsLeft={secondsLeft}
                        timedOut={timedOut}
                        payError={payError}
                        onRetry={handleRetry}
                        onBack={() => setStep("intake")}
                        onPay={handlePayment}
                    />
                )}

                {step === "done" && selectedService && selectedDate && (
                    <ConfirmationStep
                        clientName={clientName}
                        date={selectedDate}
                        time={selectedTime}
                        method={paymentMethod}
                        reference={booking?.reference ?? null}
                        commitmentFee={
                            paidAmountKes ?? booking?.depositKes ?? 0
                        }
                    />
                )}
            </div>
        </section>
    );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function ServiceStep({
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
                                            {service.depositKes.toLocaleString()})
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

function EmptyServicesState() {
    return (
        <div className="rounded-2xl border-2 border-border bg-background p-8 text-center shadow-sm">
            <h2 className="font-serif text-2xl text-primary-deep">
                Booking is being set up
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Therapy sessions are not listed yet. Email us and we will get you a
                slot, or check back shortly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a href="mailto:hello@recrogroup.org" className="btn-primary">
                    Email hello@recrogroup.org
                </a>
                <Link href="/contact" className="btn-secondary">
                    Contact us
                </Link>
            </div>
        </div>
    );
}

function TimeStep({
    clinicians,
    clinician,
    setClinician,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    availableDates,
    timeSlots,
    onBack,
    onNext,
}: {
    clinicians: ClinicianOption[];
    clinician: string;
    setClinician: (c: string) => void;
    selectedDate: Date | null;
    setSelectedDate: (d: Date) => void;
    selectedTime: string;
    setSelectedTime: (t: string) => void;
    availableDates: Date[];
    timeSlots: string[];
    onBack: () => void;
    onNext: () => void;
}) {
    const weekdayLabel = selectedDate
        ? selectedDate.toLocaleDateString("en-US", { weekday: "long" })
        : null;

    return (
        <div className="space-y-6">
            {clinicians.length > 0 && (
            <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                    Clinician
                </label>
                <div className="space-y-3">
                    {clinicians.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setClinician(c.id)}
                            className={`w-full flex items-center gap-4 text-left rounded-2xl border-2 p-4 transition bg-background shadow-sm ${clinician === c.id
                                ? "border-primary"
                                : "border-border hover:border-primary/50"
                                }`}
                        >
                            <Image
                                src={c.photo}
                                alt={c.name}
                                width={56}
                                height={56}
                                className="rounded-full object-cover w-14 h-14"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{c.name}</h3>
                                <p className="text-sm text-muted-foreground">{c.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {c.specialties.join(", ")}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            )}
            <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                    Select Date (Next 14 Days)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableDates.map((date) => {
                        const isSelected =
                            selectedDate?.toDateString() === date.toDateString();
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={`rounded-xl border-2 p-3 text-center text-sm transition bg-background shadow-sm ${isSelected
                                    ? "border-primary"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="font-semibold">{date.getDate()}</div>
                                <div className="text-xs mt-1">
                                    {date.toLocaleDateString("en-US", { month: "short" })}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                        Select Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`rounded-xl border-2 px-3 py-2 text-sm font-medium transition bg-background shadow-sm ${isSelected
                                        ? "border-primary"
                                        : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                    {selectedTime && weekdayLabel && (
                        <p className="mt-4 rounded-2xl border border-border bg-primary-soft/60 px-4 py-3 text-sm leading-relaxed text-foreground">
                            This becomes your permanent slot: every{" "}
                            <strong>
                                {weekdayLabel} at {selectedTime}
                            </strong>{" "}
                            is reserved for you until your sessions finish. Our office
                            manager will reopen the slot once it is available again.
                        </p>
                    )}
                </div>
            )}

            {/* In-person only + diaspora note */}
            <div className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
                        <MapPin size={18} />
                    </span>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            In-person sessions only
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            Online calendar booking is for clinic visits in Nairobi.
                            Diaspora clients should email or contact us to arrange
                            support — online booking is not available for remote
                            clients.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                            <a
                                href="mailto:hello@recrogroup.org"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep"
                            >
                                <Mail size={14} /> hello@recrogroup.org
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep"
                            >
                                Contact us <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedDate || !selectedTime || (clinicians.length > 0 && !clinician)}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

function IntakeStep({
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPhone,
    setClientPhone,
    notes,
    setNotes,
    fieldErrors,
    busy,
    onBack,
    onNext,
}: {
    clientName: string;
    setClientName: (v: string) => void;
    clientEmail: string;
    setClientEmail: (v: string) => void;
    clientPhone: string;
    setClientPhone: (v: string) => void;
    notes: string;
    setNotes: (v: string) => void;
    fieldErrors: Record<string, string[]>;
    busy: boolean;
    onBack: () => void;
    onNext: () => void;
}) {
    const formError = fieldErrors._form?.[0];
    const scheduleError =
        fieldErrors.preferredDate?.[0] ??
        fieldErrors.preferredTime?.[0] ??
        fieldErrors.serviceSlug?.[0];

    return (
        <div className="space-y-6">
            <div className="bg-background rounded-2xl border-2 border-border p-7 md:p-9 shadow-sm">
                <div className="space-y-4">
                    <Field
                        label="Full name *"
                        value={clientName}
                        onChange={setClientName}
                        placeholder="Jane Doe"
                        error={fieldErrors.clientName?.[0]}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                            label="Email *"
                            type="email"
                            value={clientEmail}
                            onChange={setClientEmail}
                            placeholder="jane@example.com"
                            error={fieldErrors.clientEmail?.[0]}
                        />
                        <Field
                            label="Phone *"
                            value={clientPhone}
                            onChange={setClientPhone}
                            placeholder="+254 7XX XXX XXX"
                            error={fieldErrors.clientPhone?.[0]}
                        />
                    </div>

                    <div>
                        <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                            What brings you here? (optional)
                        </label>
                        <textarea
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Share anything you'd like your therapist to know before your first session..."
                            className="mt-2 w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                        />
                        {fieldErrors.notes?.[0] && (
                            <p className="mt-2 text-xs text-red-500">
                                {fieldErrors.notes[0]}
                            </p>
                        )}
                    </div>

                    {(formError || scheduleError) && (
                        <p className="text-sm text-red-500">
                            {formError ?? scheduleError}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={onNext}
                    disabled={
                        busy ||
                        !clientName.trim() ||
                        !clientEmail.trim() ||
                        !clientPhone.trim()
                    }
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {busy ? (
                        <>
                            <Loader2 size={16} className="animate-spin" /> Saving...
                        </>
                    ) : (
                        <>
                            Continue to Payment <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function PaymentStep({
    service,
    booking,
    date,
    time,
    clientName,
    paymentMethod,
    setPaymentMethod,
    availableMethods,
    mpesaPhone,
    setMpesaPhone,
    bankRef,
    setBankRef,
    proofFile,
    setProofFile,
    busy,
    pending,
    secondsLeft,
    timedOut,
    payError,
    onRetry,
    onBack,
    onPay,
}: {
    service: ServiceOption;
    booking: BookingRecord;
    date: Date;
    time: string;
    clientName: string;
    paymentMethod: PaymentMethodKey;
    setPaymentMethod: (m: PaymentMethodKey) => void;
    availableMethods: PaymentMethodKey[];
    mpesaPhone: string;
    setMpesaPhone: (v: string) => void;
    bankRef: string;
    setBankRef: (v: string) => void;
    proofFile: File | null;
    setProofFile: (f: File | null) => void;
    busy: boolean;
    pending: { reference: string; amountKes: number; message: string | null } | null;
    secondsLeft: number;
    timedOut: boolean;
    payError: string | null;
    onRetry: () => void;
    onBack: () => void;
    onPay: () => void;
}) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const commitmentFee = pending?.amountKes ?? booking.depositKes;
    const balanceDue = Math.max(0, booking.totalKes - commitmentFee);
    const weekdayLabel = date.toLocaleDateString("en-US", { weekday: "long" });
    const waiting = busy && pending !== null && !timedOut;

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 bg-background rounded-2xl border-2 border-border p-7 shadow-sm">
                <h2 className="font-serif text-2xl font-semibold text-primary-deep mb-2">
                    Commitment fee
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    Pay half the session fee now to secure your slot. The remaining
                    balance is paid when you attend your session.
                </p>

                {waiting && (
                    <div className="mb-6 rounded-2xl border-2 border-primary bg-primary-soft/60 p-6">
                        <div className="flex items-start gap-3">
                            <Loader2
                                size={20}
                                className="mt-0.5 shrink-0 animate-spin text-primary-deep"
                            />
                            <div>
                                <p className="font-semibold text-primary-deep">
                                    Check your phone for the M-Pesa prompt
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-foreground">
                                    {pending?.message ??
                                        `Enter your M-Pesa PIN to pay Ksh ${commitmentFee.toLocaleString()}. Keep this page open.`}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Waiting for confirmation · {formatCountdown(secondsLeft)}{" "}
                                    remaining · Ref {pending?.reference}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {timedOut && pending && (
                    <div className="mb-6 rounded-2xl border-2 border-amber-500/60 bg-amber-50 p-6 dark:bg-amber-950/30">
                        <p className="font-semibold text-amber-900 dark:text-amber-200">
                            Still waiting on M-Pesa
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                            We haven&apos;t had confirmation yet. If you approved the prompt,
                            it may still come through — we&apos;ll email you once it does.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                            <Link
                                href={`/payments/${pending.reference}`}
                                className="text-sm font-semibold text-primary-deep underline"
                            >
                                Check payment status
                            </Link>
                            <button
                                onClick={onRetry}
                                className="text-sm font-semibold text-primary-deep underline"
                            >
                                Try a different method
                            </button>
                        </div>
                    </div>
                )}

                {payError && (
                    <div className="mb-6 rounded-2xl border-2 border-destructive/40 bg-destructive/5 p-6">
                        <p className="font-semibold text-destructive">
                            Payment did not go through
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground">
                            {payError}
                        </p>
                        <button
                            onClick={onRetry}
                            className="mt-3 text-sm font-semibold text-primary-deep underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Payment Methods */}
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                        Payment Method
                    </label>
                    <div className={`grid gap-3 ${availableMethods.length > 1 ? "sm:grid-cols-3" : ""}`}>
                        {availableMethods.includes("mpesa") && (
                        <MethodCard
                            active={paymentMethod === "mpesa"}
                            onClick={() => setPaymentMethod("mpesa")}
                            icon={<Smartphone size={18} />}
                            title="M-Pesa STK"
                            sub="Instant payment"
                        />
                        )}
                        {availableMethods.includes("card") && (
                        <MethodCard
                            active={paymentMethod === "card"}
                            onClick={() => setPaymentMethod("card")}
                            icon={<CreditCard size={18} />}
                            title="Visa / Mastercard"
                            sub="Secure checkout"
                        />
                        )}
                        {availableMethods.includes("bank") && (
                        <MethodCard
                            active={paymentMethod === "bank"}
                            onClick={() => setPaymentMethod("bank")}
                            icon={<Building2 size={18} />}
                            title="Bank Transfer"
                            sub="Upload slip"
                        />
                        )}
                    </div>
                    {availableMethods.length === 1 && availableMethods[0] === "bank" && (
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            Instant M-Pesa and card checkout are not configured on this
                            environment. Submit a bank transfer and our team will confirm
                            your slot.
                        </p>
                    )}

                    {/* M-Pesa Form */}
                    {paymentMethod === "mpesa" && (
                        <div className="mt-6 space-y-4">
                            <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                                M-Pesa number *
                            </label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none font-medium">
                                    +254
                                </span>
                                <input
                                    value={mpesaPhone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setMpesaPhone(value.slice(0, 9));
                                    }}
                                    placeholder="712345678"
                                    maxLength={9}
                                    inputMode="numeric"
                                    disabled={busy}
                                    className="w-full rounded-2xl border border-border bg-card pl-16 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                                />
                            </div>
                            {mpesaPhone && mpesaPhone.length !== 9 && (
                                <p className="text-xs text-red-500">
                                    Phone number must be exactly 9 digits
                                </p>
                            )}
                            <p className="text-xs rounded-full bg-primary-soft text-primary-deep px-3 py-1.5 inline-block">
                                Buy Goods · Till 747736 · Recro Group Limited
                            </p>
                        </div>
                    )}

                    {/* Card Form */}
                    {paymentMethod === "card" && (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed">
                                You&apos;ll be redirected to Paystack&apos;s secure checkout to
                                complete your commitment fee. Card details are never stored on
                                our servers.
                            </div>
                        </div>
                    )}

                    {/* Bank Transfer Form */}
                    {paymentMethod === "bank" && (
                        <div className="mt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-primary-soft p-4 text-xs leading-relaxed">
                                    <p className="font-semibold text-primary-deep mb-1">
                                        Kenya Shilling Account
                                    </p>
                                    <p>
                                        <strong>Bank:</strong> SBM Bank
                                    </p>
                                    <p>
                                        <strong>Account name:</strong> Recro Group Limited
                                    </p>
                                    <p>
                                        <strong>Account number:</strong> 0182074946001
                                    </p>
                                    <p>
                                        <strong>Swift:</strong> CKENKENA
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-surface p-4 text-xs leading-relaxed border border-border">
                                    <p className="font-semibold text-primary-deep mb-1">
                                        USD Account
                                    </p>
                                    <p>
                                        <strong>Bank:</strong> SBM Bank
                                    </p>
                                    <p>
                                        <strong>Account name:</strong> Recro Group Limited
                                    </p>
                                    <p>
                                        <strong>Account number:</strong> 0182074946003
                                    </p>
                                    <p>
                                        <strong>Swift:</strong> SBMKKENA
                                    </p>
                                </div>
                            </div>
                            <Field
                                label="Bank reference / slip number *"
                                value={bankRef}
                                onChange={setBankRef}
                                placeholder="e.g. TXN20260620-9381"
                            />
                            <label className="block">
                                <span className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                                    Proof of payment (PDF or image)
                                </span>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                                    className="mt-2 block w-full text-sm"
                                />
                                {proofFile && (
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                        {proofFile.name} selected — please also email it to
                                        hello@recrogroup.org so we can match it to your booking.
                                    </span>
                                )}
                            </label>
                            <p className="rounded-2xl bg-surface px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                                Bank transfers are verified manually. Your booking is saved
                                under reference{" "}
                                <strong className="text-foreground">{booking.reference}</strong>{" "}
                                and confirmed once our team matches your payment.
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                    <button
                        onClick={onBack}
                        disabled={busy}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button
                        onClick={onPay}
                        disabled={busy}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {busy ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />{" "}
                                {waiting ? "Waiting for M-Pesa..." : "Processing..."}
                            </>
                        ) : paymentMethod === "bank" ? (
                            <>
                                <Building2 size={16} /> Submit transfer details
                            </>
                        ) : (
                            <>
                                <CreditCard size={16} /> Pay Ksh{" "}
                                {commitmentFee.toLocaleString()} commitment
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
                <div className="rounded-2xl border-2 border-border bg-background p-6 sticky top-6 shadow-sm">
                    <h3 className="font-serif text-xl font-semibold mb-4">
                        Booking Summary
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                            <Image
                                src={service.icon}
                                alt={service.title}
                                width={32}
                                height={32}
                                className="shrink-0 mt-1"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{service.title}</p>
                                <p className="text-muted-foreground text-xs mt-1">
                                    {service.duration}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar size={14} className="shrink-0" />
                                <span>{formatDate(date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock size={14} className="shrink-0" />
                                <span>{time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin size={14} className="shrink-0" />
                                <span>In-Person</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User size={14} className="shrink-0" />
                                <span>{clientName || "—"}</span>
                            </div>
                        </div>
                        <p className="rounded-xl bg-surface px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                            Permanent slot: every{" "}
                            <strong className="text-foreground">
                                {weekdayLabel} at {time}
                            </strong>{" "}
                            until your sessions finish.
                        </p>
                        <div className="pt-4 border-t border-border space-y-2">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Session fee</span>
                                <span>Ksh {booking.totalKes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Balance at session</span>
                                <span>Ksh {balanceDue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-border">
                                <span>Due now</span>
                                <span>Ksh {commitmentFee.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConfirmationStep({
    clientName,
    date,
    time,
    method,
    reference,
    commitmentFee,
}: {
    clientName: string;
    date: Date;
    time: string;
    method: PaymentMethodKey;
    reference: string | null;
    commitmentFee: number;
}) {
    const weekdayLabel = date.toLocaleDateString("en-US", { weekday: "long" });
    const isManual = method === "bank";

    return (
        <div className="text-center py-14 rounded-3xl border border-border bg-card max-w-2xl mx-auto px-6">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                <Check size={32} />
            </span>
            <h2 className="mt-6 font-serif text-3xl font-semibold">
                {isManual ? "Booking Received!" : "Booking Confirmed!"}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto leading-relaxed">
                {isManual ? (
                    <>
                        Thank you, {clientName}. Your booking is saved and our team will
                        confirm it once we match your bank transfer of{" "}
                        <strong className="text-foreground">
                            Ksh {commitmentFee.toLocaleString()}
                        </strong>
                        .
                    </>
                ) : (
                    <>
                        Thank you, {clientName}. Your commitment fee of{" "}
                        <strong className="text-foreground">
                            Ksh {commitmentFee.toLocaleString()}
                        </strong>{" "}
                        is recorded. Please pay the remaining balance when you attend your
                        session.
                    </>
                )}
            </p>
            {reference && (
                <p className="mt-3 text-sm text-muted-foreground">
                    Booking reference{" "}
                    <strong className="font-mono text-foreground">{reference}</strong>
                </p>
            )}
            <p className="mt-4 max-w-md mx-auto rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-foreground">
                Your permanent slot is every{" "}
                <strong>
                    {weekdayLabel} at {time}
                </strong>
                . It stays reserved for you until your sessions finish.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/" className="btn-primary">
                    Back to Home
                </Link>
                <Link href="/services" className="btn-secondary">
                    View All Services
                </Link>
            </div>
        </div>
    );
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function MethodCard({
    active,
    onClick,
    icon,
    title,
    sub,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
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

function Field({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    error?: string;
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
                aria-invalid={error ? true : undefined}
                className={`mt-2 w-full rounded-2xl border bg-card px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${error ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                    }`}
            />
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function toDateOnly(date: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toLocalDigits(phone: string) {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("254")) return digits.slice(3, 12);
    if (digits.startsWith("0")) return digits.slice(1, 10);
    return digits.slice(0, 9);
}

function formatCountdown(seconds: number) {
    const mins = Math.floor(seconds / 60);
    return `${mins}:${String(seconds % 60).padStart(2, "0")}`;
}
