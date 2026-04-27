import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "destructive" | "info" | "muted";
const toneClass: Record<Tone, string> = {
  success: "bg-success-muted text-success border-success/20",
  warning: "bg-warning-muted text-warning border-warning/20",
  destructive: "bg-destructive-muted text-destructive border-destructive/20",
  info: "bg-info-muted text-info border-info/20",
  muted: "bg-muted text-muted-foreground border-border",
};

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
  className?: string;
}

export function StatusBadge({ label, tone = "muted", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current opacity-70")} />
      {label}
    </span>
  );
}
