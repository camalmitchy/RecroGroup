"use client";

import { cn } from "@/lib/utils";

type PortalTabBarProps<T extends string> = {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
  className?: string;
};

export function PortalTabBar<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: PortalTabBarProps<T>) {
  return (
    <div
      className={cn(
        "flex gap-1 border-b border-[var(--admin-border)]",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            active === tab.key
              ? "border-primary text-primary-deep"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
