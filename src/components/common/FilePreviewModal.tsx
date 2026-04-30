import React from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "../ui/button";
import { Download, ExternalLink } from "lucide-react";
import { getAssetUrl } from "@/utils/format";

interface Props {
  url: string | null;
  onClose: () => void;
  title?: string;
}

export function FilePreviewModal({ url, onClose, title = "Document Preview" }: Props) {
  if (!url) return null;

  const fullUrl = getAssetUrl(url);
  const isPDF = url.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

  return (
    <BaseModal open={!!url} onOpenChange={(o) => !o && onClose()} title={title} size="xl">
      <div className="flex flex-col gap-4">
        <div className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
          {isPDF ? (
            <iframe src={`${fullUrl}#toolbar=0`} className="w-full h-full" title="PDF Preview" />
          ) : isImage ? (
            <img src={fullUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-center p-10">
              <div className="text-muted-foreground mb-4">Preview not available for this file type.</div>
              <Button asChild>
                <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                  Open in New Tab
                </a>
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={fullUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> Open Original
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href={fullUrl} download>
              <Download className="h-4 w-4 mr-2" /> Download
            </a>
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
