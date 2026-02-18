import * as faceapi from '@vladmandic/face-api';
import { FaceRecord, RecognitionMatch } from '../types';
import { MODEL_URL, CONFIDENCE_THRESHOLD, MAX_THUMBNAIL_SIZE } from '../constants';

// Singleton service to manage Face API state
class FaceService {
  private labeledDescriptors: faceapi.LabeledFaceDescriptors[] = [];
  private faceMatcher: faceapi.FaceMatcher | null = null;
  public isModelsLoaded = false;

  async loadModels(): Promise<void> {
    if (this.isModelsLoaded) return;

    try {
      console.log('Loading Face API models...');
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      this.isModelsLoaded = true;
      console.log('Models loaded successfully');
    } catch (error) {
      console.error('Failed to load face models:', error);
      throw new Error('Failed to load AI models. Please check your internet connection.');
    }
  }

  // Optimized detection options to reduce noise
  private getDetectionOptions() {
    // minConfidence 0.5 filters out weak face detections that cause bad vectors
    return new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
  }

  async getDescriptor(videoElement: HTMLVideoElement): Promise<{ descriptor: Float32Array; detection: faceapi.FaceDetection } | null> {
    if (!this.isModelsLoaded || videoElement.paused || videoElement.ended) return null;

    // Detect single face with landmarks and descriptor using stricter options
    const result = await faceapi
      .detectSingleFace(videoElement, this.getDetectionOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!result) return null;

    return {
      descriptor: result.descriptor,
      detection: result.detection
    };
  }

  /**
   * Enhanced image processing for Upload/Enrollment.
   * Implements "Smart Crop": Crops the image so the face occupies 55% of the height.
   * This ensures high-resolution features are fed to the neural network,
   * significantly improving accuracy for small faces or wide shots.
   */
  async getDescriptorFromImage(imageElement: HTMLImageElement): Promise<{ descriptor: Float32Array; detection: faceapi.FaceDetection } | null> {
    if (!this.isModelsLoaded) return null;

    // 1. First Pass: Detect face in the original full image
    const initialResult = await faceapi
      .detectSingleFace(imageElement, this.getDetectionOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!initialResult) return null;

    // 2. Smart Crop Logic
    const box = initialResult.detection.box;
    const faceHeight = box.height;

    // Target: Face height should be 55% of the canvas height.
    // Formula: canvasHeight = faceHeight / 0.55
    const targetHeight = faceHeight / 0.55;
    const targetWidth = targetHeight; // Keep crop square for optimal neural net input

    // Calculate crop coordinates (Center the crop on the face center)
    const centerX = box.x + (box.width / 2);
    const centerY = box.y + (box.height / 2);
    
    const cropX = centerX - (targetWidth / 2);
    const cropY = centerY - (targetHeight / 2);

    // Create a temporary canvas for the crop
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        // Fallback to original if context fails
        return { descriptor: initialResult.descriptor, detection: initialResult.detection };
    }

    // Fill background with black (handles cases where crop extends outside image)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Calculate intersection of Crop Box and Image to draw correctly
    const srcX = Math.max(0, cropX);
    const srcY = Math.max(0, cropY);
    const srcW = Math.min(imageElement.width, cropX + targetWidth) - srcX;
    const srcH = Math.min(imageElement.height, cropY + targetHeight) - srcY;

    // Destination coordinates on the canvas
    const destX = (srcX - cropX);
    const destY = (srcY - cropY);

    if (srcW > 0 && srcH > 0) {
        ctx.drawImage(imageElement, srcX, srcY, srcW, srcH, destX, destY, srcW, srcH);
    }

    // 3. Second Pass: Detect on the Smart Cropped Canvas
    // This generates a higher quality descriptor because the face is larger relative to the input tensor.
    const cropResult = await faceapi
      .detectSingleFace(canvas, this.getDetectionOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (cropResult) {
        // SUCCESS: Return the HIGH-QUALITY descriptor from the crop,
        // but return the ORIGINAL detection box so the UI draws it correctly on the full image.
        return {
            descriptor: cropResult.descriptor,
            detection: initialResult.detection 
        };
    }

    // Fallback: If crop detection failed (rare), use the initial result
    return {
        descriptor: initialResult.descriptor,
        detection: initialResult.detection
    };
  }

