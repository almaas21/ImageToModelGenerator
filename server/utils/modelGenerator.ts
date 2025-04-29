import { generateModel, generateModelFromImage } from "./replitModelGenerationApi";
import path from "path";
import fs from "fs";

/**
 * Generate a 3D model from a text description
 * @param description The text description of the 3D model
 * @param filePath Path to save the model file
 * @returns Promise that resolves to the file path of the generated model
 */
export async function generateModelFromDescription(
  description: string,
  filePath: string,
  quality: "medium" | "high" = "medium"
): Promise<string> {
  try {
    // Make sure the directory exists
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Format the description for better results
    const formattedDescription = formatDescription(description);
    
    // Call the Replit model generation API
    const modelPath = await generateModel(formattedDescription, filePath, quality);
    
    return modelPath;
  } catch (error) {
    console.error("Error generating model from description:", error);
    throw new Error("Failed to generate 3D model");
  }
}

/**
 * Generate a 3D model from an image
 * @param imageData Base64-encoded image data
 * @param filePath Path to save the model file
 * @returns Promise that resolves to the file path of the generated model
 */
export async function generateModelFromImageData(
  imageData: string,
  filePath: string,
  quality: "medium" | "high" = "medium"
): Promise<string> {
  try {
    // Make sure the directory exists
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // Extract image format and data
    const imageFormat = imageData.split(";")[0].split("/")[1];
    
    // Convert base64 to image and save temporarily
    const tempImagePath = path.join(directory, `temp_${Date.now()}.${imageFormat}`);
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(tempImagePath, Buffer.from(base64Data, "base64"));
    
    try {
      // Generate description from image (in a real implementation)
      // For now, use a generic description
      const description = "3D model generated from user image";
      
      // Call the Replit model generation API
      const modelPath = await generateModelFromImage(tempImagePath, filePath, quality);
      
      return modelPath;
    } finally {
      // Clean up temporary image file
      if (fs.existsSync(tempImagePath)) {
        fs.unlinkSync(tempImagePath);
      }
    }
  } catch (error) {
    console.error("Error generating model from image:", error);
    throw new Error("Failed to generate 3D model from image");
  }
}

/**
 * Format the description for better model generation results
 */
function formatDescription(description: string): string {
  // Enhance the description for better model generation
  let formatted = description.trim();
  
  // Add 3D model generation specific keywords if they're not already present
  if (!formatted.toLowerCase().includes("3d")) {
    formatted += ", 3D model";
  }
  
  if (!formatted.toLowerCase().includes("high detail")) {
    formatted += ", high detail";
  }
  
  // Add gaming asset context if not present
  if (!formatted.toLowerCase().includes("game asset") && 
      !formatted.toLowerCase().includes("gaming asset")) {
    formatted += ", game asset";
  }
  
  return formatted;
}