import React, { useState } from 'react';
import {
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Sun,
  Contrast,
  SlidersHorizontal,
  ArrowLeftRight,
  Trash2,
  Wrench,
  CheckCircle,
  Move,
  Upload,
  X,
} from 'lucide-react';
import { PhotoItem, SlotAdjustments } from '../types';

interface SlotCardProps {
  side: 'left' | 'right';
  title: string;
  subtitle: string;
  defaultBadgeText: string;
  showBadges: boolean;
  photo: PhotoItem | null;
  adjustments: SlotAdjustments;
  onUpdateAdjustments: (adj: Partial<SlotAdjustments>) => void;
  onResetAdjustments: () => void;
  onClear: () => void;
  onSwap: () => void;
  onDropPhoto: (photo: PhotoItem) => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({
  side,
  title,
  subtitle,
  defaultBadgeText,
  showBadges,
  photo,
  adjustments,
  onUpdateAdjustments,
  onResetAdjustments,
  onClear,
  onSwap,
  onDropPhoto,
}) => {
  const [showAdjustPanel, setShowAdjustPanel] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const isLeft = side === 'left';
  const themeColor = isLeft ? 'amber' : 'emerald';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // If user dropped a file from filesystem directly
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const newPhoto: PhotoItem = {
        id: 'upload-' + Date.now(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        addedAt: Date.now(),
      };
      onDropPhoto(newPhoto);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border bg-slate-900/90 shadow-xl overflow-hidden transition-all flex flex-col ${
        isDragOver
          ? isLeft
            ? 'border-amber-400 ring-4 ring-amber-400/20'
            : 'border-emerald-400 ring-4 ring-emerald-400/20'
          : isLeft
          ? 'border-amber-500/30'
          : 'border-emerald-500/30'
      }`}
    >
      {/* Header bar */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${
          isLeft
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {isLeft ? (
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          )}
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100">
              {title}
            </h3>
            <p className="text-[11px] text-slate-400 leading-none">{subtitle}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {photo && (
            <>
              <button
                onClick={() => setShowAdjustPanel(!showAdjustPanel)}
                type="button"
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  showAdjustPanel
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
                title="Ajustează poziția, zoom și luminozitatea"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Ajustează</span>
              </button>

              <button
                onClick={onSwap}
                type="button"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                title="Schimbă locurile (Stânga ⇄ Dreapta)"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClear}
                type="button"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 hover:border-rose-500/40 transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                title="Șterge poza din acest slot (X)"
              >
                <X className="w-3.5 h-3.5" />
                <span className="text-[11px]">Șterge</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Preview / Empty Slot Area */}
      <div className="relative flex-1 min-h-[220px] sm:min-h-[260px] bg-slate-950 flex items-center justify-center overflow-hidden group/slot">
        {photo ? (
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center select-none">
            {/* Image rendered with transform & filters */}
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) ${
                  adjustments.warmth > 0
                    ? `sepia(${adjustments.warmth * 0.4}%) saturate(${100 + adjustments.warmth * 0.5}%)`
                    : adjustments.warmth < 0
                    ? `hue-rotate(${adjustments.warmth * 0.5}deg) saturate(${100 + adjustments.warmth * 0.3}%)`
                    : ''
                }`,
              }}
            >
              <img
                src={photo.url}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-100 ease-out pointer-events-none"
                style={{
                  transform: `translate(${adjustments.panX}%, ${adjustments.panY}%) scale(${
                    adjustments.zoom
                  }) rotate(${adjustments.rotation}deg) ${adjustments.flipH ? 'scaleX(-1)' : ''}`,
                }}
              />
            </div>

            {/* Prominent X button directly on the photo */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              type="button"
              className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white border border-slate-700 hover:border-rose-500 shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
              title={`Șterge poza din ${isLeft ? 'stânga (Atelier)' : 'dreapta (Final)'}`}
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Quick in-image overlay badge - shown when showBadges is true */}
            {showBadges && (
              <div className="absolute top-2.5 left-2.5 z-20">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black shadow-lg ${
                    isLeft
                      ? 'bg-amber-500 text-slate-950 border border-amber-300/40'
                      : 'bg-emerald-500 text-slate-950 border border-emerald-300/40'
                  }`}
                >
                  {defaultBadgeText}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="p-6 text-center flex flex-col items-center justify-center max-w-xs">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border ${
                isLeft
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              <Upload className="w-6 h-6 animate-bounce" />
            </div>
            <p className="text-sm font-bold text-slate-200">
              {isLeft ? 'Nicio poză de atelier' : 'Nicio poză cu lucrarea finală'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Trage o poză direct aici sau alege una din galeria de mai sus
            </p>
          </div>
        )}
      </div>

      {/* Adjustments Drawer */}
      {photo && showAdjustPanel && (
        <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 text-xs space-y-3">
          <div className="flex items-center justify-between font-bold text-slate-300">
            <span>Reglaje Imagine</span>
            <button
              onClick={onResetAdjustments}
              type="button"
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              Resetează
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3 h-3 text-amber-400" /> Zoom
              </span>
              <span>{Math.round(adjustments.zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.05"
              value={adjustments.zoom}
              onChange={(e) => onUpdateAdjustments({ zoom: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Pan X and Pan Y */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Move className="w-3 h-3" /> Poziție Orizont.
                </span>
                <span>{adjustments.panX}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={adjustments.panX}
                onChange={(e) => onUpdateAdjustments({ panX: parseInt(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Move className="w-3 h-3" /> Poziție Vertic.
                </span>
                <span>{adjustments.panY}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={adjustments.panY}
                onChange={(e) => onUpdateAdjustments({ panY: parseInt(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Brightness & Contrast */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" /> Luminozitate
                </span>
                <span>{adjustments.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                step="5"
                value={adjustments.brightness}
                onChange={(e) => onUpdateAdjustments({ brightness: parseInt(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Contrast className="w-3 h-3 text-amber-400" /> Contrast
                </span>
                <span>{adjustments.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                step="5"
                value={adjustments.contrast}
                onChange={(e) => onUpdateAdjustments({ contrast: parseInt(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Rotate & Flip */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <button
              onClick={() =>
                onUpdateAdjustments({
                  rotation: ((adjustments.rotation + 90) % 360),
                })
              }
              type="button"
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotește 90°</span>
            </button>
            <button
              onClick={() => onUpdateAdjustments({ flipH: !adjustments.flipH })}
              type="button"
              className={`flex-1 py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                adjustments.flipH
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>Oglindește</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
