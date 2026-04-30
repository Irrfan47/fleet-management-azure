import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type Column } from "@/components/common";
import { Progress } from "@/components/ui/progress";
import { fmtDate, fmtCurrency } from "@/utils/format";
import type { Accident } from "@/types";

interface AccidentActionProps {
  onEdit: (a: Accident) => void;
  onDelete: (a: Accident) => void;
}

export const useAccidentColumns = ({ onEdit, onDelete }: AccidentActionProps): Column<Accident>[] => [
  {
    key: "vehicle", 
    header: "Vehicle", 
    render: (r) => (
      <div>
        <div className="font-mono font-semibold">{r.vehicle?.regNo || r.vehicleRegNo || "—"}</div>
        <div className="text-xs text-muted-foreground">{r.driver?.name || r.driverName || "—"}</div>
      </div>
    )
  },
  { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
  { key: "location", header: "Location" },
  { key: "estimatedCost", header: "Est. Cost", render: (r) => fmtCurrency(r.estimatedCost) },
  { 
    key: "claimProgress", 
    header: "Claim Progress", 
    render: (r) => (
      <div className="w-32">
        <Progress value={r.claimProgress} className="h-1.5" />
        <span className="text-[10px] text-muted-foreground uppercase">{r.claimProgress}% complete</span>
      </div>
    ) 
  },
  { 
    key: "claimStatus", 
    header: "Status", 
    render: (r) => (
      <StatusBadge 
        label={r.claimStatus.replace("_", " ")} 
        tone={r.claimStatus === "approved" ? "success" : r.claimStatus === "rejected" ? "destructive" : "warning"} 
      />
    )
  },
  {
    key: "actions",
    header: "",
    className: "w-24",
    render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" onClick={() => onEdit(r)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(r)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];
