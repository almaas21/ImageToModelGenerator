import { useEffect, useState } from "react";
import { useUploadStore } from "@/lib/stores/useUploadStore";

interface LoadingScreenProps {
  mode?: 'single-image' | 'multi-angle' | 'text';
  totalImages?: number;
}

export default function LoadingScreen({ 
  mode = 'text',
  totalImages = 1
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Analyzing input...");
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(6);
  const { uploadMode } = useUploadStore();
  
  // Determine actual mode if not specified
  const processingMode = mode === 'text' 
    ? (uploadMode === 'text' ? 'text' : 'single-image') 
    : mode;
  
  // Simulate loading progress with appropriate messaging per mode
  useEffect(() => {
    let stages: { progress: number, text: string }[] = [];
    
    // Different stages based on processing mode
    if (processingMode === 'multi-angle') {
      stages = [
        { progress: 5, text: "Analyzing images..." },
        { progress: 15, text: "Extracting features from multiple angles..." },
        { progress: 25, text: "Calculating camera positions..." },
        { progress: 35, text: "Generating point cloud..." },
        { progress: 50, text: "Creating dense mesh..." },
        { progress: 65, text: "Reconstructing surface geometry..." },
        { progress: 75, text: "Generating texture map..." },
        { progress: 85, text: "Optimizing topology..." },
        { progress: 95, text: "Finalizing high-quality model..." },
      ];
    } else if (processingMode === 'single-image') {
      stages = [
        { progress: 10, text: "Analyzing image..." },
        { progress: 30, text: "Estimating depth map..." },
        { progress: 50, text: "Creating basic mesh..." },
        { progress: 70, text: "Generating surface textures..." },
        { progress: 85, text: "Optimizing model..." },
        { progress: 95, text: "Finalizing model..." },
      ];
    } else { // text mode
      stages = [
        { progress: 10, text: "Analyzing text prompt..." },
        { progress: 30, text: "Generating conceptual model..." },
        { progress: 50, text: "Creating base geometry..." },
        { progress: 70, text: "Adding details and features..." },
        { progress: 85, text: "Applying materials and colors..." },
        { progress: 95, text: "Finalizing 3D representation..." },
      ];
    }
    
    setTotalSteps(stages.length);
    let currentStage = 0;
    
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress);
        setLoadingText(stages[currentStage].text);
        setCurrentStep(currentStage + 1);
        currentStage++;
      } else {
        // Final stage
        setProgress(100);
        setLoadingText("Almost done...");
        clearInterval(interval);
      }
    }, processingMode === 'multi-angle' ? 800 : 600); // Longer intervals for multi-angle to simulate more processing
    
    return () => clearInterval(interval);
  }, [processingMode, totalImages]);
  
  // Get processing subtitle based on mode
  const getProcessingSubtitle = () => {
    if (processingMode === 'multi-angle') {
      return `Processing ${totalImages} images for accurate reconstruction`;
    } else if (processingMode === 'single-image') {
      return "Creating 3D model from single image";
    } else {
      return "Generating 3D model from text description";
    }
  };
  
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
      <div className="w-72 text-center">
        <h3 className="font-medium mb-1">{processingMode === 'multi-angle' ? '3D Photogrammetry' : '3D Generation'}</h3>
        <p className="text-xs text-muted-foreground mb-3">{getProcessingSubtitle()}</p>
        
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mb-4">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{progress}%</span>
        </div>
        
        <p className="text-sm font-medium">{loadingText}</p>
        
        {/* Show processing tips for multi-angle mode */}
        {processingMode === 'multi-angle' && (
          <div className="mt-4 mb-4 bg-muted p-3 rounded-md text-xs text-left">
            <p className="font-medium mb-1">Why multi-angle processing takes longer:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Correlating features across multiple images</li>
              <li>Building accurate spatial relationships</li>
              <li>Generating higher quality mesh and textures</li>
            </ul>
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <LoadingCube />
        </div>
      </div>
    </div>
  );
}

// 3D-like loading cube animation
function LoadingCube() {
  return (
    <div className="w-16 h-16 relative animate-spin-slow">
      <div className="absolute w-full h-full border-2 border-primary transform rotate-x-45 rotate-y-45"></div>
      <div className="absolute w-full h-full border-2 border-primary transform rotate-x-135 rotate-y-45"></div>
      <div className="absolute w-full h-full border-2 border-primary transform rotate-x-45 rotate-y-135"></div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          0% { transform: rotate3d(1, 1, 1, 0deg); }
          100% { transform: rotate3d(1, 1, 1, 360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .rotate-x-45 {
          transform: rotateX(45deg);
        }
        .rotate-y-45 {
          transform: rotateY(45deg);
        }
        .rotate-x-135 {
          transform: rotateX(135deg);
        }
        .rotate-y-135 {
          transform: rotateY(135deg);
        }
      `}} />
    </div>
  );
}
