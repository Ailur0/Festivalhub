// Change CURRENCY (and LOCALE) here to switch the whole app, e.g. to 'INR' / 'en-IN'.
const LOCALE = 'en-US';
const CURRENCY = 'USD';

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(Math.round(amount));
}

/** Parses a YYYY-MM-DD string as a local calendar date (not UTC midnight). */
export function parseDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseDate(value);
  return toIsoDate(date) === value;
}

export function formatDate(isoDate: string): string {
  return parseDate(isoDate).toLocaleDateString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const startText = startDate.toLocaleDateString(LOCALE, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  return `${startText} – ${formatDate(end)}`;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Whole days from today until the date; negative once it has passed. */
export function daysUntil(isoDate: string): number {
  return Math.round((parseDate(isoDate).getTime() - startOfToday().getTime()) / 86_400_000);
}

export function formatRelativeTime(isoTimestamp: string): string {
  const minutes = Math.round((Date.now() - new Date(isoTimestamp).getTime()) / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  return new Date(isoTimestamp).toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' });
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}
