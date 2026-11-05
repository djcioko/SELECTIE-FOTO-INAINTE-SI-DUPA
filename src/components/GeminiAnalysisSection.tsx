import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Check,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FolderArchive,
  FolderDown,
  Folder,
} from 'lucide-react';
import { PhotoItem, PhotoAnalysis } from '../types';

interface GeminiAnalysisSectionProps {
  photos: PhotoItem[];
  analyses: PhotoAnalysis[];
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onApplyBest: () => void;
  onAssignToLeft: (photo: PhotoItem) => void;
  onAssignToRight: (photo: PhotoItem) => void;
  onExportZip?: () => void;
  isZipping?: boolean;
  leftPhotoId: string | null;
  rightPhotoId: string | null;
}

export const GeminiAnalysisSection: React.FC<GeminiAnalysisSectionProps> = ({
  photos,
  analyses,
  isAnalyzing,
  onAnalyze,
  onApplyBest,
  onAssignToLeft,
  onAssignToRight,
  onExportZip,
  isZipping,
  leftPhotoId,
  rightPhotoId,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasAnalyses = analyses.length > 0;

  // Group photos based on Gemini analysis
  const inLucruItems = analyses
    .filter((a) => a.category === 'in_lucru')
    .map((a) => ({
      analysis: a,
      photo: photos.find((p) => p.id === a.photoId),
    }))
    .filter((item): item is { analysis: PhotoAnalysis; photo: PhotoItem } => item.photo !== undefined);

  const finalItems = analyses
    .filter((a) => a.category === 'final')
    .map((a) => ({
      analysis: a,
      photo: photos.find((p) => p.id === a.photoId),
    }))
    .filter((item): item is { analysis: PhotoAnalysis; photo: PhotoItem } => item.photo !== undefined);

  const bestInLucru = inLucruItems.find((item) => item.analysis.isBestCandidate) || inLucruItems[0];
  const bestFinal = finalItems.find((item) => item.analysis.isBestCandidate) || finalItems[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 rounded-2xl border border-amber-500/30 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Banner & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                Analiză Inteligentă cu Gemini AI
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PRAG PERMISIV ≥ 40%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clasificare permisivă pentru poze reale de atelier: acceptă orice poză de la 40% claritate în sus (nu cere 90%)
            </p>
          </div>
        </div>

        {/* Action Buttons: "Analizează pozele" + "Folosește cele mai bune" */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Buton "Analizează pozele" */}
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || photos.length === 0}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Se analizează pozele...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analizează pozele</span>
              </>
            )}
          </button>

          {/* Buton "Folosește cele mai bune" */}
          {hasAnalyses && (
            <button
              onClick={onApplyBest}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Pune automat cea mai bună poză din 'În lucru' în stânga și cea din 'Final' în dreapta (prag permisiv ≥40%)"
            >
              <Award className="w-4 h-4 stroke-[2.5]" />
              <span>Folosește cele mai bune</span>
            </button>
          )}

          {/* Buton "Descarcă ZIP (2 Foldere)" */}
          {onExportZip && photos.length > 0 && (
            <button
              onClick={onExportZip}
              disabled={isZipping}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 cursor-pointer"
              title="Descarcă toate pozele împărțite în 2 foldere: În lucru / Atelier și Final / Montat la client"
            >
              <FolderArchive className="w-4 h-4 text-emerald-400" />
              <span>{isZipping ? 'Se arhivează...' : 'Descarcă ZIP (2 Foldere)'}</span>
            </button>
          )}

          {hasAnalyses && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              type="button"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title={isExpanded ? 'Restrânge rezultatele' : 'Extinde rezultatele'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Loading state indicator */}
      {isAnalyzing && (
        <div className="py-6 px-4 bg-slate-950/60 rounded-xl border border-amber-500/20 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Gemini analizează {photos.length} poze din atelier și montaj (prag minim 40%)...</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Analiză permisivă adaptată condițiilor reale din atelier: acceptăm poze utile chiar dacă nu sunt perfect clare.
          </p>
        </div>
      )}

      {/* Grouped results view */}
      {hasAnalyses && isExpanded && !isAnalyzing && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>Rezultate clasificare ({analyses.length} poze analizate)</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              ✓ Prag permisiv: acceptă orice poză de la 40% claritate în sus
            </span>
          </div>

          {/* Banner Separare Foldere pentru Descărcare pe Laptop */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <FolderArchive className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200">
                  Separare pregătită pentru descărcare pe laptop (format arhivă ZIP):
                </div>
                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-amber-400 font-semibold">📁 In_Lucru_Atelier/ ({inLucruItems.length} poze)</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">📁 Final_Montat_Client/ ({finalItems.length} poze)</span>
                </div>
              </div>
            </div>
            {onExportZip && (
              <button
                onClick={onExportZip}
                disabled={isZipping}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto whitespace-nowrap"
              >
                <FolderDown className="w-4 h-4" />
                <span>Descarcă Arhivă ZIP</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ================= GRUP 1: ÎN LUCRU / ATELIER ================= */}
            <div className="bg-slate-950/80 rounded-xl border border-amber-500/30 p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                  <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <span>În lucru / Atelier ({inLucruItems.length})</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Debitare, sudură, banc de lucru
                </span>
              </div>

              {inLucruItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  Nicio poză clasificată ca fiind &bdquo;În lucru&rdquo;.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inLucruItems.map(({ photo, analysis }) => {
                    const isSelected = leftPhotoId === photo.id;
                    const isBest = analysis.isBestCandidate || (bestInLucru && bestInLucru.photo.id === photo.id);

                    return (
                      <div
                        key={photo.id}
                        className={`relative rounded-xl border bg-slate-900 overflow-hidden transition-all flex flex-col ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                            : isBest
                            ? 'border-amber-500/60 bg-amber-500/5'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Image Preview */}
                        <div className="aspect-video relative overflow-hidden bg-slate-950">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Quality score badge */}
                          <div className="absolute top-1.5 left-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black border shadow ${
                                analysis.qualityScore >= 40
                                  ? 'bg-slate-950/90 text-amber-300 border-amber-500/40'
                                  : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                              }`}
                            >
                              Claritate: {analysis.qualityScore}% {analysis.qualityScore >= 40 ? '✓ Utilă' : ''}
                            </span>
                          </div>

                          {/* Best candidate star badge */}
                          {isBest && (
                            <div className="absolute top-1.5 right-1.5">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 shadow">
                                <Award className="w-3 h-3" />
                                TOP CLARĂ
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details & Reason */}
                        <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
                          <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                            {analysis.reason}
                          </p>

                          <button
                            onClick={() => onAssignToLeft(photo)}
                            type="button"
                            className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 hover:bg-amber-500/20 text-slate-200 hover:text-amber-400 border border-slate-700'
                            }`}
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>{isSelected ? '✓ Activă în Stânga' : 'Pune în stânga'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ================= GRUP 2: FINAL / MONTAT ================= */}
            <div className="bg-slate-950/80 rounded-xl border border-emerald-500/30 p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Final / Montat ({finalItems.length})</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Vopsit electrostatic, montat pe fațadă
                </span>
              </div>

              {finalItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  Nicio poză clasificată ca fiind &bdquo;Final&rdquo;.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {finalItems.map(({ photo, analysis }) => {
                    const isSelected = rightPhotoId === photo.id;
                    const isBest = analysis.isBestCandidate || (bestFinal && bestFinal.photo.id === photo.id);

                    return (
                      <div
                        key={photo.id}
                        className={`relative rounded-xl border bg-slate-900 overflow-hidden transition-all flex flex-col ${
                          isSelected
                            ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                            : isBest
                            ? 'border-emerald-500/60 bg-emerald-500/5'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Image Preview */}
                        <div className="aspect-video relative overflow-hidden bg-slate-950">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Quality score badge */}
                          <div className="absolute top-1.5 left-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black border shadow ${
                                analysis.qualityScore >= 40
                                  ? 'bg-slate-950/90 text-emerald-300 border-emerald-500/40'
                                  : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                              }`}
                            >
                              Claritate: {analysis.qualityScore}% {analysis.qualityScore >= 40 ? '✓ Utilă' : ''}
                            </span>
                          </div>

                          {/* Best candidate star badge */}
                          {isBest && (
                            <div className="absolute top-1.5 right-1.5">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 shadow">
                                <Award className="w-3 h-3" />
                                TOP CLARĂ
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details & Reason */}
                        <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
                          <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                            {analysis.reason}
                          </p>

                          <button
                            onClick={() => onAssignToRight(photo)}
                            type="button"
                            className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 border border-slate-700'
                            }`}
                          >
                            <span>{isSelected ? '✓ Activă în Dreapta' : 'Pune în dreapta'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
