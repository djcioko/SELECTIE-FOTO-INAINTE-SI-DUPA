import { CollageSettings, SlotAdjustments } from '../types';

interface GenerateCanvasOptions {
  leftImageUrl: string;
  rightImageUrl: string;
  leftAdj: SlotAdjustments;
  rightAdj: SlotAdjustments;
  settings: CollageSettings;
  targetScale?: number; // 1, 2, 3
}

// Helper to load image as HTMLImageElement
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Eroare la încărcarea imaginii: ' + e));
    img.src = url;
  });
}

// Calculate base canvas dimensions depending on ratio & orientation
export function getCanvasDimensions(settings: CollageSettings, img1?: HTMLImageElement, img2?: HTMLImageElement): { width: number; height: number } {
  const baseDim = 2000;
  
  if (settings.aspectRatio === '16:9') {
    return { width: 2400, height: 1350 };
  } else if (settings.aspectRatio === '4:3') {
    return { width: 2000, height: 1500 };
  } else if (settings.aspectRatio === '1:1') {
    return { width: 2000, height: 2000 };
  } else if (settings.aspectRatio === '9:16') {
    return { width: 1350, height: 2400 };
  } else if (settings.aspectRatio === '3:2') {
    return { width: 2400, height: 1600 };
  } else {
    // 'original'
    if (img1 && img2) {
      if (settings.orientation === 'horizontal') {
        const h = Math.max(img1.naturalHeight || 1200, img2.naturalHeight || 1200);
        const w1 = (img1.naturalWidth || 1600) * (h / (img1.naturalHeight || 1200));
        const w2 = (img2.naturalWidth || 1600) * (h / (img2.naturalHeight || 1200));
        return { width: Math.round(w1 + w2), height: Math.round(h) };
      } else {
        const w = Math.max(img1.naturalWidth || 1600, img2.naturalWidth || 1600);
        const h1 = (img1.naturalHeight || 1200) * (w / (img1.naturalWidth || 1600));
        const h2 = (img2.naturalHeight || 1200) * (w / (img2.naturalWidth || 1600));
        return { width: Math.round(w), height: Math.round(h1 + h2) };
      }
    }
    return { width: 2400, height: 1350 };
  }
}

// Draw a single image fitted into a designated rectangle with pan, zoom, rotation and filters
function drawSlotImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  slot: { x: number; y: number; width: number; height: number; radius: number },
  adj: SlotAdjustments
) {
  ctx.save();

  // Create rounded clip for this slot
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(slot.x, slot.y, slot.width, slot.height, slot.radius);
  } else {
    ctx.rect(slot.x, slot.y, slot.width, slot.height);
  }
  ctx.clip();

  // Background behind slot in case image is panned
  ctx.fillStyle = '#111827';
  ctx.fillRect(slot.x, slot.y, slot.width, slot.height);

  // Apply filters
  const brightness = Math.max(20, Math.min(200, adj.brightness));
  const contrast = Math.max(20, Math.min(200, adj.contrast));
  let filterStr = `brightness(${brightness}%) contrast(${contrast}%)`;
  if (adj.warmth !== 0) {
    if (adj.warmth > 0) {
      filterStr += ` sepia(${adj.warmth * 0.4}%) saturate(${100 + adj.warmth * 0.5}%)`;
    } else {
      filterStr += ` hue-rotate(${adj.warmth * 0.5}deg) saturate(${100 + adj.warmth * 0.3}%)`;
    }
  }
  ctx.filter = filterStr;

  // Compute cover dimensions
  const slotRatio = slot.width / slot.height;
  const is90or270 = adj.rotation % 180 !== 0;
  const imgW = is90or270 ? (img.naturalHeight || img.height) : (img.naturalWidth || img.width);
  const imgH = is90or270 ? (img.naturalWidth || img.width) : (img.naturalHeight || img.height);
  const imgRatio = imgW / imgH;

  let renderW = slot.width;
  let renderH = slot.height;
  if (imgRatio > slotRatio) {
    renderW = slot.height * imgRatio;
  } else {
    renderH = slot.width / imgRatio;
  }

  // Apply user zoom
  renderW *= adj.zoom;
  renderH *= adj.zoom;

  // Center + user pan offsets
  const panOffsetX = (adj.panX / 100) * (slot.width * 0.5);
  const panOffsetY = (adj.panY / 100) * (slot.height * 0.5);

  const centerX = slot.x + slot.width / 2 + panOffsetX;
  const centerY = slot.y + slot.height / 2 + panOffsetY;

  ctx.translate(centerX, centerY);

  if (adj.rotation !== 0) {
    ctx.rotate((adj.rotation * Math.PI) / 180);
  }
  if (adj.flipH) {
    ctx.scale(-1, 1);
  }

  // If rotated 90 or 270, the drawing dimensions correspond to swapped natural sizes
  const drawW = is90or270 ? renderH : renderW;
  const drawH = is90or270 ? renderW : renderH;

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

  ctx.restore();
}

