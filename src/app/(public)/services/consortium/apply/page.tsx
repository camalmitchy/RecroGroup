import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ConsortiumApplicationForm } from "@/features/public/services/components/consortium-application-form";

export const metadata = {
    title: "Consortium Application | Recro Group",
    description: "Apply for membership in the Recro Group Limited Behavioral Health Consortium",
};

export default function ConsortiumApplicationPage() {
    return (
        <>
            <section className="bg-surface py-16 lg:py-20">
                <div className="container-page">
                    <Link
                        href="/services/consortium"
                        className="inline-flex items-center gap-2 text-sm text-primary-deep/70 transition-colors hover:text-primary-deep"
                    >
                        <ArrowLeft size={16} /> Back to Consortium
                    </Link>

                    <div className="mt-8">
                        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary-deep/60">
                            Professional Network
                        </span>
                        <h1 className="mt-4 font-serif text-4xl text-primary-deep md:text-5xl lg:text-6xl">
                            Apply for Consortium Membership
                        </h1>
                        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                            Join a diverse group of like-minded behavioral health professionals
                            committed to excellence in clinical practice and research.
                        </p>
                    </div>
                </div>
            </section>

            <section className="container-page py-16 lg:py-20">
                <ConsortiumApplicationForm />
            </section>
        </>
    );
}
