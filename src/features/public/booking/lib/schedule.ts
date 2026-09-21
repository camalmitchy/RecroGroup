export const TIME_SLOTS = Array.from({ length: 9 }, (_, i) => {
  const hour = i + 9;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${ampm}`;
});

export const HOME_BOOKABLE_SERVICES = [
  { value: "individual", label: "Individual Therapy" },
  { value: "couples", label: "Couples Therapy" },
  { value: "family", label: "Family Therapy" },
  { value: "group", label: "Group Therapy" },
] as const;

export const HOME_PROGRAM_SERVICES = [
  { value: "children", label: "Children & Grief" },
  { value: "corporate", label: "Corporate speaking" },
] as const;

export type BookingEntryStep = "service" | "time" | "intake";

export function generateAvailableDates(from = new Date()) {
  const dates: Date[] = [];
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  let daysAdded = 0;
  let offset = 1;

  while (daysAdded < 14) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);

    if (date.getDay() !== 0) {
      dates.push(date);
      daysAdded++;
    }
    offset++;
  }

  return dates;
}

export function toDateOnly(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function isTimeSlot(value: string | null | undefined): value is string {
  return Boolean(value && TIME_SLOTS.includes(value));
}

export function normalizeTimeSlot(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.replace(/\+/g, " ").trim();
  return isTimeSlot(normalized) ? normalized : null;
}

export function bookingEntryStep(input: {
  hasService: boolean;
  date: string | null;
  time: string | null;
}): BookingEntryStep {
  if (!input.hasService) return "service";
  if (parseDateOnly(input.date) && normalizeTimeSlot(input.time)) return "intake";
  return "time";
}

const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatBookingDateLabel(date: Date) {
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

export function formatBookingDateLong(date: Date) {
  return `${WEEKDAYS_LONG[date.getDay()]}, ${MONTHS_LONG[date.getMonth()]} ${date.getDate()}`;
}

export function formatWeekday(date: Date) {
  return WEEKDAYS_LONG[date.getDay()];
}
