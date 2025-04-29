import type { Request, Response } from "express";

// In-memory storage for generation requests
const generationRequests = new Map<string, {
  prompt: string,
  type: "text" | "image",
  status: "pending" | "processing" | "completed" | "failed",
  result?: any,
  createdAt: Date
}>();

/**
 * Generate a 3D model from a text prompt
 */
export const generateFromText = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ 
        message: "Valid text prompt is required" 
      });
    }
    
    // Generate a unique ID for this request
    const requestId = `text_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Store the request
    generationRequests.set(requestId, {
      prompt,
      type: "text",
      status: "pending",
      createdAt: new Date()
    });
    
    // Mock starting the generation process
    // In a real application, this would be a call to a 3D generation service
    setTimeout(() => {
      const request = generationRequests.get(requestId);
      if (request) {
        request.status = "processing";
        generationRequests.set(requestId, request);
        
        // Mock completing the process after some time
        setTimeout(() => {
          const request = generationRequests.get(requestId);
          if (request) {
            request.status = "completed";
            request.result = {
              modelId: requestId,
              modelType: determineModelType(prompt),
              color: determineModelColor(prompt)
            };
            generationRequests.set(requestId, request);
          }
        }, 3000); // Complete after 3 seconds
      }
    }, 500); // Start processing after 0.5 seconds
    
    return res.status(202).json({
      message: "Text prompt received and generation started",
      requestId,
      status: "pending"
    });
  } catch (error) {
    console.error("Error in text-based generation:", error);
    return res.status(500).json({ 
      message: "Server error during generation" 
    });
  }
};

/**
 * Generate a 3D model from an uploaded image
 */
export const generateFromImage = async (req: Request, res: Response) => {
  try {
    const { imageId, prompt } = req.body;
    
    if (!imageId) {
      return res.status(400).json({ 
        message: "Image ID is required" 
      });
    }
    
    // Generate a unique ID for this request
    const requestId = `image_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Store the request
    generationRequests.set(requestId, {
      prompt: prompt || "Image-based generation",
      type: "image",
      status: "pending",
      createdAt: new Date()
    });
    
    // Mock starting the generation process
    // In a real application, this would be a call to a 3D generation service
    setTimeout(() => {
      const request = generationRequests.get(requestId);
      if (request) {
        request.status = "processing";
        generationRequests.set(requestId, request);
        
        // Mock completing the process after some time
        setTimeout(() => {
          const request = generationRequests.get(requestId);
          if (request) {
            request.status = "completed";
            request.result = {
              modelId: requestId,
              modelType: "box", // Default for image-based
              color: "#1976D2" // Default blue
            };
            generationRequests.set(requestId, request);
          }
        }, 4000); // Complete after 4 seconds
      }
    }, 1000); // Start processing after 1 second
    
    return res.status(202).json({
      message: "Image received and generation started",
      requestId,
      status: "pending"
    });
  } catch (error) {
    console.error("Error in image-based generation:", error);
    return res.status(500).json({ 
      message: "Server error during generation" 
    });
  }
};

/**
 * Get the status of a generation request
 */
export const getGenerationStatus = (req: Request, res: Response) => {
  const { requestId } = req.params;
  
  const request = generationRequests.get(requestId);
  if (!request) {
    return res.status(404).json({ 
      message: "Generation request not found" 
    });
  }
  
  return res.status(200).json({
    requestId,
    type: request.type,
    status: request.status,
    prompt: request.prompt,
    result: request.result,
    createdAt: request.createdAt
  });
};

// Helper functions for model generation

function determineModelType(prompt: string): string {
  const prompt_lower = prompt.toLowerCase();
  
  if (prompt_lower.includes("car") || prompt_lower.includes("vehicle")) {
    return "box";
  } else if (prompt_lower.includes("ball") || prompt_lower.includes("sphere")) {
    return "sphere";
  } else if (prompt_lower.includes("donut") || prompt_lower.includes("ring")) {
    return "torus";
  } else if (prompt_lower.includes("tree") || prompt_lower.includes("tower")) {
    return "cylinder";
  }
  
  // Default
  return "sphere";
}

function determineModelColor(prompt: string): string {
  const prompt_lower = prompt.toLowerCase();
  
  if (prompt_lower.includes("red")) {
    return "#E53935";
  } else if (prompt_lower.includes("blue")) {
    return "#1E88E5";
  } else if (prompt_lower.includes("green")) {
    return "#43A047";
  } else if (prompt_lower.includes("yellow")) {
    return "#FDD835";
  } else if (prompt_lower.includes("purple")) {
    return "#8E24AA";
  } else if (prompt_lower.includes("pink")) {
    return "#D81B60";
  } else if (prompt_lower.includes("orange")) {
    return "#FB8C00";
  }
  
  // Default blue
  return "#1976D2";
}
