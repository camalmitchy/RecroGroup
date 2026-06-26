"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import { ROLE_LABELS, type AppRole } from "@/features/portal/lib/roles";

type SettingsPanelProps = {
  role: AppRole;
};

export function SettingsPanel({ role }: SettingsPanelProps) {
  return (
    <div>
      <PortalPageHeader
        title="Settings"
        description="Site configuration and operational preferences."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portal access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Your role</span>
              <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>
            </div>
            <p className="text-muted-foreground">
              Admin users can manage settings. Receptionists handle bookings,
              payments, grief camp applications, and inquiries.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Phone:</span> +254 700 000
              000
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              hello@recrogroup.org
            </p>
            <p>
              <span className="text-muted-foreground">Hours:</span> Mon–Fri
              8:00–18:00, Sat 9:00–14:00
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
