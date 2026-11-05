import React from 'react';
import { Hammer, Sparkles, RefreshCw, FolderOpen, Download, Share2 } from 'lucide-react';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';
import { PresetProject } from '../types';

interface HeaderProps {
  onSelectPreset: (preset: PresetProject) => void;
  onReset: () => void;
  onExport: () => void;
  onCopyClipboard: () => void;
  isExporting: boolean;
  copiedSuccess: boolean;
  hasBothImages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  onExport,
  onCopyClipboard,
  isExporting,
  copiedSuccess,
  hasBothImages,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50">
            <Hammer className="w-5 h-5 -rotate-12" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-400 animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                MetalCraft <span className="text-amber-400">Compare</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                PRO CONSOLĂ
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Colaje foto Înainte (Atelier) &amp; După (Montat la client)
            </p>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Presets dropdown / Quick load */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition shadow-sm cursor-pointer"
              title="Încarcă un proiect demonstrativ"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Exemple de probă</span>
              <span className="sm:hidden">Exemple</span>
            </button>
            <div className="absolute right-0 mt-1 w-72 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-2 hidden group-hover:block transition-all z-50">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Proiecte demonstrative confecții:
              </div>
              {SAMPLE_PROJECTS.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onSelectPreset(project)}
                  type="button"
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-700/80 transition flex flex-col gap-0.5 cursor-pointer text-slate-200"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span>{project.title}</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-[11px] text-slate-400">{project.subtitle}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition border border-transparent hover:border-slate-700 cursor-pointer"
            title="Resetează colajul"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Quick Copy to Clipboard */}
          <button
            onClick={onCopyClipboard}
            disabled={!hasBothImages}
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Copiază imaginea în Clipboard pentru WhatsApp / Social Media"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{copiedSuccess ? '✓ Copiat!' : 'Copiază'}</span>
          </button>

          {/* Download CTA */}
          <button
            onClick={onExport}
            disabled={!hasBothImages || isExporting}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Se generează...' : 'Descarcă JPG'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
