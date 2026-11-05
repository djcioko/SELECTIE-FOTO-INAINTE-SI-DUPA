import React, { useState } from 'react';
import {
  Download,
  Share2,
  Columns2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  ArrowLeftRight,
  Tag,
  LayoutGrid,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from 'lucide-react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { SlotCard } from './components/SlotCard';
import { CollageCanvas } from './components/CollageCanvas';
import { SplitSliderPreview } from './components/SplitSliderPreview';
import { ControlsPanel } from './components/ControlsPanel';
import { GeminiAnalysisSection } from './components/GeminiAnalysisSection';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import {
  PhotoItem,
  SlotAdjustments,
  CollageSettings,
  PresetProject,
  PhotoAnalysis,
} from './types';
import { downloadCollage, copyCollageToClipboard } from './utils/exportImage';
import { analyzePhotosWithGemini } from './utils/aiAnalysis';

const DEFAULT_ADJUSTMENTS: SlotAdjustments = {
  zoom: 1.0,
  panX: 0,
  panY: 0,
  rotation: 0,
  flipH: false,
  brightness: 100,
  contrast: 100,
  warmth: 0,
};

const DEFAULT_SETTINGS: CollageSettings = {
  orientation: 'horizontal',
  aspectRatio: '16:9',
  showDivider: true,
  dividerWidth: 4,
  dividerColor: '#f59e0b',
  dividerStyle: 'solid',
  showCenterIcon: false,
  showBadges: false,
  leftBadgeText: 'În lucru',
  rightBadgeText: 'Final',
  badgeStyle: 'warning',
  badgePosition: 'top-inside',
  badgeSize: 'md',
  badgeBgColor: 'rgba(15, 23, 42, 0.9)',
  badgeTextColor: '#ffffff',
  borderWidth: 0,
  borderColor: '#334155',
  canvasPadding: 0,
  canvasBgColor: '#0f172a',
  cornerRadius: 0,
  innerCornerRadius: 0,
  showWatermark: false,
  companyName: '',
  companyPhone: '',
  watermarkPosition: 'bottom-right',
  watermarkOpacity: 0.9,
  exportQuality: 0.95,
  exportResolutionMultiplier: 2,
  exportFormat: 'image/jpeg',
};

export default function App() {
  // Initialize with the first sample project so user has a rich live view immediately
  const initialProject = SAMPLE_PROJECTS[0];

  const initialPhoto1: PhotoItem = {
    id: 'sample-left-1',
    name: 'Poartă Culisantă - Sudură Atelier.svg',
    url: initialProject.leftImage.url,
    addedAt: Date.now(),
  };

  const initialPhoto2: PhotoItem = {
    id: 'sample-right-1',
    name: 'Poartă Culisantă - Montată la Vilă.svg',
    url: initialProject.rightImage.url,
    addedAt: Date.now() + 1,
  };

  const [photos, setPhotos] = useState<PhotoItem[]>([initialPhoto1, initialPhoto2]);
  const [leftPhotoId, setLeftPhotoId] = useState<string | null>(initialPhoto1.id);
  const [rightPhotoId, setRightPhotoId] = useState<string | null>(initialPhoto2.id);

  const [leftAdj, setLeftAdj] = useState<SlotAdjustments>({ ...DEFAULT_ADJUSTMENTS });
  const [rightAdj, setRightAdj] = useState<SlotAdjustments>({ ...DEFAULT_ADJUSTMENTS });

  const [settings, setSettings] = useState<CollageSettings>({
    ...DEFAULT_SETTINGS,
    ...(initialProject.suggestedSettings || {}),
  });

  const [viewMode, setViewMode] = useState<'collage' | 'slider'>('collage');
  const [galleryPosition, setGalleryPosition] = useState<'bottom' | 'side'>('bottom');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const [analyses, setAnalyses] = useState<PhotoAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const leftPhoto = photos.find((p) => p.id === leftPhotoId) || null;
  const rightPhoto = photos.find((p) => p.id === rightPhotoId) || null;
  const hasBothImages = !!(leftPhoto && rightPhoto);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const leftAnalysis = analyses.find((a) => a.photoId === leftPhotoId) || null;
  const rightAnalysis = analyses.find((a) => a.photoId === rightPhotoId) || null;

  // Analyze photos with Gemini and automatically apply to Before & After image
  const handleAnalyzePhotos = async (targetPhotos?: PhotoItem[]) => {
    const listToAnalyze = targetPhotos || photos;
    if (listToAnalyze.length === 0) {
      showToast('Încarcă mai întâi câteva poze pentru analiză.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const results = await analyzePhotosWithGemini(listToAnalyze);
      setAnalyses(results);

      // AUTOMATICALLY place the best classified "În lucru" into Left and "Final" into Right
      const inLucruList = results.filter((a) => a.category === 'in_lucru');
      const finalList = results.filter((a) => a.category === 'final');

      const bestInLucru =
        inLucruList.find((a) => a.isBestCandidate) ||
        [...inLucruList].sort((a, b) => b.qualityScore - a.qualityScore)[0];

      const bestFinal =
        finalList.find((a) => a.isBestCandidate) ||
        [...finalList].sort((a, b) => b.qualityScore - a.qualityScore)[0];

      let appliedCount = 0;
      if (bestInLucru) {
        setLeftPhotoId(bestInLucru.photoId);
        appliedCount++;
      }
      if (bestFinal) {
        setRightPhotoId(bestFinal.photoId);
        appliedCount++;
      }

      // Activate "În lucru" (stânga) și "Final" (dreapta) pe imagine, păstrând fără logo/watermark
      setSettings((prev) => ({
        ...prev,
        showBadges: true,
        leftBadgeText: 'În lucru',
        rightBadgeText: 'Final',
        showWatermark: false,
        companyName: '',
        companyPhone: '',
      }));

      if (appliedCount === 2) {
        showToast('✓ Analiză completă! Poza „În lucru” a fost pusă în Stânga și cea „Final” în Dreapta.');
      } else {
        showToast(`✓ Gemini a clasificat cu succes ${results.length} poze!`);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Eroare analiză: ' + (err.message || 'Necunoscut'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle imported photos from Google Photos album or external links
  const handleAddImportedPhotos = (newItems: PhotoItem[], autoAnalyze = false) => {
    if (newItems.length === 0) return;

    const updatedList = [...newItems, ...photos];
    setPhotos(updatedList);

    // If slots are empty, auto-assign first photos
    if (!leftPhotoId && newItems[0]) {
      setLeftPhotoId(newItems[0].id);
      if (!rightPhotoId && newItems[1]) {
        setRightPhotoId(newItems[1].id);
      }
    } else if (!rightPhotoId && newItems[0]) {
      setRightPhotoId(newItems[0].id);
    }

    showToast(`✓ Au fost adăugate ${newItems.length} poze din album!`);

    if (autoAnalyze) {
      setTimeout(() => {
        handleAnalyzePhotos(updatedList);
      }, 500);
    }
  };

  // Automatically assign best "În lucru" to Left and best "Final" to Right
  const handleApplyBest = () => {
    if (analyses.length === 0) {
      showToast('Apasă mai întâi pe „Analizează pozele”.');
      return;
    }

    const inLucruList = analyses.filter((a) => a.category === 'in_lucru');
    const finalList = analyses.filter((a) => a.category === 'final');

    const bestInLucru =
      inLucruList.find((a) => a.isBestCandidate) ||
      [...inLucruList].sort((a, b) => b.qualityScore - a.qualityScore)[0];

    const bestFinal =
      finalList.find((a) => a.isBestCandidate) ||
      [...finalList].sort((a, b) => b.qualityScore - a.qualityScore)[0];

    let appliedCount = 0;
    if (bestInLucru) {
      setLeftPhotoId(bestInLucru.photoId);
      appliedCount++;
    }
    if (bestFinal) {
      setRightPhotoId(bestFinal.photoId);
      appliedCount++;
    }

    setSettings((prev) => ({
      ...prev,
      showBadges: true,
      leftBadgeText: 'În lucru',
      rightBadgeText: 'Final',
      showWatermark: false,
      companyName: '',
      companyPhone: '',
    }));

    if (appliedCount > 0) {
      showToast('⭐ Au fost plasate cele mai bune poze: În lucru (Stânga) și Final (Dreapta)!');
    } else {
      showToast('Nu au fost găsite poze suficiente pentru ambele categorii.');
    }
  };

  // Add multiple photos from file upload
  const handleAddPhotos = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newItems: PhotoItem[] = [];

    fileArray.forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;
      const id = `photo-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
      const url = URL.createObjectURL(file);
      newItems.push({
        id,
        name: file.name,
        url,
        size: file.size,
        addedAt: Date.now() + index,
      });
    });

    if (newItems.length === 0) return;

    setPhotos((prev) => [...newItems, ...prev]);

    // If slots are empty, intelligently auto-assign
    if (!leftPhotoId && newItems[0]) {
      setLeftPhotoId(newItems[0].id);
      if (!rightPhotoId && newItems[1]) {
        setRightPhotoId(newItems[1].id);
      }
    } else if (!rightPhotoId && newItems[0]) {
      setRightPhotoId(newItems[0].id);
    }

    showToast(`Au fost adăugate ${newItems.length} poze în listă!`);
  };

  const handleAssignToLeft = (photo: PhotoItem) => {
    setLeftPhotoId(photo.id);
    showToast(`Poza a fost setată în Stânga („În lucru”)`);
  };

  const handleAssignToRight = (photo: PhotoItem) => {
    setRightPhotoId(photo.id);
    showToast(`Poza a fost setată în Dreapta („Final”)`);
  };

  const handleRemovePhoto = (id: string) => {
    if (leftPhotoId === id) setLeftPhotoId(null);
    if (rightPhotoId === id) setRightPhotoId(null);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Poza a fost ștearsă din listă');
  };

  const handleClearAllPhotos = () => {
    setLeftPhotoId(null);
    setRightPhotoId(null);
    setPhotos([]);
    showToast('Toate pozele au fost șterse din listă');
  };

  // Swap Left and Right slots
  const handleSwapSlots = () => {
    const tempId = leftPhotoId;
    const tempAdj = { ...leftAdj };
    setLeftPhotoId(rightPhotoId);
    setRightPhotoId(tempId);
    setLeftAdj(rightAdj);
    setRightAdj(tempAdj);
    showToast('✓ Locurile au fost inversate: Stânga ⇄ Dreapta');
  };

  const handleSelectPreset = (preset: PresetProject) => {
    const p1: PhotoItem = {
      id: `preset-left-${preset.id}-${Date.now()}`,
      name: `${preset.title} - În lucru`,
      url: preset.leftImage.url,
      addedAt: Date.now(),
    };
    const p2: PhotoItem = {
      id: `preset-right-${preset.id}-${Date.now()}`,
      name: `${preset.title} - Final`,
      url: preset.rightImage.url,
      addedAt: Date.now() + 1,
    };

    setPhotos((prev) => [p1, p2, ...prev]);
    setLeftPhotoId(p1.id);
    setRightPhotoId(p2.id);
    setLeftAdj({ ...DEFAULT_ADJUSTMENTS });
    setRightAdj({ ...DEFAULT_ADJUSTMENTS });

    if (preset.suggestedSettings) {
      setSettings((prev) => ({
        ...prev,
        ...preset.suggestedSettings,
      }));
    }

    showToast(`Exemplu încărcat: ${preset.title}`);
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    setLeftAdj({ ...DEFAULT_ADJUSTMENTS });
    setRightAdj({ ...DEFAULT_ADJUSTMENTS });
    showToast('Setările au fost resetate');
  };

  // High-quality JPG export
  const handleExport = async () => {
    if (!leftPhoto || !rightPhoto) {
      showToast('Te rugăm să adaugi ambele poze (Stânga și Dreapta) înainte de descărcare.');
      return;
    }

    setIsExporting(true);
    try {
      const filename = `confectii-metalice-in-lucru-vs-final-${new Date().toISOString().slice(0, 10)}.jpg`;
      await downloadCollage(
        {
          leftImageUrl: leftPhoto.url,
          rightImageUrl: rightPhoto.url,
          leftAdj,
          rightAdj,
          settings,
        },
        filename
      );
      showToast('✓ Colajul JPG de înaltă rezoluție a fost descărcat!');
    } catch (err: any) {
      console.error(err);
      showToast('Eroare la generarea imaginii: ' + (err.message || 'Necunoscut'));
    } finally {
      setIsExporting(false);
    }
  };

  // Clipboard copy
  const handleCopyClipboard = async () => {
    if (!leftPhoto || !rightPhoto) return;
    setIsExporting(true);
    try {
      const success = await copyCollageToClipboard({
        leftImageUrl: leftPhoto.url,
        rightImageUrl: rightPhoto.url,
        leftAdj,
        rightAdj,
        settings,
      });

      if (success) {
        setCopiedSuccess(true);
        showToast('✓ Imaginea a fost copiată în Clipboard! Dă Paste (Ctrl+V) în WhatsApp');
        setTimeout(() => setCopiedSuccess(false), 3000);
      } else {
        showToast('Nu s-a putut copia direct. Folosește butonul de Descarcă JPG.');
      }
    } catch {
      showToast('Eroare la copiere în clipboard.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 border border-amber-500/60 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onExport={handleExport}
        onCopyClipboard={handleCopyClipboard}
        isExporting={isExporting}
        copiedSuccess={copiedSuccess}
        hasBothImages={hasBothImages}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Gemini AI Smart Analysis Section */}
        <section>
          <GeminiAnalysisSection
            photos={photos}
            analyses={analyses}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyzePhotos}
            onApplyBest={handleApplyBest}
            onAssignToLeft={handleAssignToLeft}
            onAssignToRight={handleAssignToRight}
            leftPhotoId={leftPhotoId}
            rightPhotoId={rightPhotoId}
          />
        </section>

        {/* Step 1: The Two Core Zones (Stânga & Dreapta) + Button "Schimbă locurile" */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 sm:px-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow">
                1
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-100 tracking-tight">
                  Cele două zone: În lucru (Stânga) și Final (Dreapta)
                </h2>
                <p className="text-[11px] text-slate-400">
                  Fiecare slot are butonul <span className="text-rose-400 font-bold">&bdquo;X&rdquo;</span> pentru ștergere rapidă
                </p>
              </div>
            </div>

            {/* Top Action Bar with "Schimbă locurile" & "Etichete" toggle */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Etichete ("În lucru" și "Final") toggle */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-slate-300 hidden sm:inline">Etichete:</span>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, showBadges: !prev.showBadges }))
                  }
                  className={`px-2 py-0.5 rounded-md font-black text-[11px] transition cursor-pointer ${
                    settings.showBadges
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Activează sau dezactivează etichetele 'În lucru' și 'Final' de pe poze"
                >
                  {settings.showBadges ? '✓ Etichete: ON' : '✕ Etichete: OFF'}
                </button>
              </div>

              {/* BUTON "ANALIZEAZĂ CU GEMINI" */}
              <button
                onClick={() => handleAnalyzePhotos()}
                disabled={isAnalyzing || photos.length === 0}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Analizează pozele cu Gemini și pune automat cea mai bună în Stânga și Dreapta"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Se analizează...' : 'Analizează cu Gemini'}</span>
              </button>

              {/* BUTON "SCHIMBĂ LOCURILE" */}
              <button
                onClick={handleSwapSlots}
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                title="Inversează stânga cu dreapta"
              >
                <ArrowLeftRight className="w-4 h-4 stroke-[2.5] text-amber-400" />
                <span>Schimbă locurile</span>
              </button>
            </div>
          </div>

          {/* Dual Slots Grid with Center Floating Swap Button on Desktop */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Slot: În lucru / Atelier */}
              <SlotCard
                side="left"
                title="Stânga: În lucru / Atelier"
                subtitle="Piese debitate, sudură sau structură pe banc"
                defaultBadgeText={settings.leftBadgeText}
                showBadges={settings.showBadges}
                photo={leftPhoto}
                adjustments={leftAdj}
                onUpdateAdjustments={(adj) => setLeftAdj((prev) => ({ ...prev, ...adj }))}
                onResetAdjustments={() => setLeftAdj({ ...DEFAULT_ADJUSTMENTS })}
                onClear={() => {
                  setLeftPhotoId(null);
                  showToast('Poza din stânga a fost eliminată');
                }}
                onSwap={handleSwapSlots}
                onDropPhoto={(photo) => {
                  setPhotos((prev) => [photo, ...prev]);
                  setLeftPhotoId(photo.id);
                }}
              />

              {/* Right Slot: Final / Montat la client */}
              <SlotCard
                side="right"
                title="Dreapta: Final / Montat la client"
                subtitle="Vopsit electrostatic și montat la client"
                defaultBadgeText={settings.rightBadgeText}
                showBadges={settings.showBadges}
                photo={rightPhoto}
                adjustments={rightAdj}
                onUpdateAdjustments={(adj) => setRightAdj((prev) => ({ ...prev, ...adj }))}
                onResetAdjustments={() => setRightAdj({ ...DEFAULT_ADJUSTMENTS })}
                onClear={() => {
                  setRightPhotoId(null);
                  showToast('Poza din dreapta a fost eliminată');
                }}
                onSwap={handleSwapSlots}
                onDropPhoto={(photo) => {
                  setPhotos((prev) => [photo, ...prev]);
                  setRightPhotoId(photo.id);
                }}
              />
            </div>

            {/* Central "Schimbă locurile" floating icon on Desktop */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <button
                onClick={handleSwapSlots}
                type="button"
                className="pointer-events-auto w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xl border-4 border-slate-950 flex items-center justify-center font-black transition-all hover:scale-115 active:scale-90 cursor-pointer group"
                title="Schimbă locurile (Stânga ⇄ Dreapta)"
              >
                <ArrowLeftRight className="w-5 h-5 stroke-[2.5] group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* Step 2: Live Preview & Customization Options */}
        <section className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                2
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-100 tracking-tight">
                Preview Live al Colajului &amp; Setări
              </h2>
            </div>

            {/* View Mode & Gallery Position switches */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Gallery position toggle: Jos vs În lateral */}
              <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setGalleryPosition('bottom')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    galleryPosition === 'bottom'
                      ? 'bg-slate-800 text-amber-400 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Afișează lista de poze încărcate jos"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Listă jos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryPosition('side')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    galleryPosition === 'side'
                      ? 'bg-slate-800 text-amber-400 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Afișează lista de poze încărcate în lateral"
                >
                  <PanelRightOpen className="w-3.5 h-3.5" />
                  <span>Listă în lateral</span>
                </button>
              </div>

              {/* View Mode Switcher: Side-by-Side vs Slider Interactiv */}
              {hasBothImages && (
                <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setViewMode('collage')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      viewMode === 'collage'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Columns2 className="w-3.5 h-3.5" />
                    <span>Colaj Side-by-Side</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('slider')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      viewMode === 'slider'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Slider Comparativ</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Work Area Grid (Preview + Controls / Lateral Gallery) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Live Canvas / Preview Area */}
            <div
              className={`flex flex-col items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-inner ${
                galleryPosition === 'side' ? 'lg:col-span-8' : 'lg:col-span-7 xl:col-span-8'
              }`}
            >
              {hasBothImages ? (
                viewMode === 'collage' ? (
                  <CollageCanvas
                    leftPhoto={leftPhoto}
                    rightPhoto={rightPhoto}
                    leftAdj={leftAdj}
                    rightAdj={rightAdj}
                    settings={settings}
                  />
                ) : (
                  <SplitSliderPreview
                    leftPhoto={leftPhoto}
                    rightPhoto={rightPhoto}
                    leftAdj={leftAdj}
                    rightAdj={rightAdj}
                    leftLabel={settings.leftBadgeText}
                    rightLabel={settings.rightBadgeText}
                    aspectRatio={settings.aspectRatio}
                  />
                )
              ) : (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center">
                  <AlertCircle className="w-10 h-10 text-amber-400/60 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">
                    Alege sau încarcă ambele poze (Stânga și Dreapta) pentru a previzualiza colajul
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Dă click pe o poză din lista de mai jos și apasă &bdquo;Pune în stânga&rdquo; sau &bdquo;Pune în dreapta&rdquo;.
                  </p>
                </div>
              )}

              {/* Evaluare AI a Imaginii Înainte și După curente */}
              {hasBothImages && (leftAnalysis || rightAnalysis) && (
                <div className="w-full mt-3 p-3 sm:p-4 rounded-xl bg-slate-950/85 border border-amber-500/30 text-xs space-y-2 animate-in fade-in duration-200 shadow-lg">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                    <div className="flex items-center gap-1.5 font-extrabold text-amber-400 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analiză AI: Înainte (Atelier) ➔ După (Montat la client)</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                      CLASIFICAT &amp; VALIDAT
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    {leftAnalysis ? (
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/25 space-y-1">
                        <div className="flex items-center justify-between text-amber-300 font-bold">
                          <span>Stânga: În lucru / Atelier</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 font-black">
                            {leftAnalysis.qualityScore}% claritate
                          </span>
                        </div>
                        <p className="text-slate-300 leading-snug">{leftAnalysis.reason}</p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-500 italic">
                        Poza din stânga nu a fost încă analizată.
                      </div>
                    )}

                    {rightAnalysis ? (
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/25 space-y-1">
                        <div className="flex items-center justify-between text-emerald-300 font-bold">
                          <span>Dreapta: Final / Montat</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 font-black">
                            {rightAnalysis.qualityScore}% claritate
                          </span>
                        </div>
                        <p className="text-slate-300 leading-snug">{rightAnalysis.reason}</p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-500 italic">
                        Poza din dreapta nu a fost încă analizată.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Customization Controls OR Lateral Gallery */}
            <div
              className={`space-y-4 ${
                galleryPosition === 'side' ? 'lg:col-span-4' : 'lg:col-span-5 xl:col-span-4'
              }`}
            >
              {galleryPosition === 'side' && (
                <div className="mb-4">
                  <UploadZone
                    photos={photos}
                    leftPhotoId={leftPhotoId}
                    rightPhotoId={rightPhotoId}
                    onAddPhotos={handleAddPhotos}
                    onAddImportedPhotos={handleAddImportedPhotos}
                    onAssignToLeft={handleAssignToLeft}
                    onAssignToRight={handleAssignToRight}
                    onRemovePhoto={handleRemovePhoto}
                    onClearAllPhotos={handleClearAllPhotos}
                    onAnalyze={handleAnalyzePhotos}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              )}

              <ControlsPanel
                settings={settings}
                onUpdateSettings={(newVals) =>
                  setSettings((prev) => ({ ...prev, ...newVals }))
                }
              />

              {/* Quick Export Box */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 rounded-2xl border border-amber-500/30 p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Export Imagine Finală
                    </h3>
                    <p className="text-[11px] text-slate-400">JPG de calitate superioară (HD 2x)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    JPG 95%
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleExport}
                    disabled={!hasBothImages || isExporting}
                    type="button"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExporting ? 'Se randează...' : 'Descarcă Colaj JPG'}</span>
                  </button>

                  <button
                    onClick={handleCopyClipboard}
                    disabled={!hasBothImages}
                    type="button"
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Copiază direct în clipboard pentru WhatsApp Web sau Facebook"
                  >
                    <Share2 className="w-4 h-4 text-sky-400" />
                    <span>{copiedSuccess ? 'Copiat!' : 'Copiază'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: LISTA DE POZE ÎNCĂRCATE (Afișată jos când galleryPosition === 'bottom') */}
        {galleryPosition === 'bottom' && (
          <section className="pt-2">
            <UploadZone
              photos={photos}
              leftPhotoId={leftPhotoId}
              rightPhotoId={rightPhotoId}
              onAddPhotos={handleAddPhotos}
              onAddImportedPhotos={handleAddImportedPhotos}
              onAssignToLeft={handleAssignToLeft}
              onAssignToRight={handleAssignToRight}
              onRemovePhoto={handleRemovePhoto}
              onClearAllPhotos={handleClearAllPhotos}
              onAnalyze={handleAnalyzePhotos}
              isAnalyzing={isAnalyzing}
            />
          </section>
        )}

        {/* Informative Tips Section for Craftspeople */}
        <section className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-5 text-slate-400 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-bold mb-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Sfaturi pentru un colaj de impact pe Facebook &amp; Instagram:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1">
              <span className="font-semibold text-amber-300">1. Butonul &bdquo;Schimbă locurile&rdquo;</span>
              <p className="text-[11px] leading-relaxed">
                Apasă pe butonul galben &bdquo;Schimbă locurile&rdquo; pentru a inversa instantaneu poza de atelier cu cea finală.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-amber-300">2. Ștergere rapidă cu &bdquo;X&rdquo;</span>
              <p className="text-[11px] leading-relaxed">
                Dacă vrei să înlocuiești o singură poză, apasă pe &bdquo;X&rdquo;-ul din colțul pozei pentru a goli slotul respectiv.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-amber-300">3. Click pe poze din listă</span>
              <p className="text-[11px] leading-relaxed">
                Dă click pe oricare poză din lista de jos pentru a deschide butoanele &bdquo;Pune în stânga&rdquo; și &bdquo;Pune în dreapta&rdquo;.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 bg-slate-950 text-slate-400 text-center text-xs">
        <p>MetalCraft Compare • Instrument profesional pentru ateliere de confecții metalice, fier forjat și sudură</p>
      </footer>
    </div>
  );
}
