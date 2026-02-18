import React, { useRef, useEffect } from 'react';
import { VIDEO_SIZE } from '../constants';

interface FaceCanvasProps {
  detection: { box: { x: number; y: number; width: number; height: number } } | null;
  label?: string;
  color?: string;
  width?: number;
  height?: number;
  mirror?: boolean;
}

export const FaceCanvas: React.FC<FaceCanvasProps> = ({ 
  detection, 
  label, 
  color = '#06b6d4', 
  width = VIDEO_SIZE.width, 
  height = VIDEO_SIZE.height,
  mirror = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (detection) {
      const { x, y, width: boxW, height: boxH } = detection.box;
      
      let drawX = x;
      if (mirror) {
        // Mirror the coordinates because the video is mirrored via CSS
        drawX = width - x - boxW;
      }

      // --- HUD Style Drawing ---
      const lineLen = Math.min(boxW, boxH) * 0.2; // Length of corner brackets
      const lineWidth = 3;

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'square';
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;

      // Draw Corners (Top-Left)
      ctx.beginPath();
      ctx.moveTo(drawX, y + lineLen);
      ctx.lineTo(drawX, y);
      ctx.lineTo(drawX + lineLen, y);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(drawX + boxW - lineLen, y);
      ctx.lineTo(drawX + boxW, y);
      ctx.lineTo(drawX + boxW, y + lineLen);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(drawX + boxW, y + boxH - lineLen);
      ctx.lineTo(drawX + boxW, y + boxH);
      ctx.lineTo(drawX + boxW - lineLen, y + boxH);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(drawX + lineLen, y + boxH);
      ctx.lineTo(drawX, y + boxH);
      ctx.lineTo(drawX, y + boxH - lineLen);
      ctx.stroke();

      // --- Label Drawing ---
      if (label) {
        const fontSize = 14;
        const padding = 8;
        ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
        
        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;
        const bgHeight = fontSize + padding * 2;
        const bgWidth = textWidth + padding * 2;

        // Label Background (Bottom Center of Box)
        // Positioned slightly below the box
        const labelX = drawX + (boxW / 2) - (bgWidth / 2);
        const labelY = y + boxH + 10; 

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        
        // Draw Label Background shape with small angled corners
        ctx.beginPath();
        ctx.moveTo(labelX, labelY);
        ctx.lineTo(labelX + bgWidth, labelY);
        ctx.lineTo(labelX + bgWidth, labelY + bgHeight);
        ctx.lineTo(labelX, labelY + bgHeight);
        ctx.fill();

        // Text
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#000000'; // Black text on colored background for contrast
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, labelX + bgWidth / 2, labelY + bgHeight / 2);
      }
    }
  }, [detection, label, color, width, height, mirror]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};