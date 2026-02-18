import React, { useRef, useEffect, useState } from 'react';
import { VIDEO_SIZE } from '../constants';

interface CameraProps {
  onVideoReady: (video: HTMLVideoElement) => void;
  isActive: boolean;
}

export const Camera: React.FC<CameraProps> = ({ onVideoReady, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };


  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (!isActive) return;

      try {
        // Try optimal constraints first
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: VIDEO_SIZE.width },
            height: { ideal: VIDEO_SIZE.height },
            facingMode: facingMode
          }
        });
      } catch (err) {

        console.warn("Specific camera constraints failed, trying fallback...", err);
        try {
          // Fallback: Try to get ANY video stream
          stream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
        } catch (fallbackErr) {
          console.error("Camera access absolutely denied:", fallbackErr);
          setError("Camera device not found or permission denied.");
          return;
        }
      }

      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for metadata to load to ensure dimensions are correct
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            onVideoReady(videoRef.current);
          }
        };
      }
    };

    if (isActive) {
      startCamera();
    } else {
      // Stop stream if inactive
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, onVideoReady, facingMode]);


  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-700">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-red-500 z-50 p-4 text-center">
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        width={VIDEO_SIZE.width}
        height={VIDEO_SIZE.height}
        className={`w-full h-auto object-cover transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        muted
        playsInline
      />
      {/* Camera Toggle Button */}
      <button
        onClick={toggleCamera}
        className="absolute bottom-6 right-6 z-10 p-4 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95"
        title="Flip Camera"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
      </button>

      {/* HUD Overlay Lines & Silhouette */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Guide Lines (Corners) */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg"></div>

        {/* Passport Photo Style Guideline */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet" className="h-[85%] w-auto drop-shadow-lg">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="black" />
              </filter>
            </defs>

            {/* Face Oval */}
            <ellipse
              cx="150" cy="160" rx="70" ry="90"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="8,8"
              filter="url(#shadow)"
            />

            {/* Shoulder Curve */}
            <path
              d="M 30 400 Q 150 280 270 400"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="8,8"
              filter="url(#shadow)"
            />

            {/* Central Vertical Axis */}
            <line
              x1="150" y1="20" x2="150" y2="380"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeDasharray="10,5"
              opacity="0.6"
            />

            {/* Eye Level Guide (Approximate) */}
            <line
              x1="100" y1="160" x2="200" y2="160"
              stroke="#06b6d4"
              strokeWidth="1"
              opacity="0.4"
            />

            {/* Top Head Limit */}
            <line
              x1="130" y1="70" x2="170" y2="70"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Chin Limit */}
            <line
              x1="140" y1="250" x2="160" y2="250"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};