import React, { useState } from 'react';
import { TATTOO_STYLES } from '../../utils/styles';
import { StyleLibraryItem } from '../../types';
import { 
  Layers, 
  Search, 
  Feather, 
  Sparkles, 
  Check, 
  Compass, 
  MapPin, 
  Copy
} from 'lucide-react';

interface StyleLibraryViewProps {
  onSelectStyleForDesign?: (styleName: string) => void;
}

export const StyleLibraryView: React.FC<StyleLibraryViewProps> = ({
  onSelectStyleForDesign
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleLibraryItem | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const filteredStyles = TATTOO_STYLES.filter(st => 
    st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.visualTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.promptKeywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
        <h2 className="text-base font-bold font-['Cinzel',serif] text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Dövme Stilleri Ansiklopedisi ({TATTOO_STYLES.length})</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          26+ profesyonel dövme stili, iğne teknikleri, anatomik uyum ve AI prompt anahtarları.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Stil adı, iğne tipi veya anahtar kelime ara..."
          className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500/70 focus:outline-none"
        />
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredStyles.map(st => (
          <div
            key={st.id}
            onClick={() => setSelectedStyle(st)}
            className="border border-zinc-800 hover:border-amber-500/40 bg-zinc-900/70 rounded-2xl p-4 transition-all cursor-pointer space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-zinc-100 font-['Cinzel',serif]">{st.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-amber-300 border border-zinc-800">
                  {st.visualTag}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                {st.description}
              </p>
            </div>

            <div className="space-y-1 text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/60 font-mono">
              <div className="truncate">
                <span className="text-amber-400 font-semibold">İğneler:</span> {st.recommendedNeedles}
              </div>
              <div className="truncate">
                <span className="text-cyan-400 font-semibold">Uyumlu Stiller:</span> {st.compatibleStyles.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Style Detail Modal */}
      {selectedStyle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">{selectedStyle.visualTag}</span>
                <h3 className="text-base font-bold text-zinc-100 font-['Cinzel',serif]">{selectedStyle.name}</h3>
              </div>
              <button
                onClick={() => setSelectedStyle(null)}
                className="text-zinc-400 hover:text-zinc-100 text-xl font-bold px-2"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-200">Stil Açıklaması & Karakteristiği:</span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                {selectedStyle.description}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-amber-400 font-bold block mb-0.5">Tavsiye Edilen İğneler & Teknik:</span>
                <p className="text-zinc-300 text-[11px]">{selectedStyle.recommendedNeedles}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-cyan-400 font-bold block mb-0.5">İdeal Vücut Yerleşimleri:</span>
                <p className="text-zinc-300 text-[11px]">{selectedStyle.bestBodyPlacements.join(', ')}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-rose-400 font-bold block mb-0.5">Birlikte Kusursuz Uyum Sağlayan Stiller:</span>
                <p className="text-zinc-300 text-[11px]">{selectedStyle.compatibleStyles.join(', ')}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-300">Midjourney & Flux AI Anahtar Kelimeleri:</span>
              <div className="flex flex-wrap gap-1">
                {selectedStyle.promptKeywords.map((kw, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCopy(kw)}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-amber-300 font-mono flex items-center gap-1 transition-all"
                  >
                    <span>{kw}</span>
                    {copiedKeyword === kw && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              {onSelectStyleForDesign && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectStyleForDesign(selectedStyle.name);
                    setSelectedStyle(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tasarıma Dahil Et</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedStyle(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
