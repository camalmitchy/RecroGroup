import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { SiteLogo } from "./site-logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <SiteLogo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Behavioral health and relationship-focused care for individuals,
            couples, families, children and corporate teams.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-primary">
                About us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-primary">
                Services
              </Link>
            </li>
            <li>
              <Link href="/grief-camp" className="hover:text-primary">
                Grief Camp
              </Link>
            </li>
            <li>
              <Link href="/insights" className="hover:text-primary">
                Insights
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Engage</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link href="/booking" className="hover:text-primary">
                Book a Session
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/contact#faq" className="hover:text-primary">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/join-us" className="hover:text-primary">
                Join us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Reach us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 text-primary" />
              +254 700 000 000
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 text-primary" />
              hello@recrogroup.org
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 text-primary" />
              Nairobi, Kenya
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>Copyright © 2017 - 2024 Recro Group Limited. Restoring families.</p>
          <p className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/" className="hover:text-foreground">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
