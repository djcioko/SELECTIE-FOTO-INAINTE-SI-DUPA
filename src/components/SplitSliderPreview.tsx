import React, { useState, useRef, useEffect } from 'react';
import { PhotoItem, SlotAdjustments } from '../types';

interface SplitSliderPreviewProps {
  leftPhoto: PhotoItem;
  rightPhoto: PhotoItem;
  leftAdj: SlotAdjustments;
  rightAdj: SlotAdjustments;
  leftLabel: string;
  rightLabel: string;
  aspectRatio: string;
}

export const SplitSliderPreview: React.FC<SplitSliderPreviewProps> = ({
  leftPhoto,
  rightPhoto,
  leftAdj,
  rightAdj,
  leftLabel,
  rightLabel,
  aspectRatio,
}) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16:9':
        return 'aspect-[16/9]';
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16] max-h-[600px]';
      case '3:2':
        return 'aspect-[3/2]';
      default:
        return 'aspect-[16/9]';
    }
  };

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const offset = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (offset / rect.width) * 100));
      setSliderPos(pct);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={containerRef}
        className={`w-full max-w-4xl ${getAspectClass()} relative rounded-2xl overflow-hidden select-none shadow-2xl border border-slate-700 bg-slate-950 cursor-ew-resize`}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        {/* Right Image (Background layer: Final / Montat) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={rightPhoto.url}
            alt={rightLabel}
            className="w-full h-full object-cover pointer-events-none"
            style={{
              transform: `translate(${rightAdj.panX}%, ${rightAdj.panY}%) scale(${rightAdj.zoom}) rotate(${rightAdj.rotation}deg) ${
                rightAdj.flipH ? 'scaleX(-1)' : ''
              }`,
              filter: `brightness(${rightAdj.brightness}%) contrast(${rightAdj.contrast}%)`,
            }}
          />
          {/* Label Right */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-500 text-slate-950 shadow-lg border border-emerald-400">
              {rightLabel}
            </span>
          </div>
        </div>

        {/* Left Image (Clipped layer: În lucru / Atelier) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="relative h-full overflow-hidden"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            }}
          >
            <img
              src={leftPhoto.url}
              alt={leftLabel}
              className="w-full h-full object-cover pointer-events-none"
              style={{
                transform: `translate(${leftAdj.panX}%, ${leftAdj.panY}%) scale(${leftAdj.zoom}) rotate(${leftAdj.rotation}deg) ${
                  leftAdj.flipH ? 'scaleX(-1)' : ''
                }`,
                filter: `brightness(${leftAdj.brightness}%) contrast(${leftAdj.contrast}%)`,
              }}
            />
          </div>
          {/* Label Left */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="px-3 py-1.5 rounded-lg text-xs font-black bg-amber-500 text-slate-950 shadow-lg border border-amber-400">
              {leftLabel}
            </span>
          </div>
        </div>

        {/* Draggable Divider Line & Handle */}
        <div
          className="absolute inset-y-0 w-1 bg-amber-400 z-20 shadow-[0_0_15px_rgba(245,158,11,0.6)] cursor-ew-resize flex items-center justify-center -translate-x-1/2"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-amber-500 border-2 border-white text-slate-950 flex items-center justify-center shadow-xl font-black text-xs select-none">
            ⇄
          </div>
        </div>
      </div>

      <div className="text-center mt-3 text-xs text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span>Trage cursorul stânga-dreapta pentru a inspecta detaliile lucrării de confecție metalică</span>
      </div>
    </div>
  );
};
