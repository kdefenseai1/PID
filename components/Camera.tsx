import React, { useRef, useEffect, useState } from 'react';
import { VIDEO_SIZE } from '../constants';

interface CameraProps {
  onVideoReady: (video: HTMLVideoElement) => void;
  isActive: boolean;
}

export const Camera: React.FC<CameraProps> = ({ onVideoReady, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

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
            facingMode: 'user' // Prefer front camera
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
  }, [isActive, onVideoReady]);

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
        className="w-full h-auto object-cover transform scale-x-[-1]" // Mirror effect
        muted
        playsInline
      />
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