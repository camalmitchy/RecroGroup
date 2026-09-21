export const MEDIA_CATEGORIES = [
  "Therapy",
  "Relationships",
  "Parenting",
  "Grief",
  "Mental Health",
] as const;

export const RESOURCE_CATEGORIES = [
  "Relationships",
  "Mental Health",
  "Parenting",
  "Grief",
  "Family",
  "Therapy",
] as const;

export function dropdownOptions(
  canonical: readonly string[],
  extras: Array<string | null | undefined> = [],
) {
  const values = [...canonical];
  for (const extra of extras) {
    const value = extra?.trim();
    if (value && !values.includes(value)) values.push(value);
  }
  return values.map((value) => ({ value, label: value }));
}
