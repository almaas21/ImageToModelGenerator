import { Router } from "express";
import { uploadImage, getUploadStatus, completeProcessing } from "../controllers/uploadController";
import { generateFromText, generateFromImage, getGenerationStatus } from "../controllers/generationController";

const router = Router();

// Upload endpoints
router.post("/upload", uploadImage);
router.get("/upload/:fileId", getUploadStatus);
router.post("/upload/:fileId/complete", completeProcessing); // For demo/testing

// Generation endpoints
router.post("/generate/text", generateFromText);
router.post("/generate/image", generateFromImage);
router.get("/generate/:requestId", getGenerationStatus);

export default router;
