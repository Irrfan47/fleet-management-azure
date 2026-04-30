import { format, parseISO, formatDistanceToNow, differenceInDays } from "date-fns";

export const fmtDate = (d?: string) => (d ? format(parseISO(d), "dd MMM yyyy") : "—");
export const fmtDateTime = (d?: string) => (d ? format(parseISO(d), "dd MMM yyyy, HH:mm") : "—");
export const fmtRelative = (d?: string) => (d ? formatDistanceToNow(parseISO(d), { addSuffix: true }) : "—");
export const daysUntil = (d: string) => differenceInDays(parseISO(d), new Date());
export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 0 }).format(n);
export const fmtNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

export const getAssetUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl != null ? apiUrl.replace("/api", "") : "http://localhost:8000";
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const getViewUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  return `${apiUrl}/view-file?path=${encodeURIComponent(path)}`;
};

export const downloadFile = async (url: string, fileName?: string) => {
  try {
    const response = await fetch(getAssetUrl(url));
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName || url.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed", error);
    window.open(getAssetUrl(url), "_blank");
  }
};
