import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Option { value: string; label: string; }

interface SelectDropdownProps {
  label?: string;
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  className?: string;
  name?: string;
}

export function SelectDropdown({ label, value, onChange, options, placeholder = "Select...", error, className, name }: SelectDropdownProps) {
  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={name} className="text-sm font-medium">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={name} className={cn(error && "border-destructive", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
