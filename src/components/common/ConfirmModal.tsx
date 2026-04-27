import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type Variant = "danger" | "warning" | "success";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  variant?: Variant;
}

const iconMap = {
  danger: <XCircle className="h-10 w-10 text-destructive" />,
  warning: <AlertTriangle className="h-10 w-10 text-warning" />,
  success: <CheckCircle2 className="h-10 w-10 text-success" />,
};

export function ConfirmModal({
  open, onOpenChange, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, loading, variant = "warning",
}: ConfirmModalProps) {
  return (
    <BaseModal open={open} onOpenChange={onOpenChange} title={title} size="sm">
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        {iconMap[variant]}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>{cancelLabel}</Button>
        <Button variant={variant === "danger" ? "destructive" : "default"} onClick={onConfirm} disabled={loading}>
          {loading ? "Processing..." : confirmLabel}
        </Button>
      </div>
    </BaseModal>
  );
}
