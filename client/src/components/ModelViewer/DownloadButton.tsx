import { useModelStore } from "@/lib/stores/useModelStore";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadModelAsObj } from "@/lib/exporters";
import { toast } from "sonner";

export default function DownloadButton() {
  const { currentModel, isModelVisible } = useModelStore();
  
  const handleDownload = () => {
    if (currentModel) {
      try {
        downloadModelAsObj(currentModel);
        toast.success("Model downloaded successfully");
      } catch (error) {
        console.error("Error downloading model:", error);
        toast.error("Failed to download model");
      }
    } else {
      toast.error("No model available to download");
    }
  };
  
  return (
    <Button
      onClick={handleDownload}
      disabled={!isModelVisible || !currentModel}
      variant="outline"
      className="absolute top-4 right-4 z-10 flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      <span>Download OBJ</span>
    </Button>
  );
}