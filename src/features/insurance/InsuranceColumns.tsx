import type { Column } from "@/components/common";
import { fmtCurrency } from "@/utils/format";
import { 
  PolicyInfoCell, 
  ExpiryInfoCell, 
  VehicleInfoCell, 
  ComplianceActions,
  DocActions 
} from "./components/InsuranceTableComponents";

// Re-export DocActions for other features (like VehicleDetails)
export { DocActions };

/* ── Column Handlers ──────────────────────────────────────── */
interface InsuranceColumnHandlers {
  onEdit: (r: any) => void;
  onDelete: (r: any) => void;
  onRenew: (r: any) => void;
  onViewHistory: (r: any) => void;
  onPreview: (url: string) => void;
}

/* ── Column Definitions ───────────────────────────────────── */
export const getInsuranceColumns = (handlers: InsuranceColumnHandlers): Column<any>[] => [
  /* 1 ─ Row Index */
  {
    key: "no",
    header: "No.",
    className: "w-12 text-center",
    render: (_r, _i, rowIndex) => (
      <span className="font-mono text-xs font-semibold text-muted-foreground">
        {(rowIndex ?? 0) + 1}
      </span>
    ),
  },

  /* 2 ─ Vehicle Registration */
  {
    key: "vehicle",
    header: "Vehicle",
    className: "min-w-[120px]",
    render: (r) => (
      <VehicleInfoCell 
        vehicleId={r.vehicleId} 
        regNo={r.regNo} 
        imagePath={r.image_path} 
      />
    ),
  },

  /* 3 ─ Insurance Policy */
  {
    key: "insurancePolicy",
    header: "Insurance Policy",
    className: "min-w-[150px]",
    render: (r) => <PolicyInfoCell policy={r.insurance} />,
  },

  /* 4 ─ Insurance Expiry */
  {
    key: "insuranceExpiry",
    header: "Insurance Expiry",
    className: "min-w-[140px] text-center",
    render: (r) => <ExpiryInfoCell date={r.insurance?.expiryDate} />,
  },

  /* 5 ─ Road Tax Reference */
  {
    key: "roadTaxRef",
    header: "Road Tax Ref.",
    className: "min-w-[130px] border-l border-border/30 pl-4",
    render: (r) => <PolicyInfoCell policy={r.roadTax} />,
  },

  /* 6 ─ Road Tax Expiry */
  {
    key: "roadTaxExpiry",
    header: "Road Tax Expiry",
    className: "min-w-[140px] text-center",
    render: (r) => <ExpiryInfoCell date={r.roadTax?.expiryDate} />,
  },

  /* 7 ─ Combined Premium */
  {
    key: "premium",
    header: "Premium",
    className: "text-right min-w-[100px]",
    render: (r) => {
      const insPremium = Number(r.insurance?.premium || 0);
      const taxPremium = Number(r.roadTax?.premium || 0);
      const total = insPremium + taxPremium;
      return (
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm font-bold text-primary">{fmtCurrency(total)}</span>
          {(insPremium > 0 && taxPremium > 0) && (
            <span className="text-[9px] text-muted-foreground/60 font-medium tabular-nums">
              {fmtCurrency(insPremium)} + {fmtCurrency(taxPremium)}
            </span>
          )}
        </div>
      );
    },
  },

  /* 8 ─ Action Buttons */
  {
    key: "actions",
    header: "Actions",
    className: "w-[140px] text-center",
    render: (r) => (
      <ComplianceActions 
        onRenew={() => handlers.onRenew(r)}
        onEdit={() => handlers.onEdit(r)}
        onDelete={() => handlers.onDelete(r)}
      />
    ),
  },
];
