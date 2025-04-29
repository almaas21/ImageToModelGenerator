import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ImageUp, Type, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "./ImageUpload";
import TextPromptInput from "./TextPromptInput";
import { useUploadStore } from "@/lib/stores/useUploadStore";
import { useModelStore } from "@/lib/stores/useModelStore";
import { apiRequest } from "@/lib/queryClient";
import { getSampleModel } from "@/lib/models";

export default function UploadForm() {
  const { setUploadMode, uploadMode } = useUploadStore();
  const { 
    setModelLoading, 
    setCurrentModel, 
    setModelVisible,
    isModelLoading
  } = useModelStore();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [textPrompt, setTextPrompt] = useState("");
  
  const handleTabChange = (value: string) => {
    setUploadMode(value as "image" | "text");
  };
  
  const handleReset = () => {
    setImageFile(null);
    setTextPrompt("");
    setModelVisible(false);
  };
  
  const handleSubmit = async () => {
    if (uploadMode === "image" && !imageFile) {
      toast.error("Please upload an image first");
      return;
    }
    
    if (uploadMode === "text" && !textPrompt.trim()) {
      toast.error("Please enter a text prompt");
      return;
    }
    
    // Start loading
    setModelLoading(true);
    
    try {
      if (uploadMode === "image") {
        // Create form data for image upload
        const formData = new FormData();
        formData.append("image", imageFile as File);
        
        // Mock API call for image upload
        // In a real app, we would send this to the server
        setTimeout(async () => {
          try {
            // Simulate API call
            await apiRequest("POST", "/api/generate/image", { prompt: "Image processed" });
            
            // Get a sample model based on the image
            const model = getSampleModel(imageFile?.name || "default");
            
            // Set the model
            setCurrentModel(model);
            setModelVisible(true);
            setModelLoading(false);
            
            toast.success("3D model generated successfully!");
          } catch (error) {
            setModelLoading(false);
            toast.error("Failed to generate 3D model. Please try again.");
          }
        }, 2000);
      } else {
        // Text prompt generation
        setTimeout(async () => {
          try {
            // Simulate API call
            await apiRequest("POST", "/api/generate/text", { prompt: textPrompt });
            
            // Get a sample model based on the text
            const model = getSampleModel(textPrompt);
            
            // Set the model
            setCurrentModel(model);
            setModelVisible(true);
            setModelLoading(false);
            
            toast.success("3D model generated successfully!");
          } catch (error) {
            setModelLoading(false);
            toast.error("Failed to generate 3D model. Please try again.");
          }
        }, 2000);
      }
    } catch (error) {
      setModelLoading(false);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Create 3D Model</h2>
      
      <Tabs 
        defaultValue="image" 
        className="w-full" 
        onValueChange={handleTabChange}
        value={uploadMode}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageUp className="h-4 w-4" />
            <span>Image</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Text</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="mt-0">
          <ImageUpload 
            imageFile={imageFile} 
            setImageFile={setImageFile} 
          />
        </TabsContent>
        
        <TabsContent value="text" className="mt-0">
          <TextPromptInput 
            textPrompt={textPrompt} 
            setTextPrompt={setTextPrompt} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-auto pt-6 flex gap-3">
        <Button 
          onClick={handleReset} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
        
        <Button 
          onClick={handleSubmit} 
          className="flex-1"
          disabled={isModelLoading}
        >
          Generate 3D Model
        </Button>
      </div>
    </div>
  );
}