  // Convert raw DB records to FaceAPI's matching format
  loadFaceMatcher(records: FaceRecord[]) {
    if (records.length === 0) {
      this.faceMatcher = null;
      return;
    }

    // Group descriptors by personId
    const groups: { [key: string]: Float32Array[] } = {};
    
    records.forEach(record => {
      // Fallback for old records without personId: use id
      const key = record.personId || record.id;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(record.descriptor);
    });

    this.labeledDescriptors = Object.keys(groups).map(key => {
      return new faceapi.LabeledFaceDescriptors(key, groups[key]);
    });

    // Initialize matcher with the strict threshold defined in constants
    this.faceMatcher = new faceapi.FaceMatcher(this.labeledDescriptors, CONFIDENCE_THRESHOLD);
  }

  identifyFace(descriptor: Float32Array, records: FaceRecord[]): RecognitionMatch | null {
    if (!this.faceMatcher) return null;

    // findBestMatch returns the label with the shortest Euclidean distance
    const match = this.faceMatcher.findBestMatch(descriptor);

    // Strict validation: if the distance is greater than our strict threshold, reject.
    if (match.label === 'unknown' || match.distance > CONFIDENCE_THRESHOLD) {
      return null;
    }

    // match.label is now the personId
    const matchedPersonId = match.label;
    
    // Find the latest record for this person to get metadata
    const matchedRecords = records.filter(r => (r.personId === matchedPersonId) || (r.id === matchedPersonId));
    
    if (matchedRecords.length === 0) return null;

    const displayRecord = matchedRecords[matchedRecords.length - 1];

    // UX Scoring Algorithm:
    // We Map the valid range [0.0, CONFIDENCE_THRESHOLD] to [100%, 60%]
    // This ensures that any match passing the strict threshold looks "Good" to the user,
    // while exact matches stay near 100%.
    // Formula: Score = 100 - ( (distance / threshold) * 40 )
    // Example with Threshold 0.4:
    //   Distance 0.00 -> 100 - (0 * 40) = 100%
    //   Distance 0.10 -> 100 - (0.25 * 40) = 90%
    //   Distance 0.20 -> 100 - (0.5 * 40) = 80%
    //   Distance 0.36 -> 100 - (0.9 * 40) = 64%
    //   Distance 0.40 -> 100 - (1.0 * 40) = 60% (Cutoff)
    const normalizedScore = 100 - ((match.distance / CONFIDENCE_THRESHOLD) * 40);
    const similarity = Math.min(100, Math.max(0, normalizedScore));

    return {
      name: displayRecord.name,
      title: displayRecord.title,
      age: displayRecord.age,
      gender: displayRecord.gender,
      distance: match.distance,
      similarity: similarity,
      personId: matchedPersonId,
      recordId: displayRecord.id
    };
  }

  // Helper: Create a small thumbnail for the database view to save storage
  async createThumbnail(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Calculate scale to fit within MAX_THUMBNAIL_SIZE
        const scale = Math.min(MAX_THUMBNAIL_SIZE / img.width, MAX_THUMBNAIL_SIZE / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Compress to JPEG 0.7 quality to save space
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          reject(new Error('Canvas context not available'));
        }
      };
      img.onerror = (err) => reject(err);
      img.src = imageUrl;
    });
  }

  // Helper: Convert Float32Array to regular array for JSON storage
  serializeDescriptor(descriptor: Float32Array): number[] {
    return Array.from(descriptor);
  }

  // Helper: Convert regular array back to Float32Array
  deserializeDescriptor(array: number[]): Float32Array {
    return new Float32Array(array);
  }
}

export const faceService = new FaceService();