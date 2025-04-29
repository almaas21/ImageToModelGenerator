import { ModelObject } from './models';

/**
 * Interface for 3D model generation request
 */
export interface ModelGenerationRequest {
  description: string;
  file_path_save_to: string;
  quality?: 'medium' | 'high';
  usage_instruction?: string;
}

/**
 * Interface for 3D model generation API response
 */
interface ModelGenerationResponse {
  file_path: string;
}

/**
 * Generate a 3D model from a text prompt using the generate_3d_model API
 */
export async function generateModelFromText(
  description: string,
  modelId: string
): Promise<string> {
  try {
    const filePath = `client/public/models/${modelId}.glb`;
    
    // Call the API to generate the 3D model
    const response = await fetch('/api/generate3d', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        file_path: filePath,
        quality: 'medium' // Can be 'medium' or 'high'
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate model: ${response.statusText}`);
    }
    
    const data = await response.json() as ModelGenerationResponse;
    
    // Return the public URL to the model
    return `/models/${modelId}.glb`;
  } catch (error) {
    console.error("Error generating 3D model:", error);
    throw new Error("Failed to generate 3D model");
  }
}

/**
 * Process multiple images into a single 3D model
 * This would normally involve photogrammetry/structure-from-motion techniques
 * Currently, this will use the first image to generate a model
 */
export async function processMultiAngleImages(
  images: File[],
  modelId: string
): Promise<string> {
  try {
    if (images.length === 0) {
      throw new Error("No images provided");
    }
    
    const filePath = `client/public/models/${modelId}.glb`;
    
    // For now, we'll just use the first image as a prompt
    // In a real photogrammetry solution, we would upload all images
    // to be processed by a server-side photogrammetry service
    
    // Convert the image to a base64 string
    const imageFile = images[0];
    const reader = new FileReader();
    
    const imageDataPromise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Could not read image as string'));
        }
      };
      reader.onerror = reject;
    });
    
    reader.readAsDataURL(imageFile);
    const imageData = await imageDataPromise;
    
    // Call the API to generate the 3D model from the image
    const response = await fetch('/api/generate3d-from-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_data: imageData,
        file_path: filePath,
        quality: 'medium' // Can be 'medium' or 'high'
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate model: ${response.statusText}`);
    }
    
    const data = await response.json() as ModelGenerationResponse;
    
    // Return the public URL to the model
    return `/models/${modelId}.glb`;
  } catch (error) {
    console.error("Error processing multi-angle images:", error);
    throw new Error("Failed to process images into 3D model");
  }
}