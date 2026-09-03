/**
 * Display formatting.
 *
 * Every component in this app takes pre-formatted strings and renders them
 * verbatim — formatting is a LOGIC concern. These helpers are the only place
 * numbers and timestamps become text.
 *
 * The locale is pinned to `en-US` on purpose: an implicit host locale differs
 * between the server render and the browser, which produces hydration
 * mismatches on every formatted value.
 */

const LOCALE = "en-US";

const decimalFormatters = new Map<string, Intl.NumberFormat>();

const decimalFormatter = (precision: number): Intl.NumberFormat => {
  const key = String(precision);
  let formatter = decimalFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
    decimalFormatters.set(key, formatter);
  }
  return formatter;
};

const currencyFormatters = new Map<string, Intl.NumberFormat>();

const currencyFormatter = (currency: string, precision: number): Intl.NumberFormat => {
  const key = `${currency}:${precision}`;
  let formatter = currencyFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
    currencyFormatters.set(key, formatter);
  }
  return formatter;
};

const compactFormatter = new Intl.NumberFormat(LOCALE, {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** `184.22` — a bare price, no currency symbol. */
export const formatPrice = (value: number, precision = 2): string =>
  decimalFormatter(precision).format(value);

/** `$284,913.44` — a monetary amount with its currency symbol. */
export const formatCurrency = (value: number, currency = "USD", precision = 2): string =>
  currencyFormatter(currency, precision).format(value);

/** `+$3,214.09` — a monetary delta, always signed. */
export const formatSignedCurrency = (value: number, currency = "USD", precision = 2): string =>
  `${value > 0 ? "+" : value < 0 ? "-" : ""}${currencyFormatter(currency, precision).format(Math.abs(value))}`;

/** `2.41%` — magnitude only. */
export const formatPercent = (value: number, precision = 2): string =>
  `${decimalFormatter(precision).format(value)}%`;

/** `+2.41%` / `-1.94%` / `0.00%` — signed, which is what every delta badge wants. */
export const formatSignedPercent = (value: number, precision = 2): string => {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${decimalFormatter(precision).format(Math.abs(value))}%`;
};

/** `41.2M` — volumes, market caps, sample counts. */
export const formatCompact = (value: number): string => compactFormatter.format(value);

/** `18,402` — a plain integer with thousands separators. */
export const formatCount = (value: number): string => decimalFormatter(0).format(value);

/** `82%` — a 0–1 model confidence as a whole percentage. */
export const formatConfidence = (confidence: number): string =>
  `${Math.round(Math.max(0, Math.min(1, confidence)) * 100)}%`;

/** `+0.34` — a -1..1 sentiment score, signed to two places. */
export const formatScore = (score: number): string =>
  `${score > 0 ? "+" : score < 0 ? "-" : ""}${decimalFormatter(2).format(Math.abs(score))}`;

/** `13:44 UTC` — a fixed-zone clock label, stable across server and client. */
export const formatClockUtc = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return "—";
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm} UTC`;
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface RelativeTimeOptions {
  /** Reference point. Pass the query's `dataUpdatedAt` — never a bare `Date.now()`
   *  at render time, which would differ between the server and client render. */
  now: number;
  /** `true` yields "34m ago", `false` yields "34m". */
  suffix?: boolean;
}

/** `34m ago`, `2h ago`, `just now` — compact elapsed time. */
export const formatRelativeTime = (
  isoTimestamp: string,
  { now, suffix = true }: RelativeTimeOptions,
): string => {
  const then = new Date(isoTimestamp).getTime();
  if (Number.isNaN(then)) return "—";

  const elapsed = Math.max(0, now - then);
  const tail = suffix ? " ago" : "";

  if (elapsed < MINUTE) return suffix ? "just now" : "now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m${tail}`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h${tail}`;
  return `${Math.floor(elapsed / DAY)}d${tail}`;
};

/**
 * Builds the `Record<id, string>` timestamp maps the feed components expect.
 * Keeps the per-component mapping out of every hook.
 */
export const buildTimestampMap = <T extends { id: string }>(
  items: readonly T[],
  pick: (item: T) => string,
  options: RelativeTimeOptions,
): Record<string, string> =>
  Object.fromEntries(items.map((item) => [item.id, formatRelativeTime(pick(item), options)]));
