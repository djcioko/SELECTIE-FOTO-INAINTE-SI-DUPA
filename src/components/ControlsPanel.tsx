import React, { useState } from 'react';
import {
  SplitSquareVertical,
  Tag,
  Palette,
  Maximize2,
  Check,
  Smartphone,
  Monitor,
  Square,
  Sparkles,
} from 'lucide-react';
import { CollageSettings, DividerStyle, BadgeStyle, AspectRatio } from '../types';

interface ControlsPanelProps {
  settings: CollageSettings;
  onUpdateSettings: (newSettings: Partial<CollageSettings>) => void;
}

const DIVIDER_COLORS = [
  { name: 'Galben Siguranță', value: '#f59e0b' },
  { name: 'Portocaliu Flacără', value: '#ea580c' },
  { name: 'Oțel Alb', value: '#ffffff' },
  { name: 'Inox Periat', value: '#cbd5e1' },
  { name: 'Verde Smarald', value: '#10b981' },
  { name: 'Albastru Electric', value: '#38bdf8' },
  { name: 'Negru Antracit', value: '#0f172a' },
];

const CANVAS_COLORS = [
  { name: 'Antracit RAL 7016', value: '#0f172a' },
  { name: 'Oțel Brut', value: '#1e293b' },
  { name: 'Negru Mat', value: '#05070a' },
  { name: 'Gri Industrial', value: '#334155' },
  { name: 'Alb Curat', value: '#ffffff' },
];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'divider' | 'badges' | 'frame'>('divider');

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('divider')}
          type="button"
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
            activeTab === 'divider'
              ? 'border-amber-400 text-amber-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span>Linie Separare</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          type="button"
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
            activeTab === 'badges'
              ? 'border-amber-400 text-amber-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Etichete &amp; Text</span>
        </button>

        <button
          onClick={() => setActiveTab('frame')}
          type="button"
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
            activeTab === 'frame'
              ? 'border-amber-400 text-amber-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Format &amp; Rame</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5 space-y-4 text-xs">
        {/* ================= TAB 1: LINIE SEPARARE ================= */}
        {activeTab === 'divider' && (
          <div className="space-y-4">
            {/* Toggle Divider */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-bold text-slate-200 text-sm">Linie de separare</span>
                <p className="text-[11px] text-slate-400">Linie vizibilă între poza de atelier și poza finală</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showDivider}
                  onChange={(e) => onUpdateSettings({ showDivider: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {settings.showDivider && (
              <>
                {/* Divider Width */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Grosime linie separare</span>
                    <span className="text-amber-400">{settings.dividerWidth} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="18"
                    step="1"
                    value={settings.dividerWidth}
                    onChange={(e) => onUpdateSettings({ dividerWidth: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Subțire (1px)</span>
                    <span>Mediu (6px)</span>
                    <span>Gros (18px)</span>
                  </div>
                </div>

                {/* Divider Colors */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-300 block">Culoare linie</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    {DIVIDER_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => onUpdateSettings({ dividerColor: c.value })}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition cursor-pointer ${
                          settings.dividerColor.toLowerCase() === c.value.toLowerCase()
                            ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 border-white'
                            : 'border-slate-700 hover:scale-110'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      >
                        {settings.dividerColor.toLowerCase() === c.value.toLowerCase() && (
                          <Check className={`w-3.5 h-3.5 ${c.value === '#ffffff' || c.value === '#cbd5e1' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}

                    {/* Custom Color Input */}
                    <div className="flex items-center gap-1.5 ml-2">
                      <input
                        type="color"
                        value={settings.dividerColor}
                        onChange={(e) => onUpdateSettings({ dividerColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                        title="Alege altă culoare"
                      />
                      <span className="text-[11px] text-slate-400 font-mono">{settings.dividerColor}</span>
                    </div>
                  </div>
                </div>

                {/* Divider Style */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-300 block">Stil linie</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'solid', label: 'Solidă' },
                      { id: 'dashed', label: 'Întreruptă' },
                      { id: 'double', label: 'Dublă' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => onUpdateSettings({ dividerStyle: st.id as DividerStyle })}
                        className={`py-2 px-3 rounded-lg border font-semibold text-center transition cursor-pointer ${
                          settings.dividerStyle === st.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center Icon Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="font-semibold text-slate-300">Emblemă centrală ⇄</span>
                    <p className="text-[11px] text-slate-400">Cerc cu săgeți în mijlocul liniei de separare</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showCenterIcon}
                      onChange={(e) => onUpdateSettings({ showCenterIcon: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= TAB 2: ETICHETE & TEXT ================= */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            {/* Toggle Badges */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-bold text-slate-200 text-sm">Etichete suprapuse</span>
                <p className="text-[11px] text-slate-400">Afișează text pe fiecare poză (ex: Înainte / După)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showBadges}
                  onChange={(e) => onUpdateSettings({ showBadges: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {settings.showBadges && (
              <>
                {/* Custom text inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-amber-300 block">
                      Text Stânga (Atelier)
                    </label>
                    <input
                      type="text"
                      value={settings.leftBadgeText}
                      onChange={(e) => onUpdateSettings({ leftBadgeText: e.target.value })}
                      placeholder="Ex: În lucru"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-emerald-300 block">
                      Text Dreapta (Montat)
                    </label>
                    <input
                      type="text"
                      value={settings.rightBadgeText}
                      onChange={(e) => onUpdateSettings({ rightBadgeText: e.target.value })}
                      placeholder="Ex: Final"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Badge Styles */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-300 block">Stil vizual etichetă</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'warning', label: 'Industrial Warning' },
                      { id: 'glass', label: 'Sticlă Fumată' },
                      { id: 'pill', label: 'Pill Rotunjit' },
                      { id: 'steel', label: 'Placă Oțel' },
                      { id: 'stamp', label: 'Ștampilă' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onUpdateSettings({ badgeStyle: style.id as BadgeStyle })}
                        className={`p-2 rounded-lg border font-semibold text-center transition cursor-pointer text-[11px] ${
                          settings.badgeStyle === style.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position & Size */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-300 block">Poziție etichete</span>
                    <select
                      value={settings.badgePosition}
                      onChange={(e) => onUpdateSettings({ badgePosition: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="top-inside">Sus (Colțuri)</option>
                      <option value="bottom-inside">Jos (Colțuri)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-300 block">Mărime etichete</span>
                    <select
                      value={settings.badgeSize}
                      onChange={(e) => onUpdateSettings({ badgeSize: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="sm">Mică (Subtilă)</option>
                      <option value="md">Medie (Standard)</option>
                      <option value="lg">Mare (Impact vizual)</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= TAB 3: FORMAT, BORDER & COLȚURI ================= */}
        {activeTab === 'frame' && (
          <div className="space-y-4">
            {/* Aspect Ratio Selection */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-300 block">Raport de Aspect (Format)</span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: '16:9', label: '16:9', desc: 'Landscape' },
                  { id: '1:1', label: '1:1', desc: 'Instagram' },
                  { id: '4:3', label: '4:3', desc: 'Standard' },
                  { id: '9:16', label: '9:16', desc: 'Story/TikTok' },
                  { id: '3:2', label: '3:2', desc: 'DSLR' },
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => onUpdateSettings({ aspectRatio: ratio.id as AspectRatio })}
                    className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center transition cursor-pointer ${
                      settings.aspectRatio === ratio.id
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-xs">{ratio.label}</span>
                    <span className="text-[9px] opacity-75">{ratio.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Orientation */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-300 block">Aranjament poze</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ orientation: 'horizontal' })}
                  className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    settings.orientation === 'horizontal'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <SplitSquareVertical className="w-4 h-4 rotate-90" />
                  <span>Stânga / Dreapta</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ orientation: 'vertical' })}
                  className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    settings.orientation === 'vertical'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <SplitSquareVertical className="w-4 h-4" />
                  <span>Sus / Jos (Stacked)</span>
                </button>
              </div>
            </div>

            {/* Canvas Background Color */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-300 block">Culoare fundal colaj</span>
              <div className="flex flex-wrap gap-2 items-center">
                {CANVAS_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onUpdateSettings({ canvasBgColor: c.value })}
                    className={`w-7 h-7 rounded-lg border transition cursor-pointer flex items-center justify-center ${
                      settings.canvasBgColor === c.value
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 border-white'
                        : 'border-slate-700 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {settings.canvasBgColor === c.value && (
                      <Check className={`w-3.5 h-3.5 ${c.value === '#ffffff' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
                <input
                  type="color"
                  value={settings.canvasBgColor}
                  onChange={(e) => onUpdateSettings({ canvasBgColor: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 ml-2"
                  title="Altă culoare fundal"
                />
              </div>
            </div>

            {/* Corner Radius & Padding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>Rotunjire colțuri colaj</span>
                  <span className="text-amber-400">{settings.cornerRadius} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={settings.cornerRadius}
                  onChange={(e) => onUpdateSettings({ cornerRadius: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>Spațiere fundal (Padding)</span>
                  <span className="text-amber-400">{settings.canvasPadding} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="36"
                  value={settings.canvasPadding}
                  onChange={(e) => onUpdateSettings({ canvasPadding: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Outer Border */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Grosime ramă exterioară (Border)</span>
                <span className="text-amber-400">{settings.borderWidth} px</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={settings.borderWidth}
                onChange={(e) => onUpdateSettings({ borderWidth: parseInt(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