// Draw label badge
function drawBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  slot: { x: number; y: number; width: number; height: number },
  settings: CollageSettings,
  isLeft: boolean,
  scale: number
) {
  if (!text || !settings.showBadges) return;

  ctx.save();

  const fontSize = (settings.badgeSize === 'lg' ? 36 : settings.badgeSize === 'sm' ? 24 : 30) * scale;
  ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", "Arial Black", sans-serif`;

  const textMetrics = ctx.measureText(text);
  const paddingX = 22 * scale;
  const paddingY = 12 * scale;
  const badgeWidth = textMetrics.width + paddingX * 2;
  const badgeHeight = fontSize + paddingY * 2;

  // Margin from edge
  const margin = 20 * scale;

  let posX = slot.x + margin;
  if (!isLeft && settings.orientation === 'horizontal') {
    posX = slot.x + margin;
  }
  let posY = slot.y + margin;

  if (settings.badgePosition.startsWith('bottom')) {
    posY = slot.y + slot.height - badgeHeight - margin;
  }

  // Draw style
  const badgeRadius = settings.badgeStyle === 'pill' ? badgeHeight / 2 : 8 * scale;

  if (settings.badgeStyle === 'warning') {
    // Industrial safety yellow / orange
    ctx.fillStyle = isLeft ? '#f59e0b' : '#10b981';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(posX, posY, badgeWidth, badgeHeight, badgeRadius);
    else ctx.rect(posX, posY, badgeWidth, badgeHeight);
    ctx.fill();

    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.fillStyle = '#000000';
  } else if (settings.badgeStyle === 'glass') {
    // Frosted dark glass
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(posX, posY, badgeWidth, badgeHeight, badgeRadius);
    else ctx.rect(posX, posY, badgeWidth, badgeHeight);
    ctx.fill();

    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = isLeft ? '#f59e0b' : '#34d399';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
  } else if (settings.badgeStyle === 'steel') {
    // Brushed steel / metallic look
    const grad = ctx.createLinearGradient(posX, posY, posX, posY + badgeHeight);
    grad.addColorStop(0, '#475569');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;

    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(posX, posY, badgeWidth, badgeHeight, badgeRadius);
    else ctx.rect(posX, posY, badgeWidth, badgeHeight);
    ctx.fill();

    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
  } else if (settings.badgeStyle === 'stamp') {
    // Stamp style
    ctx.strokeStyle = isLeft ? '#ea580c' : '#059669';
    ctx.lineWidth = 4 * scale;
    ctx.strokeRect(posX, posY, badgeWidth, badgeHeight);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(posX, posY, badgeWidth, badgeHeight);

    ctx.fillStyle = isLeft ? '#fb923c' : '#34d399';
  } else {
    // Modern Pill
    ctx.fillStyle = settings.badgeBgColor || 'rgba(0, 0, 0, 0.8)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(posX, posY, badgeWidth, badgeHeight, badgeHeight / 2);
    else ctx.rect(posX, posY, badgeWidth, badgeHeight);
    ctx.fill();

    ctx.lineWidth = 1.5 * scale;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.stroke();

    ctx.fillStyle = settings.badgeTextColor || '#ffffff';
  }

  // Text inside badge
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, posX + paddingX, posY + badgeHeight / 2);

  ctx.restore();
}

