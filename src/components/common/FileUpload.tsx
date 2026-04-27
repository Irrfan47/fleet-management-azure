import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  hint?: string;
  className?: string;
}

export function FileUpload({ label, accept = "image/*,.pdf", onChange, hint, className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handle = (f: File | null) => {
    setFile(f);
    onChange?.(f);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handle(e.target.files?.[0] || null)} />

      {file ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            <span className="truncate font-medium">{file.name}</span>
            <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => handle(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/20 px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary-muted/40 hover:text-primary"
        >
          <Upload className="h-6 w-6" />
          <span>Click to upload {accept && <span className="text-xs">({accept})</span>}</span>
        </button>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
