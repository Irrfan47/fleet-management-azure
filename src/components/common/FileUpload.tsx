import { useRef, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadService } from "@/services/fleetService";
import { toast } from "sonner";
import { getAssetUrl } from "@/utils/format";

interface FileUploadProps {
  label?: string;
  accept?: string;
  value?: string;
  onChange?: (path: string) => void;
  folder: string;
  subfolder?: string;
  hint?: string;
  className?: string;
}

export function FileUpload({ label, accept = "image/*,.pdf", value, onChange, folder, subfolder, hint, className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (value) setPreview(value);
    else if (!file) setPreview(null);
  }, [value, file]);

  const handle = async (f: File | null) => {
    if (!f) {
      setFile(null);
      setPreview(null);
      onChange?.("");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadService.upload(f, folder, subfolder);
      setFile(f);
      if (f.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(null);
      }
      onChange?.(res.path);
      toast.success("File uploaded successfully");
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handle(e.target.files?.[0] || null)} />

      {file || preview ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 p-2">
          <div className="flex items-center gap-3 text-sm overflow-hidden">
            {preview ? (
              <img 
                src={preview.startsWith("blob:") ? preview : getAssetUrl(preview)} 
                alt="Preview" 
                className="h-10 w-10 rounded object-cover border" 
              />
            ) : (
              <FileText className="h-6 w-6 text-primary shrink-0" />
            )}
            <div className="flex flex-col truncate">
              <span className="truncate font-medium">{file ? file.name : "Current file"}</span>
              {file && <span className="text-[10px] text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>}
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => handle(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/20 px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary-muted/40 hover:text-primary disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
          <span>{uploading ? "Uploading..." : `Click to upload ${accept ? `(${accept})` : ""}`}</span>
        </button>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
