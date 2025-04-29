import { ModelObject } from "@/lib/models";
import { downloadModelAsObj } from "@/lib/exporters";
import { generateModelFromText, processMultiAngleImages } from "@/lib/modelGeneration";

/**
 * Service for handling 3D model generation and related operations
 */
export class ModelService {
  /**
   * Generate a 3D model from text prompt
   */
  static async generateFromText(prompt: string): Promise<ModelObject> {
    try {
      // Create a unique ID based on the prompt and timestamp
      const modelId = `model_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      
      // Call our API to generate the model
      const modelUrl = await generateModelFromText(prompt, modelId);
      
      // Generate a fallback primitive model as backup
      const primitiveShape = determineShape(prompt);
      const primitiveColor = determineColor(prompt);
      
      // Return model object with both the GLTF path and primitive backup
      return {
        id: modelId,
        name: prompt.substring(0, 30),
        type: 'gltf',
        shape: primitiveShape, // Fallback shape if GLTF fails
        color: primitiveColor, // Fallback color if GLTF fails
        scale: 1.0,
        modelUrl: modelUrl
      };
    } catch (error) {
      console.error("Error generating model from text:", error);
      
      // Create a fallback primitive model
      const modelId = `fallback_${Date.now()}`;
      const primitiveShape = determineShape(prompt);
      const primitiveColor = determineColor(prompt);
      
      console.log("Using fallback primitive model");
      
      return {
        id: modelId,
        name: prompt.substring(0, 30),
        type: 'primitive',
        shape: primitiveShape,
        color: primitiveColor,
        scale: 1.0
      };
    }
  }
  
  /**
   * Generate a 3D model from images
   */
  static async generateFromImages(images: File[]): Promise<ModelObject> {
    try {
      if (images.length === 0) {
        throw new Error("No images provided");
      }
      
      // Create a unique ID based on the first image name and timestamp
      const modelId = `model_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const mainImage = images[0];
      
      // Process the images to generate a 3D model
      const modelUrl = await processMultiAngleImages(images, modelId);
      
      // Return model object
      return {
        id: modelId,
        name: mainImage.name.split('.')[0] || "Generated_Model",
        type: 'gltf',
        shape: 'box', // Fallback shape if GLTF fails
        color: '#4285F4', // Default blue color for image-generated models
        scale: 1.0,
        modelUrl: modelUrl
      };
    } catch (error) {
      console.error("Error generating model from images:", error);
      
      // Create a fallback primitive model
      const modelId = `fallback_${Date.now()}`;
      
      console.log("Using fallback primitive model");
      
      return {
        id: modelId,
        name: images[0]?.name.split('.')[0] || "Generated_Model",
        type: 'primitive',
        shape: 'box',
        color: '#4285F4',
        scale: 1.0
      };
    }
  }
  
  /**
   * Download a 3D model
   */
  static async downloadModel(model: ModelObject, format: 'obj' | 'glb' = 'obj'): Promise<void> {
    try {
      if (format === 'obj') {
        // Use our custom exporter for OBJ format
        downloadModelAsObj(model);
      } else {
        // For GLB, we would normally download the file directly from the server
        // For now, we'll just create a download link for the demo
        if (model.modelUrl) {
          const link = document.createElement('a');
          link.href = model.modelUrl;
          link.download = `${model.name.replace(/\s+/g, '_')}.glb`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          throw new Error("No model URL available for GLB download");
        }
      }
    } catch (error) {
      console.error("Error downloading model:", error);
      throw new Error(`Failed to download 3D model in ${format.toUpperCase()} format`);
    }
  }
}

/**
 * Helper functions
 */

function determineShape(prompt: string): 'box' | 'sphere' | 'torus' | 'cylinder' {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('car') || promptLower.includes('vehicle') || 
      promptLower.includes('house') || promptLower.includes('building')) {
    return 'box';
  } else if (promptLower.includes('ball') || promptLower.includes('planet') || 
             promptLower.includes('round')) {
    return 'sphere';
  } else if (promptLower.includes('donut') || promptLower.includes('ring') || 
             promptLower.includes('wheel')) {
    return 'torus';
  } else if (promptLower.includes('tree') || promptLower.includes('tower') || 
             promptLower.includes('column')) {
    return 'cylinder';
  }
  
  // Default
  return 'box';
}

function determineColor(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('red')) return '#E53935';
  if (promptLower.includes('blue')) return '#1E88E5';
  if (promptLower.includes('green')) return '#43A047';
  if (promptLower.includes('yellow')) return '#FDD835';
  if (promptLower.includes('purple')) return '#8E24AA';
  if (promptLower.includes('pink')) return '#D81B60';
  if (promptLower.includes('orange')) return '#FB8C00';
  if (promptLower.includes('black')) return '#212121';
  if (promptLower.includes('white')) return '#FAFAFA';
  if (promptLower.includes('grey')) return '#757575';
  if (promptLower.includes('gold')) return '#FFD700';
  if (promptLower.includes('silver')) return '#C0C0C0';
  
  // Default
  return '#1976D2'; // Blue
}