type PortalSectionPlaceholderProps = {
  title: string;
  description?: string;
};

export function PortalSectionPlaceholder({
  title,
  description = "This section will be implemented next.",
}: PortalSectionPlaceholderProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}
