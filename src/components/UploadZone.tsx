import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Plus,
  LayoutGrid,
  Sparkles,
  Link as LinkIcon,
  Globe,
  Loader2,
  Check,
  AlertCircle,
  ClipboardPaste,
  FolderArchive,
  FolderDown,
} from 'lucide-react';
import { PhotoItem } from '../types';
import { importExternalAlbum } from '../utils/aiAnalysis';

interface UploadZoneProps {
  photos: PhotoItem[];
  leftPhotoId: string | null;
  rightPhotoId: string | null;
  onAddPhotos: (files: FileList | File[]) => void;
  onAddImportedPhotos?: (newPhotos: PhotoItem[], autoAnalyze?: boolean) => void;
  onAssignToLeft: (photo: PhotoItem) => void;
  onAssignToRight: (photo: PhotoItem) => void;
  onRemovePhoto: (id: string) => void;
  onClearAllPhotos: () => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  onExportZip?: () => void;
  isZipping?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  photos,
  leftPhotoId,
  rightPhotoId,
  onAddPhotos,
  onAddImportedPhotos,
  onAssignToLeft,
  onAssignToRight,
  onRemovePhoto,
  onClearAllPhotos,
  onAnalyze,
  isAnalyzing,
  onExportZip,
  isZipping,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  // Link import state
  const [albumUrl, setAlbumUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [autoAnalyzeAfterImport, setAutoAnalyzeAfterImport] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddPhotos(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddPhotos(e.target.files);
      e.target.value = '';
    }
  };

  const handlePhotoCardClick = (photo: PhotoItem) => {
    setSelectedPhotoId(selectedPhotoId === photo.id ? null : photo.id);
  };

