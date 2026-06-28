import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Download,
  HandHeart,
  Landmark,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import {
  infoStrip,
  journeyChecklist,
  journeyPillars,
  pricingBlocks,
} from "../data";

const infoIcons = [Users, Calendar, Wallet, UserRound] as const;

function JourneyImageCard({
  title,
  image,
  className,
}: {
  title: string;
  image: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/30 bg-surface/60 transition-shadow hover:shadow-sm ${className ?? ""}`}
    >
      <div className="relative size-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 text-center">
        <p className="text-xs font-semibold text-white drop-shadow-lg lg:text-sm">
          {title}
        </p>
      </div>
    </div>
  );
}

export function GriefCampPage() {
  return (
    <>
      <section className="relative min-h-[500px] overflow-hidden bg-surface lg:min-h-[600px]">
        <Image
          src="/assets/grief-cam.png"
          alt="Adolescents sitting in a circle at sunset"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-black/30 to-black/20" />
        <div className="relative z-10">
          <div className="container-page flex min-h-[500px] items-center py-16 lg:min-h-[600px] lg:py-20">
            <div className="max-w-xl pt-24 md:pt-32">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                Grief Camp 2026
              </span>
              <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-white drop-shadow-lg md:text-6xl">
                A safe place to
                <br />
                grieve out loud.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/95 drop-shadow">
                Loss is not a problem to be solved. It is a passage to be walked
                — with company, with kindness, and with time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/join-us" className="btn-primary">
                  Apply for Grief Camp <ArrowRight size={16} />
                </Link>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/20 px-6 py-2.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
                >
                  <Download size={16} /> Download Flyer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page bg-background py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
              Understanding the Journey
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Grief can feel isolating, especially for teens. Our camp provides
              a structured yet gentle environment where adolescents can process
              their feelings without pressure.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Led by specialised grief counsellors, the weekend balances
              therapeutic activities with traditional camp fun, allowing teens
              to be themselves while connecting with peers who truly understand.
            </p>
            <ul className="mt-8 space-y-3">
              {journeyChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="space-y-3 lg:space-y-4">
                <JourneyImageCard
                  title={journeyPillars[0].title}
                  image={journeyPillars[0].image}
                />
                <JourneyImageCard
                  title={journeyPillars[2].title}
                  image={journeyPillars[2].image}
                  className="mt-4 lg:mt-6"
                />
              </div>
              <div className="space-y-3 lg:space-y-4">
                <JourneyImageCard
                  title={journeyPillars[1].title}
                  image={journeyPillars[1].image}
                  className="mt-2 lg:mt-3"
                />
                <JourneyImageCard
                  title={journeyPillars[3].title}
                  image={journeyPillars[3].image}
                  className="mt-4 lg:mt-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 rounded-3xl border border-border bg-muted/50 p-6 md:grid-cols-4 md:divide-x md:divide-border md:p-8">
          {infoStrip.map(({ title, body }, index) => {
            const Icon = infoIcons[index];
            return (
              <div
                key={title}
                className="md:px-6 md:first:pl-0 md:last:pr-0"
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)] lg:p-10">
              <div className="mb-6 font-serif text-5xl text-primary/20">
                &ldquo;
              </div>
              <blockquote className="font-serif text-lg leading-relaxed text-foreground md:text-xl">
                Camp gave my daughter friends who understood without her having
                to explain. It gave me hope.
              </blockquote>
              <div className="mt-6 flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-xl">
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">
                Parent of camper
              </p>
              <p className="text-xs text-muted-foreground">Grief Camp family</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="container-page bg-background pb-16">
        <h2 className="text-center font-serif text-3xl text-primary-deep md:text-4xl">
          2026 Pricing
        </h2>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          {pricingBlocks.map((block) => (
            <div
              key={block.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
            >
              <h3 className="flex items-center gap-2 text-base font-semibold text-primary-deep">
                <UserRound size={18} className="text-primary" /> {block.title}
              </h3>
              <ul className="mt-5 divide-y divide-border">
                {block.tiers.map((tier) => (
                  <li
                    key={tier.label}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">{tier.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {tier.deadline}
                      </p>
                    </div>
                    <span className="text-base font-semibold text-primary-deep">
                      {tier.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Fees cover accommodation, meals, activities, materials and
          professional support.
        </p>
      </section>

      <section className="container-page bg-background pb-16">
        <h2 className="text-center font-serif text-3xl text-primary-deep md:text-4xl">
          Payment Options
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <PaymentCard
            title="M-PESA"
            icon={Wallet}
            lines={[
              "Buy Goods and Services",
              <>
                <span className="font-semibold">Till number:</span> 747736
              </>,
            ]}
          />
          <PaymentCard
            title="Bank Transfer (KES)"
            icon={Landmark}
            lines={[
              "SBM Bank · Recro Group Limited",
              "Acc: 0182074946003 · Code 60 · Branch 018",
              <>
                <span className="font-semibold">Swift:</span> SBMKKENA ·{" "}
                <span className="font-semibold">Ref:</span> GRIEF CAMP
              </>,
            ]}
          />
          <PaymentCard
            title="USD Account"
            icon={Landmark}
            lines={[
              "SBM Bank · Recro Group Limited",
              "Acc: 0182074946003 · Code 60 · Branch 018",
              <>
                <span className="font-semibold">Swift:</span> CKENKENA ·{" "}
                <span className="font-semibold">Ref:</span> GRIEF CAMP
              </>,
            ]}
          />
        </div>

        <div className="mt-8 flex flex-col gap-6 rounded-3xl border border-border bg-muted/50 p-6 md:flex-row md:items-center md:p-8">
          <div className="flex flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card">
              <HandHeart size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-primary-deep">
                Sponsor a Child
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Your generosity can give a grieving child the chance to heal,
                grow and remember they are not alone.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="btn-secondary inline-flex shrink-0 self-start md:self-auto"
          >
            Learn about Sponsorship <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

function PaymentCard({
  title,
  icon: Icon,
  lines,
}: {
  title: string;
  icon: typeof Wallet;
  lines: React.ReactNode[];
}) {
  return (
    <div className="card-lift rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <Icon size={20} className="text-primary" />
      </div>
      <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
