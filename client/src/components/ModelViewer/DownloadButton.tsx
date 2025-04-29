import { useModelStore } from "@/lib/stores/useModelStore";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import { downloadModelAsObj } from "@/lib/exporters";
import { toast } from "sonner";
import { ModelService } from "@/services/modelService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function DownloadButton() {
  const { currentModel, isModelVisible } = useModelStore();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async (format: 'obj' | 'glb') => {
    if (currentModel) {
      setIsDownloading(true);
      try {
        await ModelService.downloadModel(currentModel, format);
        toast.success(`Model downloaded as ${format.toUpperCase()} successfully`);
      } catch (error) {
        console.error(`Error downloading model as ${format}:`, error);
        toast.error(`Failed to download model as ${format.toUpperCase()}`);
      } finally {
        setIsDownloading(false);
      }
    } else {
      toast.error("No model available to download");
    }
  };
  
  return (
    <div className="absolute top-4 right-4 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={!isModelVisible || !currentModel || isDownloading}
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? "Downloading..." : "Download"}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleDownload('obj')}>
            <span className="font-medium">OBJ Format</span>
            <span className="text-xs text-muted-foreground ml-2">(Universal)</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload('glb')}>
            <span className="font-medium">GLB Format</span>
            <span className="text-xs text-muted-foreground ml-2">(Better quality)</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}