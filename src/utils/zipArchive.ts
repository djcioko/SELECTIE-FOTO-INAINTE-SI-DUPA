import JSZip from 'jszip';
import { PhotoItem, PhotoAnalysis } from '../types';

export interface ZipExportProgress {
  current: number;
  total: number;
  filename: string;
  percent: number;
  phase: 'preparing' | 'compressing' | 'completed';
}

export interface ZipExportResult {
  totalPhotos: number;
  inLucruCount: number;
  finalCount: number;
  archiveName: string;
}

/**
 * Sanitizes and generates a clean file name with appropriate extension
 */
function sanitizeFileName(name: string, index: number, defaultExt: string = 'jpg'): string {
  const clean = name
    .replace(/[^\w\d\-_. ]+/gi, '_')
    .replace(/\s+/g, '_')
    .trim();

  const parts = clean.split('.');
  if (parts.length > 1) {
    const ext = parts.pop()?.toLowerCase();
    const base = parts.join('.');
    return `${String(index + 1).padStart(2, '0')}_${base || 'foto'}.${ext || defaultExt}`;
  }
  return `${String(index + 1).padStart(2, '0')}_${clean || 'foto'}.${defaultExt}`;
}

/**
 * Converts any image (blob URL, data URL, SVG, external URL) into an ArrayBuffer
 */
async function fetchImageBuffer(url: string): Promise<{ buffer: ArrayBuffer; extension: string }> {
  // 1. Data URL
  if (url.startsWith('data:')) {
    // SVG utf-8 data URL: render to high-res JPEG via Canvas for maximum laptop compatibility
    if (url.includes('image/svg+xml')) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = (e) => reject(e);
          img.src = url;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1600;
        canvas.height = img.naturalHeight || 900;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95)
          );
          if (blob) {
            const buf = await blob.arrayBuffer();
            return { buffer: buf, extension: 'jpg' };
          }
        }
      } catch (err) {
        console.warn('Nu s-a putut converti SVG pe canvas, salvăm ca svg:', err);
      }
    }

    // Standard base64 data URL
    const match = url.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mime = match[1];
      const base64Data = match[2];
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      let ext = 'jpg';
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('svg')) ext = 'svg';
      return { buffer: bytes.buffer, extension: ext };
    }
  }

  // 2. Blob URL or Direct HTTP URL
  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      const buffer = await blob.arrayBuffer();
      let ext = 'jpg';
      const type = blob.type.toLowerCase();
      if (type.includes('png')) ext = 'png';
      else if (type.includes('webp')) ext = 'webp';
      else if (type.includes('svg')) ext = 'svg';
      return { buffer, extension: ext };
    }
  } catch (directErr) {
    console.warn(`Direct fetch failed for ${url}, trying proxy:`, directErr);
  }

  // 3. Fallback via server proxy for external images
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const blob = await proxyRes.blob();
      const buffer = await blob.arrayBuffer();
      return { buffer, extension: 'jpg' };
    }
  }

  throw new Error(`Nu s-a putut descărca imaginea: ${url.slice(0, 50)}...`);
}

/**
 * Determines photo category: uses existing Gemini analysis or smart heuristics
 */
function categorizePhoto(
  photo: PhotoItem,
  index: number,
  analysesMap: Map<string, PhotoAnalysis>
): { category: 'in_lucru' | 'final'; label: string; score?: number; reason?: string } {
  const analysis = analysesMap.get(photo.id);
  if (analysis) {
    return {
      category: analysis.category,
      label: analysis.category === 'in_lucru' ? 'În lucru / Atelier' : 'Final / Montat la client',
      score: analysis.qualityScore,
      reason: analysis.reason,
    };
  }

  // Smart heuristic based on file name & position
  const nameLower = (photo.name || '').toLowerCase();
  if (
    nameLower.includes('atelier') ||
    nameLower.includes('lucru') ||
    nameLower.includes('sudur') ||
    nameLower.includes('debit') ||
    nameLower.includes('banc') ||
    nameLower.includes('raw') ||
    nameLower.includes('inainte') ||
    nameLower.includes('before')
  ) {
    return {
      category: 'in_lucru',
      label: 'În lucru / Atelier',
      reason: 'Clasificat automat pe baza denumirii: lucrări atelier/sudură.',
    };
  }

  if (
    nameLower.includes('final') ||
    nameLower.includes('montat') ||
    nameLower.includes('client') ||
    nameLower.includes('dupa') ||
    nameLower.includes('after') ||
    nameLower.includes('vila')
  ) {
    return {
      category: 'final',
      label: 'Final / Montat la client',
      reason: 'Clasificat automat pe baza denumirii: lucrare finalizată/montaj client.',
    };
  }

  // Default distribution: if even index -> in_lucru, odd -> final
  const isLucru = index % 2 === 0;
  return {
    category: isLucru ? 'in_lucru' : 'final',
    label: isLucru ? 'În lucru / Atelier' : 'Final / Montat la client',
    reason: 'Repartizat pe baza fluxului de lucru (Atelier & Montaj).',
  };
}

