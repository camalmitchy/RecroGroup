"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Calendar,
    Clock,
    User,
    Video,
    MapPin,
    FileText,
    CreditCard,
    Check,
    ArrowLeft,
    ArrowRight,
    Smartphone,
    Building2,
    Loader2,
    Upload,
} from "lucide-react";

type Step = "service" | "time" | "intake" | "pay" | "done";

type ServiceOption = {
    key: string;
    title: string;
    duration: string;
    icon: string;
    price: number;
};

const SERVICES: ServiceOption[] = [
    {
        key: "individual",
        title: "Individual Therapy",
        duration: "50 min",
        icon: "/assets/icons/individual-therapy.svg",
        price: 5000,
    },
    {
        key: "couples",
        title: "Couples Therapy",
        duration: "50 min",
        icon: "/assets/icons/couples-therapy.svg",
        price: 7500,
    },
    {
        key: "family",
        title: "Family Therapy",
        duration: "50 min",
        icon: "/assets/icons/family-therapy.svg",
        price: 8000,
    },
    {
        key: "group",
        title: "Group Therapy",
        duration: "2 hrs",
        icon: "/assets/icons/group-therapy.svg",
        price: 3500,
    },
    {
        key: "children",
        title: "Grief Camp",
        duration: "3 days",
        icon: "/assets/icons/grief-camp.svg",
        price: 15000,
    },
    {
        key: "corporate",
        title: "Corporate Speaking",
        duration: "2+ hrs",
        icon: "/assets/icons/corporate-speaking.svg",
        price: 25000,
    },
];

const CLINICIANS = [
    {
        id: "dr-karume",
        name: "Dr. Michelle Karume",
        title: "Founder & Licensed Psychotherapist",
        photo: "/assets/founder-portrait.jpg",
        specialties: ["Grief & Loss", "Family Systems", "Trauma"],
    },
];

