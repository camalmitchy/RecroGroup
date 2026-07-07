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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const locations = [
  {
    id: "nairobi",
    name: "Nairobi",
    address: "Karen, Nairobi",
    coordinates: { lat: -1.3195, lng: 36.7076 },
    mapUrl: "https://www.google.com/maps?q=-1.3195,36.7076",
    phone: "+254 700 000 000",
    hours: "Mon–Sat, 8:30am – 6:00pm",
  },
  {
    id: "mombasa",
    name: "Mombasa",
    address: "Nyali, Mombasa",
    coordinates: { lat: -4.0435, lng: 39.6682 },
    mapUrl: "https://www.google.com/maps?q=-4.0435,39.6682",
    phone: "+254 700 000 001",
    hours: "Mon–Sat, 9:00am – 5:30pm",
  },
  {
    id: "nakuru",
    name: "Nakuru",
    address: "Milimani, Nakuru",
    coordinates: { lat: -0.3031, lng: 36.0800 },
    mapUrl: "https://www.google.com/maps?q=-0.3031,36.0800",
    phone: "+254 700 000 002",
    hours: "Mon–Sat, 9:00am – 5:30pm",
  },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: "",
    location: "",
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
          src="/assets/therapy.png"
          alt="Contact us"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-primary-deep/35" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container-page w-full">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-white">
                Contact Us
              </span>
              <h1 className="mt-6 text-5xl md:text-6xl font-serif text-white leading-[1.05]">
                Start a conversation.
                <br />
                We'll take it from there.
              </h1>
              <p className="mt-6 text-white/95 leading-relaxed text-base max-w-xl">
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
                Preferred Location
              </label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-0 bg-[#F4F1EA] px-4 py-3 text-sm">
                  <SelectValue placeholder="Select a location..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="mombasa">Mombasa</SelectItem>
                  <SelectItem value="nakuru">Nakuru</SelectItem>
                </SelectContent>
              </Select>
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
            {/* Our Locations */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-lg font-serif font-semibold mb-6">
                Our Locations
              </h3>

              <Tabs defaultValue="nairobi" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  {locations.map((location) => (
                    <TabsTrigger
                      key={location.id}
                      value={location.id}
                      className="data-[state=active]:bg-primary-deep data-[state=active]:text-white"
                    >
                      {location.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {locations.map((location) => (
                  <TabsContent key={location.id} value={location.id} className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                          <MapPin className="size-4 text-primary-deep" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{location.address}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Coordinates: {location.coordinates.lat}, {location.coordinates.lng}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                          <Phone className="size-4 text-primary-deep" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{location.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                          <Clock className="size-4 text-primary-deep" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{location.hours}</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-full"
                        >
                          <a
                            href={location.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Map
                          </a>
                        </Button>
                      </div>

                      {/* Embedded Map */}
                      <div className="rounded-xl overflow-hidden border border-border">
                        <iframe
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=15`}
                          allowFullScreen
                          title={`Map of ${location.name}`}
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* General Contact */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-lg font-serif font-semibold mb-6">
                General Inquiries
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                    <Mail className="size-4 text-primary-deep" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">hello@recrogroup.co.ke</p>
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
