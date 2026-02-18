export type Language = 'en' | 'ko';

export interface FaceRecord {
  id: string; // Unique ID for the specific image record
  personId: string; // Group ID for the person (Name + Role)
  name: string;
  title: string; // Position/Role
  gender: string;
  age: string;
  birth: string; // Birth Date/Year
  descriptor: Float32Array; // The 128-float vector embedding
  createdAt: number;
  previewImage?: string; // Base64 thumbnail
}

export interface RecognitionMatch {
  name: string;
  title: string;
  age: string;
  gender?: string;
  distance: number; // Euclidean distance (lower is better)
  similarity: number; // Converted to percentage (0-100)
  personId: string; // Matches the personId group
  recordId?: string; // Specific image matched (if available, otherwise generic)
}

export enum AppMode {
  ENROLL = 'ENROLL',
  RECOGNIZE = 'RECOGNIZE',
  DATABASE = 'DATABASE',
  ABOUT = 'ABOUT'
}

export interface ModelLoadState {
  isLoaded: boolean;
  error: string | null;
}

export interface Dossier {
  codename: string;
  role: string;
  threatLevel: string;
  biography: string;
}