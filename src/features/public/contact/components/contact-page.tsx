"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Send, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src="/assets/therapy-session.jpg"
          alt="Contact us"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container-page w-full">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-white">
                Contact Us
              </span>
              <h1 className="mt-6 text-5xl md:text-6xl font-serif text-white leading-[1.05]">
                Start a conversation.
                <br />
                We'll take it from there.
              </h1>
              <p className="mt-6 text-white/95 leading-relaxed text-base max-w-2xl mx-auto">
                Tell us a little about what's going on. We respond within one
                working day, and we'll gently suggest where to start — therapy, a
                group, or a call with our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wider text-xs">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full rounded-xl border-0 bg-[#F4F1EA] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wider text-xs">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border-0 bg-[#F4F1EA] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wider text-xs">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-xl border-0 bg-[#F4F1EA] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wider text-xs">
                I'm interested in
              </label>
              <Select
                value={formData.service}
                onValueChange={(value) =>
                  setFormData({ ...formData, service: value })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-0 bg-[#F4F1EA] px-4 py-3 text-sm">
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Therapy</SelectItem>
                  <SelectItem value="couples">Couples Therapy</SelectItem>
                  <SelectItem value="family">Family Therapy</SelectItem>
                  <SelectItem value="group">Group Therapy</SelectItem>
                  <SelectItem value="grief-camp">Grief Camp</SelectItem>
                  <SelectItem value="corporate">Corporate Speaking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wider text-xs">
                Your Message
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Share as much or as little as you'd like..."
                className="w-full resize-none rounded-xl border-0 bg-[#F4F1EA] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="rounded-full bg-primary-deep hover:bg-primary-deep/90"
            >
              Send message
              <Send className="size-4 ml-2" />
            </Button>
          </form>

          {/* Contact Info & Crisis Notice */}
          <div className="space-y-6">
            {/* Reach us directly */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-lg font-serif font-semibold mb-6">
                Reach us directly
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                    <Phone className="size-4 text-primary-deep" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">+254 700 000 000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                    <Mail className="size-4 text-primary-deep" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">hello@recrogroup.co.ke</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                    <MapPin className="size-4 text-primary-deep" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Karen, Nairobi · Kenya</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                    <Clock className="size-4 text-primary-deep" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mon–Sat, 8:30am – 6:00pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Crisis Notice */}
            <div className="rounded-2xl bg-orange-50/70 border border-orange-100 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
                    In Crisis Right Now?
                  </h4>
                  <p className="text-sm text-foreground/80 mb-3">
                    If you or someone you love is in immediate danger, please
                    reach out now:
                  </p>
                  <div className="space-y-1 text-sm text-foreground">
                    <p>
                      <strong>Befrienders Kenya:</strong> +254 722 178 177
                    </p>
                    <p>
                      <strong>Niskize:</strong> 0800 620 800
                    </p>
                    <p>
                      <strong>Emergency:</strong> 999
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}