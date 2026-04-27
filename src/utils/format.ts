import { format, formatDistanceToNow, differenceInDays, parseISO } from "date-fns";

export const fmtDate = (d?: string) => (d ? format(parseISO(d), "dd MMM yyyy") : "—");
export const fmtDateTime = (d?: string) => (d ? format(parseISO(d), "dd MMM yyyy, HH:mm") : "—");
export const fmtRelative = (d?: string) => (d ? formatDistanceToNow(parseISO(d), { addSuffix: true }) : "—");
export const daysUntil = (d: string) => differenceInDays(parseISO(d), new Date());
export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 0 }).format(n);
export const fmtNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);