// Generate time slots (9 AM to 5 PM, hourly)
const TIME_SLOTS = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
});

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
    const [sessionMode, setSessionMode] = useState<"in-person" | "video">("in-person");

    // Intake step
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [notes, setNotes] = useState("");

    // Payment step
    const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | "bank">("mpesa");
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

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-primary-deep text-white py-20">
                <div className="container-page text-center">
                    <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary-soft">
                        Therapy Booking
                    </span>
                    <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl">
                        Book a Session
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white/90">
                        Schedule your appointment in just a few steps.
                    </p>
                </div>
            </section>

            {/* Progress Steps */}
            <section className="bg-surface border-b border-border py-6">
                <div className="container-page">
                    <div className="flex items-center justify-center gap-2">
                        {[
                            { key: "service", label: "Service" },
                            { key: "time", label: "Time" },
                            { key: "intake", label: "Intake" },
                            { key: "pay", label: "Pay" },
                        ].map((s, idx) => (
                            <div key={s.key} className="flex items-center">
                                <div
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === s.key
                                        ? "bg-primary text-primary-foreground"
                                        : ["service", "time", "intake", "pay"].indexOf(step) >
                                            idx
                                            ? "bg-primary-soft text-primary-deep"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    <span className="font-semibold">{idx + 1}</span>
                                    <span className="hidden sm:inline">{s.label}</span>
                                </div>
                                {idx < 3 && (
                                    <ArrowRight
                                        size={16}
                                        className="mx-1 text-muted-foreground"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container-page py-14 max-w-5xl">
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
                        sessionMode={sessionMode}
                        setSessionMode={setSessionMode}
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
                        sessionMode={sessionMode}
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

                {step === "done" && (
                    <ConfirmationStep clientName={clientName} />
                )}
            </section>
        </>
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
            <div>
                <h2 className="font-serif text-3xl font-semibold text-primary-deep">
                    Select a Service
                </h2>
                <p className="mt-2 text-muted-foreground">
                    Choose the type of therapy or service you'd like to book.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => {
                    const isSelected = selectedService?.key === service.key;
                    return (
                        <button
                            key={service.key}
                            onClick={() => onSelectService(service)}
                            className={`text-left rounded-2xl border p-6 transition ${isSelected
                                ? "border-primary ring-2 ring-primary bg-background"
                                : "border-border bg-card hover:border-primary"
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
                                        {service.duration} · Ksh {service.price.toLocaleString()}
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

function TimeStep({
    clinician,
    setClinician,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    sessionMode,
    setSessionMode,
    availableDates,
    timeSlots,
    onBack,
    onNext,
}: {
    clinician: string;
    setClinician: (c: string) => void;
    selectedDate: Date | null;
    setSelectedDate: (d: Date) => void;
    selectedTime: string;
    setSelectedTime: (t: string) => void;
    sessionMode: "in-person" | "video";
    setSessionMode: (m: "in-person" | "video") => void;
    availableDates: Date[];
    timeSlots: string[];
    onBack: () => void;
    onNext: () => void;
}) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-serif text-3xl font-semibold text-primary-deep">
                    Choose Date & Time
                </h2>
                <p className="mt-2 text-muted-foreground">
                    Select your preferred clinician, date, time, and session format.
                </p>
            </div>

            {/* Clinician Selection */}
            <div className="rounded-3xl border border-border bg-card p-6">
                <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground flex items-center gap-2">
                    <User size={14} /> Clinician
                </label>
                <div className="mt-4 space-y-3">
                    {CLINICIANS.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setClinician(c.id)}
                            className={`w-full flex items-center gap-4 text-left rounded-2xl border p-4 transition ${clinician === c.id
                                ? "border-primary ring-2 ring-primary bg-background"
                                : "border-border hover:border-primary"
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

            {/* Date Selection */}
            <div className="rounded-3xl border border-border bg-card p-6">
                <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground flex items-center gap-2">
                    <Calendar size={14} /> Select Date (Next 14 Days)
                </label>
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableDates.map((date) => {
                        const isSelected =
                            selectedDate?.toDateString() === date.toDateString();
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={`rounded-xl border p-3 text-center text-sm transition ${isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary"
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
                <div className="rounded-3xl border border-border bg-card p-6">
                    <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground flex items-center gap-2">
                        <Clock size={14} /> Select Time
                    </label>
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border hover:border-primary"
                                        }`}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Session Mode */}
            <div className="rounded-3xl border border-border bg-card p-6">
                <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground flex items-center gap-2">
                    Session Format
                </label>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    <button
                        onClick={() => setSessionMode("in-person")}
                        className={`text-left rounded-2xl border p-5 transition ${sessionMode === "in-person"
                            ? "border-primary ring-2 ring-primary bg-background"
                            : "border-border hover:border-primary"
                            }`}
                    >
                        <div className="flex items-center gap-2.5 font-semibold">
                            <MapPin size={18} /> In-Person
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Visit our clinic in Nairobi
                        </p>
                    </button>
                    <button
                        onClick={() => setSessionMode("video")}
                        className={`text-left rounded-2xl border p-5 transition ${sessionMode === "video"
                            ? "border-primary ring-2 ring-primary bg-background"
                            : "border-border hover:border-primary"
                            }`}
                    >
                        <div className="flex items-center gap-2.5 font-semibold">
                            <Video size={18} /> Video Call
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Secure online session
                        </p>
                    </button>
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
                    disabled={!selectedDate || !selectedTime}
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
    onBack: () => void;
    onNext: () => void;
}) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-serif text-3xl font-semibold text-primary-deep flex items-center gap-2">
                    <FileText size={28} /> Your Details
                </h2>
                <p className="mt-2 text-muted-foreground">
                    Tell us a bit about yourself and what you'd like to work on.
                </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 md:p-9">
                <div className="space-y-4">
                    <Field
                        label="Full name *"
                        value={clientName}
                        onChange={setClientName}
                        placeholder="Jane Doe"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                            label="Email *"
                            type="email"
                            value={clientEmail}
                            onChange={setClientEmail}
                            placeholder="jane@example.com"
                        />
                        <Field
                            label="Phone"
                            value={clientPhone}
                            onChange={setClientPhone}
                            placeholder="+254 7XX XXX XXX"
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
                    disabled={!clientName.trim() || !clientEmail.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Payment <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

function PaymentStep({
    service,
    date,
    time,
    sessionMode,
    clientName,
    paymentMethod,
    setPaymentMethod,
    mpesaPhone,
    setMpesaPhone,
    bankRef,
    setBankRef,
    proofFile,
    setProofFile,
    busy,
    onBack,
    onPay,
}: {
    service: ServiceOption;
    date: Date;
    time: string;
    sessionMode: string;
    clientName: string;
    paymentMethod: "mpesa" | "card" | "bank";
    setPaymentMethod: (m: "mpesa" | "card" | "bank") => void;
    mpesaPhone: string;
    setMpesaPhone: (v: string) => void;
    bankRef: string;
    setBankRef: (v: string) => void;
    proofFile: File | null;
    setProofFile: (f: File | null) => void;
    busy: boolean;
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

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h2 className="font-serif text-3xl font-semibold text-primary-deep flex items-center gap-2">
                        <CreditCard size={28} /> Payment
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Complete your booking with a secure payment.
                    </p>
                </div>

                {/* Payment Methods */}
                <div className="rounded-3xl border border-border bg-card p-7">
                    <label className="text-[11px] tracking-[0.18em] font-semibold uppercase text-muted-foreground">
                        Payment Method
                    </label>
                    <div className="mt-4 grid sm:grid-cols-3 gap-3">
                        <MethodCard
                            active={paymentMethod === "mpesa"}
                            onClick={() => setPaymentMethod("mpesa")}
                            icon={<Smartphone size={18} />}
                            title="M-Pesa STK"
                            sub="Instant payment"
                        />
                        <MethodCard
                            active={paymentMethod === "card"}
                            onClick={() => setPaymentMethod("card")}
                            icon={<CreditCard size={18} />}
                            title="Visa / Mastercard"
                            sub="Secure checkout"
                        />
                        <MethodCard
                            active={paymentMethod === "bank"}
                            onClick={() => setPaymentMethod("bank")}
                            icon={<Building2 size={18} />}
                            title="Bank Transfer"
                            sub="Upload slip"
                        />
                    </div>

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
                                    className="w-full rounded-2xl border border-border bg-card pl-16 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                You'll be redirected to Pesapal's secure checkout to complete
                                your payment. Card details are never stored on our servers.
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
                                label="Bank reference / slip number"
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
                            </label>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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
                                <Loader2 size={16} className="animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard size={16} /> Complete Booking
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
                <div className="rounded-3xl border border-border bg-card p-6 sticky top-6">
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
                                {sessionMode === "in-person" ? (
                                    <MapPin size={14} className="shrink-0" />
                                ) : (
                                    <Video size={14} className="shrink-0" />
                                )}
                                <span>
                                    {sessionMode === "in-person" ? "In-Person" : "Video Call"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User size={14} className="shrink-0" />
                                <span>{clientName || "—"}</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between text-base font-semibold">
                                <span>Total</span>
                                <span>Ksh {service.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConfirmationStep({ clientName }: { clientName: string }) {
    return (
        <div className="text-center py-14 rounded-3xl border border-border bg-card max-w-2xl mx-auto">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                <Check size={32} />
            </span>
            <h2 className="mt-6 font-serif text-3xl font-semibold">
                Booking Confirmed!
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you, {clientName}. Your booking is confirmed. We've sent a
                confirmation email with all the details and next steps.
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
