import React from 'react';
import { PhotoItem, SlotAdjustments, CollageSettings } from '../types';

interface CollageCanvasProps {
  leftPhoto: PhotoItem;
  rightPhoto: PhotoItem;
  leftAdj: SlotAdjustments;
  rightAdj: SlotAdjustments;
  settings: CollageSettings;
}

export const CollageCanvas: React.FC<CollageCanvasProps> = ({
  leftPhoto,
  rightPhoto,
  leftAdj,
  rightAdj,
  settings,
}) => {
  const getAspectClass = () => {
    switch (settings.aspectRatio) {
      case '16:9':
        return 'aspect-[16/9]';
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16] max-h-[700px]';
      case '3:2':
        return 'aspect-[3/2]';
      default:
        return 'aspect-[16/9]';
    }
  };

  const isHorizontal = settings.orientation === 'horizontal';

  // Badge rendering helper
  const renderBadge = (text: string, isLeft: boolean) => {
    if (!text || !settings.showBadges) return null;

    let styleClass = '';
    let textColor = 'text-white';

    if (settings.badgeStyle === 'warning') {
      styleClass = isLeft
        ? 'bg-amber-500 text-slate-950 font-black border-2 border-slate-950 shadow-md'
        : 'bg-emerald-500 text-slate-950 font-black border-2 border-slate-950 shadow-md';
      textColor = 'text-slate-950';
    } else if (settings.badgeStyle === 'glass') {
      styleClass = isLeft
        ? 'bg-slate-950/85 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-xl'
        : 'bg-slate-950/85 backdrop-blur-md text-emerald-300 border border-emerald-400/40 shadow-xl';
    } else if (settings.badgeStyle === 'steel') {
      styleClass = 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-slate-100 border border-slate-500 shadow-lg';
    } else if (settings.badgeStyle === 'stamp') {
      styleClass = isLeft
        ? 'border-2 border-orange-500 bg-slate-950/70 text-orange-400 uppercase tracking-widest'
        : 'border-2 border-emerald-500 bg-slate-950/70 text-emerald-400 uppercase tracking-widest';
    } else {
      // pill
      styleClass = 'bg-slate-900/90 text-white border border-white/20 shadow-md';
    }

    const sizeClass =
      settings.badgeSize === 'lg'
        ? 'text-sm sm:text-base px-3.5 py-1.5'
        : settings.badgeSize === 'sm'
        ? 'text-[10px] sm:text-xs px-2.5 py-1'
        : 'text-xs sm:text-sm px-3 py-1.5';

    const radiusClass = settings.badgeStyle === 'pill' ? 'rounded-full' : 'rounded-lg';

    const positionClass = settings.badgePosition.startsWith('bottom')
      ? 'bottom-3 sm:bottom-4'
      : 'top-3 sm:top-4';

    return (
      <div className={`absolute z-10 ${positionClass} left-3 sm:left-4 pointer-events-none`}>
        <span
          className={`inline-flex items-center font-extrabold uppercase tracking-wide select-none ${styleClass} ${sizeClass} ${radiusClass}`}
        >
          {text}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        id="collage-preview-container"
        className={`w-full max-w-4xl ${getAspectClass()} relative overflow-hidden select-none shadow-2xl transition-all`}
        style={{
          backgroundColor: settings.canvasBgColor || '#0f172a',
          padding: `${settings.canvasPadding}px`,
          borderRadius: `${settings.cornerRadius}px`,
          borderWidth: `${settings.borderWidth}px`,
          borderColor: settings.borderColor || '#334155',
          borderStyle: settings.borderWidth > 0 ? 'solid' : 'none',
        }}
      >
        {/* Main Content Layout (Horizontal or Vertical) */}
        <div
          className={`w-full h-full relative flex ${
            isHorizontal ? 'flex-row' : 'flex-col'
          }`}
        >
          {/* Left Slot: În lucru / Atelier */}
          <div
            className="relative flex-1 overflow-hidden bg-slate-950 flex items-center justify-center"
            style={{
              borderRadius: `${settings.innerCornerRadius}px`,
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                filter: `brightness(${leftAdj.brightness}%) contrast(${leftAdj.contrast}%) ${
                  leftAdj.warmth > 0
                    ? `sepia(${leftAdj.warmth * 0.4}%) saturate(${100 + leftAdj.warmth * 0.5}%)`
                    : leftAdj.warmth < 0
                    ? `hue-rotate(${leftAdj.warmth * 0.5}deg) saturate(${100 + leftAdj.warmth * 0.3}%)`
                    : ''
                }`,
              }}
            >
              <img
                src={leftPhoto.url}
                alt={settings.leftBadgeText}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(${leftAdj.panX}%, ${leftAdj.panY}%) scale(${leftAdj.zoom}) rotate(${leftAdj.rotation}deg) ${
                    leftAdj.flipH ? 'scaleX(-1)' : ''
                  }`,
                }}
              />
            </div>
            {renderBadge(settings.leftBadgeText, true)}
          </div>

          {/* Divider Line */}
          {settings.showDivider && settings.dividerWidth > 0 && (
            <div
              className="relative flex items-center justify-center flex-shrink-0 z-20"
              style={{
                width: isHorizontal ? `${settings.dividerWidth}px` : '100%',
                height: isHorizontal ? '100%' : `${settings.dividerWidth}px`,
                backgroundColor: settings.dividerStyle === 'double' ? 'transparent' : settings.dividerColor,
                borderTop: !isHorizontal && settings.dividerStyle === 'dashed' ? `dashed ${settings.dividerWidth}px ${settings.dividerColor}` : undefined,
                borderLeft: isHorizontal && settings.dividerStyle === 'dashed' ? `dashed ${settings.dividerWidth}px ${settings.dividerColor}` : undefined,
                boxShadow: `0 0 12px ${settings.dividerColor}44`,
              }}
            >
              {/* Optional Center dual arrow icon */}
              {settings.showCenterIcon && (
                <div
                  className="absolute w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-black shadow-xl border-2 pointer-events-none select-none z-30"
                  style={{
                    borderColor: settings.dividerColor,
                    color: settings.dividerColor,
                  }}
                >
                  ⇄
                </div>
              )}
            </div>
          )}

          {/* Right Slot: Final / Montat la client */}
          <div
            className="relative flex-1 overflow-hidden bg-slate-950 flex items-center justify-center"
            style={{
              borderRadius: `${settings.innerCornerRadius}px`,
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                filter: `brightness(${rightAdj.brightness}%) contrast(${rightAdj.contrast}%) ${
                  rightAdj.warmth > 0
                    ? `sepia(${rightAdj.warmth * 0.4}%) saturate(${100 + rightAdj.warmth * 0.5}%)`
                    : rightAdj.warmth < 0
                    ? `hue-rotate(${rightAdj.warmth * 0.5}deg) saturate(${100 + rightAdj.warmth * 0.3}%)`
                    : ''
                }`,
              }}
            >
              <img
                src={rightPhoto.url}
                alt={settings.rightBadgeText}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(${rightAdj.panX}%, ${rightAdj.panY}%) scale(${rightAdj.zoom}) rotate(${rightAdj.rotation}deg) ${
                    rightAdj.flipH ? 'scaleX(-1)' : ''
                  }`,
                }}
              />
            </div>
            {renderBadge(settings.rightBadgeText, false)}
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-500 font-medium">
        Preview live colaj side-by-side • Rezoluția la export va fi optimizată automat pentru claritate maximă
      </div>
    </div>
  );
};
