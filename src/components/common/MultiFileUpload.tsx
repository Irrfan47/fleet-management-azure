import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadService } from "@/services/fleetService";
import { toast } from "sonner";
import { getAssetUrl } from "@/utils/format";
import { useState } from "react";

interface MultiFileUploadProps {
  label?: string;
  values?: string[];
  onChange?: (paths: string[]) => void;
  folder: string;
  className?: string;
}

export function MultiFileUpload({ label, values = [], onChange, folder, className }: MultiFileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newPaths: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadService.upload(files[i], folder);
        newPaths.push(res.path);
      }
      onChange?.([...values, ...newPaths]);
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    onChange?.(updated);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {values.map((path, idx) => (
          <div key={idx} className="group relative aspect-square rounded-md border overflow-hidden bg-muted">
            <img 
              src={getAssetUrl(path)} 
              alt={`Upload ${idx}`} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        <label className={cn(
          "aspect-square flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border bg-muted/20 text-muted-foreground transition-colors cursor-pointer hover:border-primary hover:bg-primary-muted/40 hover:text-primary",
          uploading && "pointer-events-none opacity-50"
        )}>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span className="text-[10px] font-medium uppercase">Add Photos</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
