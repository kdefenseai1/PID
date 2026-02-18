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
        // Calculate font size relative to height to keep it visually consistent
        // 18px at 480px height is a good baseline
        const fontSize = Math.max(14, Math.floor((height / 480) * 18));
        const padding = fontSize * 0.6;
        ctx.font = `bold ${fontSize}px "Inter", "Pretendard", system-ui, sans-serif`;

        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;
        const bgHeight = fontSize + padding;
        const bgWidth = textWidth + padding * 2;

        // Label Background (Bottom Center of Box)
        const labelX = drawX + (boxW / 2) - (bgWidth / 2);
        const labelY = y + boxH + (height * 0.02); // 2% of height offset

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.95;

        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(labelX, labelY, bgWidth, bgHeight, 4) : ctx.rect(labelX, labelY, bgWidth, bgHeight);
        ctx.fill();

        // Text
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFFFFF'; // White text for better contrast on dark/colored bg
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, labelX + bgWidth / 2, labelY + bgHeight / 2 + 1); // +1 for visual baseline adjustment
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