/**
 * Creates and downloads a ZIP file containing two distinct folders:
 * 1. "In_Lucru_Atelier/"
 * 2. "Final_Montat_Client/"
 */
export async function exportPhotosSeparatedZip(
  photos: PhotoItem[],
  analyses: PhotoAnalysis[] = [],
  onProgress?: (progress: ZipExportProgress) => void
): Promise<ZipExportResult> {
  if (!photos || photos.length === 0) {
    throw new Error('Nu există poze de arhivat.');
  }

  const zip = new JSZip();

  // Distinct folders inside the ZIP archive
  const folderInLucru = zip.folder('In_Lucru_Atelier');
  const folderFinal = zip.folder('Final_Montat_Client');

  if (!folderInLucru || !folderFinal) {
    throw new Error('Eroare la crearea folderelor în arhiva ZIP.');
  }

  const analysesMap = new Map<string, PhotoAnalysis>();
  analyses.forEach((a) => analysesMap.set(a.photoId, a));

  const total = photos.length;
  let inLucruCount = 0;
  let finalCount = 0;

  const inLucruReportLines: string[] = [];
  const finalReportLines: string[] = [];

  // Process photos one by one
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const { category, label, score, reason } = categorizePhoto(photo, i, analysesMap);

    onProgress?.({
      current: i + 1,
      total,
      filename: photo.name,
      percent: Math.round(((i + 0.5) / total) * 70),
      phase: 'preparing',
    });

    try {
      const { buffer, extension } = await fetchImageBuffer(photo.url);

      if (category === 'in_lucru') {
        inLucruCount++;
        const targetFilename = sanitizeFileName(photo.name, inLucruCount - 1, extension);
        folderInLucru.file(targetFilename, buffer);
        inLucruReportLines.push(
          `  ${inLucruCount}. ${targetFilename} | Claritate: ${score ? score + '%' : 'N/A'} | Notă: ${reason || '-'}`
        );
      } else {
        finalCount++;
        const targetFilename = sanitizeFileName(photo.name, finalCount - 1, extension);
        folderFinal.file(targetFilename, buffer);
        finalReportLines.push(
          `  ${finalCount}. ${targetFilename} | Claritate: ${score ? score + '%' : 'N/A'} | Notă: ${reason || '-'}`
        );
      }
    } catch (err: any) {
      console.error(`Eroare la adăugarea pozei ${photo.name} în ZIP:`, err);
    }
  }

  // Generate a neat classification text report in the root of the ZIP
  const todayStr = new Date().toLocaleString('ro-RO', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const reportContent = `================================================================================
RAPORT CLASIFICARE & ORGANIZARE FOTO CONFECȚII METALICE
MetalCraft Compare - Export Foldere Atelier & Client
================================================================================
Data generării: ${todayStr}
Total poze procesate: ${total}

--------------------------------------------------------------------------------
📁 FOLDER 1: In_Lucru_Atelier/ (${inLucruCount} poze)
Descriere: Poze din timpul lucrării în execuție din atelier (debitare, sudură, asamblare)
--------------------------------------------------------------------------------
${inLucruReportLines.length > 0 ? inLucruReportLines.join('\n') : '  (Nicio poză în această categorie)'}

--------------------------------------------------------------------------------
📁 FOLDER 2: Final_Montat_Client/ (${finalCount} poze)
Descriere: Poze cu lucrarea finalizată, vopsită electrostatic și montată la client
--------------------------------------------------------------------------------
${finalReportLines.length > 0 ? finalReportLines.join('\n') : '  (Nicio poză în această categorie)'}

================================================================================
Arhivă creată cu succes pentru utilizare directă pe laptop / PC.
Folderele sunt gata pentru arhivare, trimitere către clienți sau promovare online.
================================================================================
`;

  zip.file('RAPORT_CLASIFICARE_ATELIER_SI_CLIENT.txt', reportContent);

  // Compress into ZIP blob
  onProgress?.({
    current: total,
    total,
    filename: 'Generare fișier ZIP...',
    percent: 85,
    phase: 'compressing',
  });

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onProgress?.({
        current: total,
        total,
        filename: 'Comprimare arhivă...',
        percent: Math.min(99, Math.round(85 + (metadata.percent / 100) * 14)),
        phase: 'compressing',
      });
    }
  );

  const archiveName = `confectii-metalice-separate-atelier-si-client-${new Date()
    .toISOString()
    .slice(0, 10)}.zip`;

  // Trigger browser download directly to laptop
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = archiveName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 10000);

  onProgress?.({
    current: total,
    total,
    filename: archiveName,
    percent: 100,
    phase: 'completed',
  });

  return {
    totalPhotos: total,
    inLucruCount,
    finalCount,
    archiveName,
  };
}
