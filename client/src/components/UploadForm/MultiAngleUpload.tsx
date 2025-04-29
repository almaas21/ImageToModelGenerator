import { useState, useRef } from "react";
import { Upload, X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MultiAngleUploadProps {
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  maxImages?: number;
}

export default function MultiAngleUpload({ 
  imageFiles, 
  setImageFiles,
  maxImages = 5
}: MultiAngleUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const combinedFiles = [...imageFiles, ...newFiles].slice(0, maxImages);
      setImageFiles(combinedFiles);
      
      // Create previews for new files
      const newPreviews: string[] = [];
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newFiles.length) {
            setPreviews([...previews, ...newPreviews].slice(0, maxImages));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const combinedFiles = [...imageFiles, ...newFiles].slice(0, maxImages);
      setImageFiles(combinedFiles);
      
      // Create previews for new files
      const newPreviews: string[] = [];
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newFiles.length) {
            setPreviews([...previews, ...newPreviews].slice(0, maxImages));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };
  
  const handleAddMoreImages = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="w-full space-y-4">
      {/* Upload area */}
      {imageFiles.length === 0 ? (
        <div 
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors border-muted-foreground hover:border-primary"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="py-8">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Drag and drop multiple images from different angles
            </p>
            <p className="text-xs text-muted-foreground">
              For better results, include front, side, back views (max {maxImages} images)
            </p>
          </div>
        </div>
      ) : null}
      
      {/* Preview images */}
      {imageFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">
              Images ({imageFiles.length}/{maxImages})
            </h3>
            {imageFiles.length < maxImages && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5"
                onClick={handleAddMoreImages}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add More</span>
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-48 rounded-md border p-2">
            <div className="grid grid-cols-2 gap-3 pr-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Angle ${index + 1}`} 
                    className="h-40 w-full object-cover rounded-md border"
                  />
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="bg-black bg-opacity-50 text-white rounded-full p-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Angle {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="text-xs text-muted-foreground">
            Tip: For best results, include clear images from different angles with consistent lighting
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        multiple
      />
    </div>
  );
}