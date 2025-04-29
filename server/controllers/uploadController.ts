import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage for uploaded files and their processing status
const uploadedFiles = new Map<string, {
  originalname: string,
  filename: string,
  status: "processing" | "completed" | "failed",
  result?: any
}>();

/**
 * Handle image upload for 3D model generation
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    // Check if the file exists in request
    if (!req.file) {
      return res.status(400).json({ 
        message: "No image file uploaded" 
      });
    }

    const fileId = Date.now().toString();
    
    // Mock file processing
    uploadedFiles.set(fileId, {
      originalname: req.file.originalname,
      filename: req.file.filename,
      status: "processing"
    });
    
    // In real application, we would process the image here
    // or send it to a processing service

    return res.status(202).json({
      message: "Image uploaded and processing started",
      fileId,
      status: "processing"
    });
  } catch (error) {
    console.error("Error in image upload:", error);
    return res.status(500).json({ 
      message: "Server error while processing upload" 
    });
  }
};

/**
 * Get status of an uploaded file
 */
export const getUploadStatus = (req: Request, res: Response) => {
  const { fileId } = req.params;
  
  const fileInfo = uploadedFiles.get(fileId);
  if (!fileInfo) {
    return res.status(404).json({ 
      message: "File not found" 
    });
  }
  
  return res.status(200).json({
    fileId,
    status: fileInfo.status,
    originalname: fileInfo.originalname,
    result: fileInfo.result
  });
};

/**
 * Mock completing a processing job (for demo purposes)
 */
export const completeProcessing = (req: Request, res: Response) => {
  const { fileId } = req.params;
  
  const fileInfo = uploadedFiles.get(fileId);
  if (!fileInfo) {
    return res.status(404).json({ 
      message: "File not found" 
    });
  }
  
  // Update status to completed
  fileInfo.status = "completed";
  fileInfo.result = {
    modelId: `model_${fileId}`,
    modelUrl: `/api/models/${fileId}`,
    previewUrl: `/api/previews/${fileId}`
  };
  
  uploadedFiles.set(fileId, fileInfo);
  
  return res.status(200).json({
    message: "Processing completed",
    fileId,
    status: fileInfo.status,
    result: fileInfo.result
  });
};
