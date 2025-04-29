import { Request, Response } from 'express';
import path from 'path';
import { generateModelFromDescription, generateModelFromImageData } from '../utils/modelGenerator';

interface GenerateModelRequest {
  description: string;
  file_path: string;
  quality?: 'medium' | 'high';
}

interface GenerateModelFromImageRequest {
  image_data: string;
  file_path: string;
  quality?: 'medium' | 'high';
}

/**
 * Generate a 3D model from a text prompt
 */
export const generateModel = async (req: Request, res: Response) => {
  try {
    const { description, file_path, quality = 'medium' } = req.body as GenerateModelRequest;
    
    if (!description || !file_path) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Make sure the file path is valid
    const filePath = path.resolve(file_path);
    
    // Send immediate response to client to prevent timeout
    res.status(200).json({ 
      file_path: filePath,
      status: 'success',
      message: 'Model generation started'
    });
    
    // Asynchronously start the model generation process
    try {
      // Generate the 3D model
      await generateModelFromDescription(description, filePath, quality);
      
      console.log(`Successfully generated 3D model: ${filePath}`);
    } catch (genError) {
      console.error('Error during model generation:', genError);
      // We don't send this error to the client since we've already sent a response
    }
    
  } catch (error) {
    console.error('Error in generateModel:', error);
    res.status(500).json({ error: 'Failed to generate 3D model' });
  }
};

/**
 * Generate a 3D model from an image
 */
export const generateModelFromImage = async (req: Request, res: Response) => {
  try {
    const { image_data, file_path, quality = 'medium' } = req.body as GenerateModelFromImageRequest;
    
    if (!image_data || !file_path) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Make sure the file path is valid
    const filePath = path.resolve(file_path);
    
    // Validate the image data format (should be a base64 string)
    if (!image_data.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image data format' });
    }
    
    // Send immediate response to client to prevent timeout
    res.status(200).json({ 
      file_path: filePath,
      status: 'success',
      message: 'Model generation from image started'
    });
    
    // Asynchronously start the model generation process
    try {
      // Generate the 3D model from the image
      await generateModelFromImageData(image_data, filePath, quality);
      
      console.log(`Successfully generated 3D model from image: ${filePath}`);
    } catch (genError) {
      console.error('Error during model generation from image:', genError);
      // We don't send this error to the client since we've already sent a response
    }
    
  } catch (error) {
    console.error('Error in generateModelFromImage:', error);
    res.status(500).json({ error: 'Failed to generate 3D model from image' });
  }
};