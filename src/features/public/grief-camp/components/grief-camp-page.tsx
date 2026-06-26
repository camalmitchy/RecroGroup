import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Check,
  Download,
  HandHeart,
  Landmark,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <Card
      className={`group relative aspect-[4/3] overflow-hidden rounded-2xl p-0 shadow-sm transition-shadow hover:shadow-md ${className ?? ""}`}
    >
      <div className="relative size-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 text-center">
        <p className="text-xs font-semibold text-background drop-shadow-lg lg:text-sm">
          {title}
        </p>
      </div>
    </Card>
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
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-foreground/50 via-foreground/30 to-foreground/20" />
        <div className="relative z-10">
          <div className="container-page flex min-h-[500px] items-center py-16 lg:min-h-[600px] lg:py-20">
            <div className="max-w-xl pt-24 md:pt-32">
              <Badge
                variant="outline"
                className="rounded-full border-background/30 bg-background/20 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-background uppercase backdrop-blur-sm"
              >
                Grief Camp 2026
              </Badge>
              <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-background drop-shadow-lg md:text-6xl">
                A safe place to
                <br />
                grieve out loud.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-background/95 drop-shadow">
                Loss is not a problem to be solved. It is a passage to be walked
                — with company, with kindness, and with time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-6 shadow-md"
                >
                  <Link href="/join-us">
                    Apply for Grief Camp
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="rounded-full border border-background/40 bg-background/20 px-6 text-background backdrop-blur-sm hover:bg-background/30"
                >
                  <a href="#">
                    <Download className="size-4" />
                    Download Flyer
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page bg-background py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Badge variant="secondary" className="rounded-full">
              The experience
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
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
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm">{item}</span>
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

        <Card className="mt-14 rounded-3xl bg-muted/50 p-6 shadow-sm md:p-8">
          <div className="grid gap-6 md:grid-cols-4">
            {infoStrip.map(({ title, body }, index) => {
              const Icon = infoIcons[index];
              return (
                <div key={title} className="flex gap-0 md:px-6 md:first:pl-0 md:last:pr-0">
                  {index > 0 && (
                    <Separator
                      orientation="vertical"
                      className="mr-6 hidden md:block"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="size-[18px] text-primary" />
                      <p className="text-sm font-semibold">{title}</p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container-page">
          <Card className="mx-auto max-w-3xl rounded-3xl p-8 text-center shadow-md lg:p-10">
            <CardHeader className="items-center px-0">
              <div className="mb-2 text-5xl font-serif text-primary/20">
                &ldquo;
              </div>
              <blockquote className="font-serif text-lg leading-relaxed md:text-xl">
                Camp gave my daughter friends who understood without her having
                to explain. It gave me hope.
              </blockquote>
            </CardHeader>
            <CardContent className="px-0">
              <div className="flex justify-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-xl">
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold">Parent of camper</p>
              <p className="text-xs text-muted-foreground">Grief Camp family</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="pricing" className="container-page bg-background pb-16">
        <div className="text-center">
          <Badge variant="secondary" className="rounded-full">
            Registration
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            2026 Pricing
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          {pricingBlocks.map((block) => (
            <Card key={block.title} className="rounded-3xl p-7 shadow-md">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-base text-primary">
                  <UserRound className="size-[18px] text-primary" />
                  {block.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <ul className="divide-y divide-border">
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
                      <span className="text-base font-semibold text-primary">
                        {tier.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Fees cover accommodation, meals, activities, materials and
          professional support.
        </p>
      </section>

      <section className="container-page bg-background pb-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Payment Options
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card className="rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex-row items-center justify-between px-0">
              <CardTitle className="text-sm">M-PESA</CardTitle>
              <Wallet className="size-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-1.5 px-0 text-xs leading-relaxed text-muted-foreground">
              <p>Buy Goods and Services</p>
              <p>
                <span className="font-semibold text-foreground">
                  Till number:
                </span>{" "}
                747736
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex-row items-center justify-between px-0">
              <CardTitle className="text-sm">Bank Transfer (KES)</CardTitle>
              <Landmark className="size-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-1.5 px-0 text-xs leading-relaxed text-muted-foreground">
              <p>SBM Bank · Recro Group Limited</p>
              <p>Acc: 0182074946003 · Code 60 · Branch 018</p>
              <p>
                <span className="font-semibold text-foreground">Swift:</span>{" "}
                SBMKKENA ·{" "}
                <span className="font-semibold text-foreground">Ref:</span> GRIEF
                CAMP
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex-row items-center justify-between px-0">
              <CardTitle className="text-sm">USD Account</CardTitle>
              <Landmark className="size-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-1.5 px-0 text-xs leading-relaxed text-muted-foreground">
              <p>SBM Bank · Recro Group Limited</p>
              <p>Acc: 0182074946003 · Code 60 · Branch 018</p>
              <p>
                <span className="font-semibold text-foreground">Swift:</span>{" "}
                CKENKENA ·{" "}
                <span className="font-semibold text-foreground">Ref:</span> GRIEF
                CAMP
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 rounded-3xl bg-muted/50 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex flex-1 items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-sm">
                <HandHeart className="size-6" />
              </span>
              <div>
                <h3 className="font-serif text-xl font-semibold text-primary">
                  Sponsor a Child
                </h3>
                <CardDescription className="mt-1 max-w-xl text-sm leading-relaxed">
                  Your generosity can give a grieving child the chance to heal,
                  grow and remember they are not alone.
                </CardDescription>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="shrink-0 self-start rounded-full md:self-auto"
            >
              <Link href="/contact">
                Learn about Sponsorship
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
}