// Draw Watermark / Branding - Completely disabled to ensure clean exported image without any logo or text
function drawWatermark(
  _ctx: CanvasRenderingContext2D,
  _settings: CollageSettings,
  _canvasW: number,
  _canvasH: number,
  _scale: number
) {
  // Completely disabled: no text, no logo, no phone number on exported image
  return;
}

// Master rendering function
export async function renderCollageToCanvas(options: GenerateCanvasOptions): Promise<HTMLCanvasElement> {
  const { leftImageUrl, rightImageUrl, leftAdj, rightAdj, settings } = options;
  const scale = options.targetScale || settings.exportResolutionMultiplier || 1.5;

  const [leftImg, rightImg] = await Promise.all([
    loadImage(leftImageUrl),
    loadImage(rightImageUrl),
  ]);

  const baseDims = getCanvasDimensions(settings, leftImg, rightImg);
  const canvasW = Math.round(baseDims.width * scale);
  const canvasH = Math.round(baseDims.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Nu s-a putut inițializa contextul 2D Canvas');

  // Smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw outer background
  ctx.fillStyle = settings.canvasBgColor || '#0b0f19';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Calculate inner drawable bounds (inside canvas padding & border)
  const pad = Math.round(settings.canvasPadding * scale);
  const innerX = pad;
  const innerY = pad;
  const innerW = canvasW - pad * 2;
  const innerH = canvasH - pad * 2;

  const dividerW = settings.showDivider ? Math.round(settings.dividerWidth * scale) : 0;
  const innerRadius = Math.round(settings.innerCornerRadius * scale);

  let leftSlot: { x: number; y: number; width: number; height: number; radius: number };
  let rightSlot: { x: number; y: number; width: number; height: number; radius: number };

  if (settings.orientation === 'horizontal') {
    const slotW = (innerW - dividerW) / 2;
    leftSlot = {
      x: innerX,
      y: innerY,
      width: slotW,
      height: innerH,
      radius: innerRadius,
    };
    rightSlot = {
      x: innerX + slotW + dividerW,
      y: innerY,
      width: slotW,
      height: innerH,
      radius: innerRadius,
    };
  } else {
    // Vertical / Stacked
    const slotH = (innerH - dividerW) / 2;
    leftSlot = {
      x: innerX,
      y: innerY,
      width: innerW,
      height: slotH,
      radius: innerRadius,
    };
    rightSlot = {
      x: innerX,
      y: innerY + slotH + dividerW,
      width: innerW,
      height: slotH,
      radius: innerRadius,
    };
  }

  // 2. Draw Left & Right Images
  drawSlotImage(ctx, leftImg, leftSlot, leftAdj);
  drawSlotImage(ctx, rightImg, rightSlot, rightAdj);

  // 3. Draw Divider Line if visible
  if (settings.showDivider && dividerW > 0) {
    ctx.save();
    ctx.strokeStyle = settings.dividerColor || '#f59e0b';
    ctx.lineWidth = dividerW;

    if (settings.dividerStyle === 'dashed') {
      ctx.setLineDash([16 * scale, 10 * scale]);
    } else if (settings.dividerStyle === 'double') {
      ctx.lineWidth = Math.max(1, Math.round(dividerW / 3));
    }

    ctx.beginPath();
    if (settings.orientation === 'horizontal') {
      const lineX = innerX + leftSlot.width + dividerW / 2;
      ctx.moveTo(lineX, innerY);
      ctx.lineTo(lineX, innerY + innerH);
    } else {
      const lineY = innerY + leftSlot.height + dividerW / 2;
      ctx.moveTo(innerX, lineY);
      ctx.lineTo(innerX + innerW, lineY);
    }
    ctx.stroke();

    // If double, draw the second line
    if (settings.dividerStyle === 'double') {
      ctx.beginPath();
      if (settings.orientation === 'horizontal') {
        const lineX2 = innerX + leftSlot.width + dividerW - Math.round(dividerW / 3);
        ctx.moveTo(lineX2, innerY);
        ctx.lineTo(lineX2, innerY + innerH);
      } else {
        const lineY2 = innerY + leftSlot.height + dividerW - Math.round(dividerW / 3);
        ctx.moveTo(innerX, lineY2);
        ctx.lineTo(innerX + innerW, lineY2);
      }
      ctx.stroke();
    }

    // 4. Center icon badge (↔ or ⟷)
    if (settings.showCenterIcon) {
      const centerX = settings.orientation === 'horizontal' ? innerX + leftSlot.width + dividerW / 2 : canvasW / 2;
      const centerY = settings.orientation === 'horizontal' ? canvasH / 2 : innerY + leftSlot.height + dividerW / 2;
      const radius = 26 * scale;

      ctx.setLineDash([]);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = settings.dividerColor || '#f59e0b';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();

      // Icon symbol (dual arrows)
      ctx.fillStyle = '#f8fafc';
      ctx.font = `bold ${24 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⇄', centerX, centerY + 1);
    }
    ctx.restore();
  }

  // 5. Draw Labels / Badges
  drawBadge(ctx, settings.leftBadgeText, leftSlot, settings, true, scale);
  drawBadge(ctx, settings.rightBadgeText, rightSlot, settings, false, scale);

  // 6. Draw Outer Border
  if (settings.borderWidth > 0) {
    ctx.save();
    const borderW = Math.round(settings.borderWidth * scale);
    ctx.strokeStyle = settings.borderColor || '#334155';
    ctx.lineWidth = borderW;

    const cornerR = Math.round(settings.cornerRadius * scale);
    const halfB = borderW / 2;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(halfB, halfB, canvasW - borderW, canvasH - borderW, cornerR);
    } else {
      ctx.rect(halfB, halfB, canvasW - borderW, canvasH - borderW);
    }
    ctx.stroke();
    ctx.restore();
  }

  // 7. Draw Watermark & Contact info
  drawWatermark(ctx, settings, canvasW, canvasH, scale);

  return canvas;
}

// Download canvas as JPG or PNG file
export async function downloadCollage(
  options: GenerateCanvasOptions,
  filename?: string
): Promise<void> {
  const canvas = await renderCollageToCanvas(options);
  const format = options.settings.exportFormat || 'image/jpeg';
  const quality = options.settings.exportQuality || 0.95;
  const defaultName = `confectii-metalice-inainte-dupa-${new Date().toISOString().slice(0, 10)}.jpg`;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Generarea fișierului a eșuat.'));
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || defaultName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        resolve();
      },
      format,
      quality
    );
  });
}

// Copy canvas directly to clipboard
export async function copyCollageToClipboard(options: GenerateCanvasOptions): Promise<boolean> {
  try {
    const canvas = await renderCollageToCanvas(options);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          // Clipboard Item requires image/png
          const pngCanvas = document.createElement('canvas');
          pngCanvas.width = canvas.width;
          pngCanvas.height = canvas.height;
          const ctx = pngCanvas.getContext('2d');
          ctx?.drawImage(canvas, 0, 0);

          pngCanvas.toBlob(async (pngBlob) => {
            if (!pngBlob) {
              resolve(false);
              return;
            }
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob }),
            ]);
            resolve(true);
          }, 'image/png');
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error('Clipboard error:', err);
    return false;
  }
}
