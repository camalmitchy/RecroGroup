"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function HomeBookingForm() {
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const service = String(fd.get("service") || "individual");
        router.push(`/booking?service=${encodeURIComponent(service)}`);
      }}
    >
      <div className="space-y-3">
        <Label
          htmlFor="service"
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Support type
        </Label>
        <NativeSelect
          id="service"
          name="service"
          defaultValue="individual"
          className="w-full"
        >
          <NativeSelectOption value="individual">
            Individual Therapy
          </NativeSelectOption>
          <NativeSelectOption value="couples">
            Couples &amp; Families
          </NativeSelectOption>
          <NativeSelectOption value="children">
            Children &amp; Grief
          </NativeSelectOption>
          <NativeSelectOption value="corporate">
            Corporate Wellness
          </NativeSelectOption>
        </NativeSelect>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="preferred-date"
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Preferred date
          </Label>
          <Input
            id="preferred-date"
            name="date"
            type="date"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="mode"
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Mode
          </Label>
          <NativeSelect
            id="mode"
            name="mode"
            defaultValue="in-person"
            className="w-full"
          >
            <NativeSelectOption value="in-person">In-person</NativeSelectOption>
            <NativeSelectOption value="online">Online</NativeSelectOption>
            <NativeSelectOption value="phone">Phone</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-2 w-full rounded-full">
        Continue to booking
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
