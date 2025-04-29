import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Analyzing input...");
  
  // Simulate loading progress
  useEffect(() => {
    const stages = [
      { progress: 10, text: "Analyzing input..." },
      { progress: 30, text: "Generating point cloud..." },
      { progress: 50, text: "Creating mesh..." },
      { progress: 70, text: "Optimizing topology..." },
      { progress: 85, text: "Applying textures..." },
      { progress: 95, text: "Finalizing model..." },
    ];
    
    let currentStage = 0;
    
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress);
        setLoadingText(stages[currentStage].text);
        currentStage++;
      } else {
        // Final stage
        setProgress(100);
        setLoadingText("Almost done...");
        clearInterval(interval);
      }
    }, 600);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
      <div className="w-64 text-center">
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground">{loadingText}</p>
        <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
        
        <div className="mt-8 flex justify-center">
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
      <div className="absolute w-full h-full border-2 border-primary transform rotate-x-[135deg] rotate-y-45"></div>
      <div className="absolute w-full h-full border-2 border-primary transform rotate-x-45 rotate-y-[135deg]"></div>
      
      <style jsx>{`
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
        .rotate-x-\\[135deg\\] {
          transform: rotateX(135deg);
        }
        .rotate-y-\\[135deg\\] {
          transform: rotateY(135deg);
        }
      `}</style>
    </div>
  );
}
