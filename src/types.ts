export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16' | '3:2' | 'original';

export type DividerStyle = 'solid' | 'dashed' | 'double' | 'none';

export type BadgeStyle = 'warning' | 'glass' | 'pill' | 'steel' | 'stamp';

export type BadgePosition = 'top-inside' | 'top-outside' | 'bottom-inside' | 'bottom-outside';

export type LayoutOrientation = 'horizontal' | 'vertical';

export interface PhotoItem {
  id: string;
  name: string;
  url: string; // Object URL or base64 data URL
  width?: number;
  height?: number;
  size?: number;
  addedAt: number;
}

export interface SlotAdjustments {
  zoom: number; // 1.0 to 3.0
  panX: number; // -100 to 100 (%)
  panY: number; // -100 to 100 (%)
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  brightness: number; // 50 to 150 (%)
  contrast: number; // 50 to 150 (%)
  warmth: number; // -50 to 50
}

export interface CollageSettings {
  // Orientation & Ratio
  orientation: LayoutOrientation;
  aspectRatio: AspectRatio;
  
  // Divider
  showDivider: boolean;
  dividerWidth: number; // 1 - 20 px
  dividerColor: string;
  dividerStyle: DividerStyle;
  showCenterIcon: boolean;

  // Labels / Badges
  showBadges: boolean;
  leftBadgeText: string;
  rightBadgeText: string;
  badgeStyle: BadgeStyle;
  badgePosition: BadgePosition;
  badgeSize: 'sm' | 'md' | 'lg';
  badgeBgColor: string;
  badgeTextColor: string;

  // Border & Canvas
  borderWidth: number; // 0 - 30 px
  borderColor: string;
  canvasPadding: number; // 0 - 40 px
  canvasBgColor: string;
  cornerRadius: number; // 0 - 32 px
  innerCornerRadius: number; // 0 - 24 px

  // Watermark / Branding
  showWatermark: boolean;
  companyName: string;
  companyPhone: string;
  watermarkPosition: 'bottom-right' | 'bottom-center' | 'bottom-bar' | 'top-right';
  watermarkOpacity: number; // 0.2 to 1.0

  // Export
  exportQuality: number; // 0.7 to 1.0
  exportResolutionMultiplier: number; // 1x, 2x, 3x
  exportFormat: 'image/jpeg' | 'image/png';
}

export interface PresetProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  leftImage: {
    url: string;
    label: string;
    caption: string;
  };
  rightImage: {
    url: string;
    label: string;
    caption: string;
  };
  suggestedSettings?: Partial<CollageSettings>;
}

export interface PhotoAnalysis {
  photoId: string;
  category: 'in_lucru' | 'final';
  label: string;
  confidence?: number;
  qualityScore: number;
  reason: string;
  isBestCandidate: boolean;
}

export interface AnalysisSummary {
  inLucru: PhotoAnalysis[];
  final: PhotoAnalysis[];
  bestInLucruId: string | null;
  bestFinalId: string | null;
}
