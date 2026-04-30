import { Eye, Download, ShieldCheck, AlertTriangle, AlertCircle, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useExpiryStatus } from "@/hooks/useExpiryStatus";
import { fmtDate, downloadFile, getViewUrl } from "@/utils/format";
import { cn } from "@/lib/utils";

/* ── Expiry Badge ─────────────────────────────────────────── */
export function ExpiryBadge({ date }: { date: string }) {
  const { alert, days } = useExpiryStatus(date);

  const config = {
    ok: { label: `${days}d left`, tone: "success" as const, icon: ShieldCheck },
    expired: { label: "Expired", tone: "destructive" as const, icon: AlertTriangle },
    urgent: { label: `${days}d left`, tone: "destructive" as const, icon: AlertTriangle },
    warning: { label: `${days}d left`, tone: "warning" as const, icon: AlertCircle },
    standard: { label: `${days}d left`, tone: "warning" as const, icon: AlertCircle },
  }[alert] || { label: `${days}d left`, tone: "info" as const, icon: ShieldCheck };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
      config.tone === "success" && "bg-success/10 text-success border border-success/20",
      config.tone === "destructive" && "bg-destructive/10 text-destructive border border-destructive/20 animate-pulse",
      config.tone === "warning" && "bg-warning/10 text-warning border border-warning/20",
      config.tone === "info" && "bg-info/10 text-info border border-info/20"
    )}>
      <config.icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

/* ── Document Action Icons ────────────────────────────────── */
export function DocActions({ path }: { path?: string }) {
  if (!path) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 mt-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={getViewUrl(path)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-6 w-6 rounded bg-primary/5 text-muted-foreground hover:text-primary hover:bg-primary/15 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-3 w-3" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">View document</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); downloadFile(path); }}
              className="inline-flex items-center justify-center h-6 w-6 rounded bg-primary/5 text-muted-foreground hover:text-primary hover:bg-primary/15 transition-all duration-200"
            >
              <Download className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Download</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

/* ── Policy Information Cell ──────────────────────────────── */
export function PolicyInfoCell({ policy }: { policy: any }) {
  if (!policy) return <span className="text-muted-foreground/40 italic text-[11px]">No policy</span>;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-foreground tracking-tight">{policy.policyNo}</span>
        <DocActions path={policy.document_path} />
      </div>
      {policy.type !== "road_tax" && (
        <span className="text-[11px] font-medium text-muted-foreground/70 flex items-center gap-1">
          <FileText className="h-3 w-3 shrink-0" />
          {policy.provider}
        </span>
      )}
    </div>
  );
}

/* ── Expiry Information Cell ──────────────────────────────── */
export function ExpiryInfoCell({ date }: { date?: string }) {
  if (!date) return <span className="text-muted-foreground/30 text-[11px] italic">—</span>;

  return (
    <div className="flex flex-col gap-1.5 items-center">
      <span className="text-[12px] font-mono font-semibold text-foreground/80">{fmtDate(date)}</span>
      <ExpiryBadge date={date} />
    </div>
  );
}

/* ── Vehicle Info Cell ────────────────────────────────────── */
import { Link } from "react-router-dom";
import { getAssetUrl } from "@/utils/format";

export function VehicleInfoCell({ vehicleId, regNo, imagePath }: { vehicleId: string; regNo: string; imagePath?: string }) {
  return (
    <Link to={`/vehicles/${vehicleId}`} className="flex items-center gap-2.5 group" onClick={(e) => e.stopPropagation()}>
      {imagePath ? (
        <img
          src={getAssetUrl(imagePath)}
          alt={regNo}
          className="h-10 w-10 rounded-lg object-cover border border-border/50 shrink-0 group-hover:ring-2 group-hover:ring-primary/30 transition-all duration-200"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-muted text-xs font-bold text-muted-foreground uppercase shrink-0 group-hover:ring-2 group-hover:ring-primary/30 transition-all duration-200">
          {regNo?.charAt(0) || "?"}
        </div>
      )}
      <div className="font-mono text-sm font-bold tracking-tight text-primary leading-tight group-hover:underline underline-offset-2 decoration-primary/40 transition-all duration-200">
        {regNo}
      </div>
    </Link>
  );
}

/* ── Compliance Action Buttons ────────────────────────────── */
import { RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionProps {
  onRenew: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ComplianceActions({ onRenew, onEdit, onDelete }: ActionProps) {
  return (
    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={onRenew}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Renew Policy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Edit Details</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Delete Record</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

