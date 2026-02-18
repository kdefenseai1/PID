// Using @vladmandic/face-api models hosted on jsdelivr to avoid local file serving issues in this environment
export const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

// Distance threshold (lower = stricter). 
// 0.6 is typical default. 
// We set this to 0.4 to drastically reduce false positives (preventing "different person" matches).
// Any match with distance > 0.4 will be rejected as Unknown.
export const CONFIDENCE_THRESHOLD = 0.4; 

// Local Storage Key
export const DB_KEY = 'sentinel_face_db_v1';

// Max dimension for stored thumbnails to save LocalStorage space
export const MAX_THUMBNAIL_SIZE = 150;

export const VIDEO_SIZE = {
  width: 640,
  height: 480
};