  // Paste from clipboard helper
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setAlbumUrl(text.trim());
        setImportError(null);
      }
    } catch {
      // Browser permissions fallback
    }
  };

  // Submit external album URL
  const handleImportAlbum = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetUrl = albumUrl.trim();
    if (!targetUrl) {
      setImportError('Albumul trebuie să fie public (Anyone with the link). Verifică setările de partajare.');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const imported = await importExternalAlbum(targetUrl);
      if (onAddImportedPhotos) {
        onAddImportedPhotos(imported, autoAnalyzeAfterImport);
      }
      setImportSuccess(`✓ Au fost încărcate cu succes ${imported.length} poze din album!`);
      setAlbumUrl('');
      setTimeout(() => setImportSuccess(null), 6000);
    } catch (err: any) {
      setImportError(
        err.message || 'Albumul trebuie să fie public (Anyone with the link). Verifică setările de partajare.'
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Încărcare &amp; Galerie Poze</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-amber-400 border border-slate-700">
                {photos.length}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Încarcă poze din fișiere locale (drag &amp; drop) sau lipește linkul unui album din Google Photos
            </p>
          </div>
        </div>

        {/* Top actions: Analyze button + ZIP Export button + Clear button */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onAnalyze && photos.length > 0 && (
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'Se analizează...' : 'Analizează cu Gemini'}</span>
            </button>
          )}

          {onExportZip && photos.length > 0 && (
            <button
              onClick={onExportZip}
              disabled={isZipping}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 font-extrabold text-xs shadow transition cursor-pointer"
              title="Descarcă toate pozele într-o arhivă ZIP separată în 2 foldere: Atelier și Montaj"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Se arhivează...' : 'Descarcă ZIP (2 Foldere)'}</span>
            </button>
          )}

          {photos.length > 0 && (
            <button
              onClick={onClearAllPhotos}
              type="button"
              className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-500/10 border border-slate-700/60 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Golește lista</span>
            </button>
          )}
        </div>
      </div>

      {/* DUAL INPUT SECTION: Google Photos Link + Drag & Drop */}
      <div className="space-y-3.5">
        {/* Section 1: Google Photos Album Link */}
        <div className="bg-slate-950/70 rounded-xl border border-amber-500/30 p-3.5 sm:p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <LinkIcon className="w-3 h-3" />
              </div>
              <span>Încărcare poze din link de album Google Photos</span>
            </div>
            <span className="text-[10px] text-amber-400/80 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Google Photos
            </span>
          </div>

          <form onSubmit={handleImportAlbum} className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={albumUrl}
                  onChange={(e) => {
                    setAlbumUrl(e.target.value);
                    if (importError) setImportError(null);
                  }}
                  placeholder="https://photos.app.goo.gl/..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none pr-20 font-mono transition"
                />
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="absolute right-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Lipește din Clipboard"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
              </div>

              {/* Exact Button: "Încarcă poze din link" */}
              <button
                type="submit"
                disabled={isImporting || !albumUrl.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Se descarcă pozele...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Încarcă poze din link</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message Display: Exact text required */}
            {importError && (
              <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span className="font-medium">{importError}</span>
              </div>
            )}

            {/* Success Message */}
            {importSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span className="font-medium">{importSuccess}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1.5 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoAnalyzeAfterImport}
                  onChange={(e) => setAutoAnalyzeAfterImport(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Analizează automat cu Gemini după import</span>
                </span>
              </label>

              <span className="text-slate-500">
                * Asigură-te că albumul este setat pe „Anyone with the link” (Public).
              </span>
            </div>
          </form>
        </div>

        {/* Section 2: Drag & Drop upload for local files */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-all cursor-pointer ${
            isDraggingOver
              ? 'border-amber-400 bg-amber-500/15 scale-[1.01]'
              : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-800/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shadow-inner flex-shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm font-bold text-slate-200">
                Sau trage și plasează poze aici / <span className="text-amber-400 underline underline-offset-2">răsfoiește fișierele din telefon sau calculator</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload multiplu compatibil JPG, PNG, WEBP.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails Gallery of Uploaded Photos */}
      {photos.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Apasă pe o poză pentru a o trimite în stânga sau în dreapta:</span>
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {photos.length} {photos.length === 1 ? 'poză' : 'poze'} disponibile
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {photos.map((photo) => {
              const isLeft = leftPhotoId === photo.id;
              const isRight = rightPhotoId === photo.id;
              const isSelected = selectedPhotoId === photo.id;

              return (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoCardClick(photo)}
                  className={`group relative rounded-xl overflow-hidden border bg-slate-950 transition-all cursor-pointer select-none flex flex-col ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl scale-[1.02]'
                      : isLeft
                      ? 'border-amber-500/70 ring-1 ring-amber-500/30'
                      : isRight
                      ? 'border-emerald-500/70 ring-1 ring-emerald-500/30'
                      : 'border-slate-800 hover:border-slate-600 hover:shadow-lg'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="aspect-square relative bg-slate-900 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Active slot badges */}
                    <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
                      {isLeft && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          În lucru
                        </span>
                      )}
                      {isRight && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950 shadow">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Final
                        </span>
                      )}
                    </div>

                    {/* Delete from gallery button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePhoto(photo.id);
                      }}
                      type="button"
                      className="absolute top-1.5 right-1.5 z-20 w-6 h-6 rounded-md bg-slate-900/85 hover:bg-rose-600 text-slate-300 hover:text-white transition opacity-0 group-hover:opacity-100 flex items-center justify-center shadow"
                      title="Șterge din lista de poze"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    {/* Interactive overlay on click: "Pune în stânga" și "Pune în dreapta" */}
                    {isSelected ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm p-2 flex flex-col justify-center items-center gap-2 z-20 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          Unde o pui?
                        </div>
                        <div className="flex flex-col w-full gap-1.5">
                          <button
                            onClick={() => {
                              onAssignToLeft(photo);
                              setSelectedPhotoId(null);
                            }}
                            type="button"
                            className="w-full py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Pune în stânga</span>
                          </button>

                          <button
                            onClick={() => {
                              onAssignToRight(photo);
                              setSelectedPhotoId(null);
                            }}
                            type="button"
                            className="w-full py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                          >
                            <span>Pune în dreapta</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                        <button
                          onClick={() => setSelectedPhotoId(null)}
                          type="button"
                          className="text-[10px] text-slate-400 hover:text-slate-200 mt-0.5 cursor-pointer"
                        >
                          Închide
                        </button>
                      </div>
                    ) : (
                      /* Hover hint */
                      <div className="absolute inset-x-0 bottom-0 py-1 bg-gradient-to-t from-slate-950/90 to-transparent text-[10px] font-medium text-slate-300 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        Click pt. opțiuni
                      </div>
                    )}
                  </div>

                  {/* Bottom quick action bar */}
                  <div className="p-1.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignToLeft(photo);
                      }}
                      type="button"
                      className={`flex-1 py-1 px-1 rounded text-[10px] font-bold flex items-center justify-center gap-0.5 transition cursor-pointer ${
                        isLeft
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-700/60'
                      }`}
                      title="Pune în stânga (În lucru)"
                    >
                      <ArrowLeft className="w-2.5 h-2.5" />
                      <span>Stânga</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignToRight(photo);
                      }}
                      type="button"
                      className={`flex-1 py-1 px-1 rounded text-[10px] font-bold flex items-center justify-center gap-0.5 transition cursor-pointer ${
                        isRight
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700/60'
                      }`}
                      title="Pune în dreapta (Final)"
                    >
                      <span>Dreapta</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Quick Add More Tile */}
            <button
              onClick={() => {
                fileInputRef.current?.click();
              }}
              type="button"
              className="aspect-square rounded-xl border border-dashed border-slate-700 hover:border-amber-400 bg-slate-900/40 hover:bg-amber-500/5 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-amber-300 transition cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-amber-500/20 flex items-center justify-center transition">
                <Plus className="w-4 h-4 text-slate-300 group-hover:text-amber-400" />
              </div>
              <span className="text-[11px] font-bold">Adaugă poze</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
