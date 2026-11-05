import React from 'react';
import {
  FolderArchive,
  Folder,
  CheckCircle2,
  Loader2,
  X,
  FileText,
  Download,
  Laptop,
} from 'lucide-react';
import { ZipExportProgress, ZipExportResult } from '../utils/zipArchive';

interface ZipExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: ZipExportProgress | null;
  result: ZipExportResult | null;
  isZipping: boolean;
}

export const ZipExportModal: React.FC<ZipExportModalProps> = ({
  isOpen,
  onClose,
  progress,
  result,
  isZipping,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {result ? 'Arhivă ZIP Descărcată!' : 'Generare Arhivă ZIP (2 Foldere)'}
              </h3>
              <p className="text-xs text-slate-400">
                Separare automată: În lucru (Atelier) &amp; Finalizat (Montaj client)
              </p>
            </div>
          </div>

          {!isZipping && (
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Structure Preview of the 2 Folders */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Structura arhivei salvate pe laptop:
          </div>
          <div className="space-y-1.5 font-mono text-slate-300">
            <div className="flex items-center gap-2 text-amber-400">
              <Folder className="w-4 h-4 fill-amber-500/20" />
              <span className="font-bold">📁 In_Lucru_Atelier/</span>
              <span className="text-[11px] text-slate-400 font-sans">
                (Poze din timpul lucrării, debitare, sudură pe banc)
              </span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Folder className="w-4 h-4 fill-emerald-500/20" />
              <span className="font-bold">📁 Final_Montat_Client/</span>
              <span className="text-[11px] text-slate-400 font-sans">
                (Poze lucrare montată pe vilă/terasă, vopsită finisată)
              </span>
            </div>
            <div className="flex items-center gap-2 text-sky-400 pl-4 border-l border-slate-800 ml-2">
              <FileText className="w-3.5 h-3.5" />
              <span>RAPORT_CLASIFICARE_ATELIER_SI_CLIENT.txt</span>
            </div>
          </div>
        </div>

        {/* Progress Display */}
        {isZipping && progress && (
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{progress.filename}</span>
              </span>
              <span className="font-bold text-amber-400">{progress.percent}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${progress.percent}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Poza {progress.current} din {progress.total} • Se comprimă în arhivă ZIP...
            </p>
          </div>
        )}

        {/* Success Result */}
        {result && !isZipping && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Fișierul ZIP a fost descărcat cu succes în laptop!</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-amber-400 uppercase font-black">În lucru (Atelier)</div>
                <div className="text-base font-extrabold text-white">{result.inLucruCount} poze</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-emerald-400 uppercase font-black">Final (Montat)</div>
                <div className="text-base font-extrabold text-white">{result.finalCount} poze</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <Laptop className="w-4 h-4 text-slate-400" />
              <span>Verifică folderul &bdquo;Downloads&rdquo; din calculatorul tău.</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            disabled={isZipping}
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
};
