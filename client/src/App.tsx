import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "sonner";
import "@fontsource/inter";
import Header from "./components/Layout/Header";
import UploadForm from "./components/UploadForm/UploadForm";
import ModelViewer from "./components/ModelViewer/ModelViewer";
import LoadingScreen from "./components/Loading/LoadingScreen";
import { queryClient } from "./lib/queryClient";
import { useModelStore } from "./lib/stores/useModelStore";
import { useUploadStore } from "./lib/stores/useUploadStore";

function App() {
  const { 
    isModelLoading, 
    isModelVisible,
    loadingMode,
    loadingImagesCount,
    setLoadingMode
  } = useModelStore();
  
  const { uploadMode } = useUploadStore();
  
  // No need for this effect as we handle loading mode in the UploadForm component now
  
  // Pre-load audio assets
  useEffect(() => {
    // Load audio files
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    // Preload audio (but don't play)
    hitSound.load();
    successSound.load();
    
    // Optional: Set volume
    hitSound.volume = 0.3;
    successSound.volume = 0.5;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Left side - Upload form */}
          <div className="w-full md:w-1/3 p-6 border-r border-border overflow-y-auto max-h-[calc(100vh-4rem)]">
            <UploadForm />
          </div>
          
          {/* Right side - 3D viewer */}
          <div className="w-full md:w-2/3 relative overflow-y-auto max-h-[calc(100vh-4rem)]">
            {isModelLoading && (
              <LoadingScreen 
                mode={loadingMode}
                totalImages={loadingImagesCount}
              />
            )}
            
            <Suspense fallback={<LoadingScreen mode={loadingMode} totalImages={loadingImagesCount} />}>
              {isModelVisible && (
                <ModelViewer />
              )}
              
              {/* Show placeholder when no model is loaded */}
              {!isModelVisible && !isModelLoading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-4xl mb-4">
                      {uploadMode === 'text' ? '✏️' : '📷'}
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">
                      {uploadMode === 'text' 
                        ? 'Enter a text prompt to generate a 3D model' 
                        : 'Upload an image to generate a 3D model'}
                    </h2>
                    <p className="text-muted-foreground">
                      Your 3D model will appear here
                    </p>
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </main>
        
        <Toaster position="bottom-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
