import type { ReactNode } from "react";

type PortalPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PortalPageHeader({
  title,
  description,
  actions,
}: PortalPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
