import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ImageUp, Type, RotateCcw, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "./ImageUpload";
import MultiAngleUpload from "./MultiAngleUpload";
import TextPromptInput from "./TextPromptInput";
import { useUploadStore } from "@/lib/stores/useUploadStore";
import { useModelStore } from "@/lib/stores/useModelStore";
import { apiRequest } from "@/lib/queryClient";
import { ModelService } from "@/services/modelService";

export default function UploadForm() {
  const { setUploadMode, uploadMode } = useUploadStore();
  const { 
    setModelLoading, 
    setCurrentModel, 
    setModelVisible,
    isModelLoading
  } = useModelStore();
  
  // For single image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // For multi-angle image upload
  const [multiAngleFiles, setMultiAngleFiles] = useState<File[]>([]);
  
  // For text prompt
  const [textPrompt, setTextPrompt] = useState("");
  
  // Track image upload mode (single or multi-angle)
  const [imageUploadMode, setImageUploadMode] = useState<"single" | "multi">("single");
  
  const handleTabChange = (value: string) => {
    setUploadMode(value as "image" | "text");
  };
  
  const handleReset = () => {
    setImageFile(null);
    setMultiAngleFiles([]);
    setTextPrompt("");
    setModelVisible(false);
  };
  
  const handleSubmit = async () => {
    // Validation checks
    if (uploadMode === "image") {
      if (imageUploadMode === "single" && !imageFile) {
        toast.error("Please upload an image first");
        return;
      }
      
      if (imageUploadMode === "multi" && multiAngleFiles.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }
      
      if (imageUploadMode === "multi" && multiAngleFiles.length < 2) {
        toast.warning("For best results, upload multiple angles (at least 2)");
        // Continue anyway
      }
    } else if (uploadMode === "text" && !textPrompt.trim()) {
      toast.error("Please enter a text prompt");
      return;
    }
    
    // Start loading
    setModelLoading(true);
    
    try {
      if (uploadMode === "image") {
        try {
          let model;
          
          // Use the appropriate method based on upload mode
          if (imageUploadMode === "single" && imageFile) {
            // Log the API request to the server
            await apiRequest("POST", "/api/generate/image", { 
              fileName: imageFile.name 
            });
            
            // Generate model from single image
            model = await ModelService.generateFromImages([imageFile]);
          } else if (imageUploadMode === "multi" && multiAngleFiles.length > 0) {
            // Log the API request to the server
            await apiRequest("POST", "/api/generate/image", { 
              fileName: multiAngleFiles[0].name,
              multiAngle: true,
              imageCount: multiAngleFiles.length
            });
            
            // Generate model from multiple images
            model = await ModelService.generateFromImages(multiAngleFiles);
          } else {
            throw new Error("No image files available");
          }
          
          // Set the model in store
          setCurrentModel(model);
          setModelVisible(true);
          
          // Notify success
          const successMessage = imageUploadMode === "multi" 
            ? "3D model created from multiple angles" 
            : "3D model created from image";
          
          toast.success(successMessage);
          
        } catch (error) {
          console.error("Error during image processing:", error);
          toast.error("Failed to process images. Please try again.");
        } finally {
          setModelLoading(false);
        }
      } else {
        // Text prompt generation
        try {
          // Log the API request to the server
          await apiRequest("POST", "/api/generate/text", { 
            prompt: textPrompt 
          });
          
          // Generate model from text prompt
          const model = await ModelService.generateFromText(textPrompt);
          
          // Set the model in store
          setCurrentModel(model);
          setModelVisible(true);
          
          // Notify success
          toast.success("3D model generated from text prompt!");
          
        } catch (error) {
          console.error("Error during text generation:", error);
          toast.error("Failed to generate 3D model. Please try again.");
        } finally {
          setModelLoading(false);
        }
      }
    } catch (error) {
      console.error("General error:", error);
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
          {/* Image upload mode selector */}
          <div className="mb-4">
            <Tabs 
              defaultValue="single" 
              value={imageUploadMode}
              onValueChange={(v) => setImageUploadMode(v as "single" | "multi")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="single" className="text-xs">
                  Single Image
                </TabsTrigger>
                <TabsTrigger value="multi" className="text-xs">
                  Multi-Angle (Recommended)
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="mt-0">
                <ImageUpload 
                  imageFile={imageFile} 
                  setImageFile={setImageFile} 
                />
              </TabsContent>
              
              <TabsContent value="multi" className="mt-0">
                <MultiAngleUpload 
                  imageFiles={multiAngleFiles}
                  setImageFiles={setMultiAngleFiles}
                  maxImages={5}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Info about multi-angle uploads */}
          {imageUploadMode === "multi" && (
            <div className="bg-muted p-3 rounded-md text-sm mb-4">
              <div className="flex items-start gap-2">
                <Image className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Why use multiple angles?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Multiple images from different angles create more accurate 3D models with better detail 
                    and texture mapping. For best results, capture front, side, back and top views with 
                    consistent lighting.
                  </p>
                </div>
              </div>
            </div>
          )}
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
