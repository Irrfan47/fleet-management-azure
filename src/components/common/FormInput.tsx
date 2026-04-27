import { InputHTMLAttributes, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ label, error, hint, className, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={inputId} className="text-sm font-medium">{label}</Label>}
      <Input ref={ref} id={inputId} className={cn(error && "border-destructive focus-visible:ring-destructive", className)} {...props} />
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
});
FormInput.displayName = "FormInput";
