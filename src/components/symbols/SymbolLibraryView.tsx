import React, { useState } from 'react';
import { SYMBOL_LIBRARY } from '../../utils/symbolLibraryData';
import { SymbolLibraryItem } from '../../types';
import { 
  Search, 
  Sparkles
} from 'lucide-react';

interface SymbolLibraryViewProps {
  onSelectSymbolForDesign?: (symbolName: string) => void;
}

export const SymbolLibraryView: React.FC<SymbolLibraryViewProps> = ({
  onSelectSymbolForDesign
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolLibraryItem | null>(null);

  const categories = ['Hepsi', 'Bitki/Çiçek', 'Geometri', 'Mitoloji', 'Kutsal Obje', 'Hayvan', 'Kozmik', 'Element'];

  const filteredSymbols = SYMBOL_LIBRARY.filter(sym => {
    const matchesCat = selectedCategory === 'Hepsi' || sym.category === selectedCategory;
    const matchesSearch = 
      sym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sym.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sym.subcategory && sym.subcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sym.numerologyConnection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sym.astrologyConnection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sym.enneagramConnection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sym.archetypes && sym.archetypes.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 bg-[#080808]/80 backdrop-blur-md p-4 rounded-xl">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold flex items-center gap-2">
            <span>◆</span>
            <span>Ezoterik Sembol Kütüphanesi ({SYMBOL_LIBRARY.length})</span>
          </h2>
          <p className="text-[11px] text-[#666] font-mono mt-0.5">
            Numeroloji, astroloji ve Enneagram arketipleriyle eşleşen dövme sembolleri ve kompozisyonel rolleri.
          </p>
        </div>
      </header>

      {/* Search & Category Pills */}
      <div className="space-y-3">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-[#555] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Sembol adı, anlamı veya burç/sayı ile ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-xs text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#c4a47c] border border-[#c4a47c] text-black font-bold shadow-md shadow-[#c4a47c]/15'
                  : 'bg-[#0d0d0d] border border-[#1a1a1a] text-[#888] hover:text-[#e0e0e0] hover:border-[#333]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Symbols Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSymbols.map(sym => (
          <div
            key={sym.id}
            onClick={() => setSelectedSymbol(sym)}
            className="border border-[#1a1a1a] hover:border-[#c4a47c]/50 bg-[#0a0a0a] rounded-xl p-5 transition-all cursor-pointer space-y-3 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white font-serif truncate">{sym.name}</h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#151515] text-[#c4a47c] border border-[#222] shrink-0">
                  {sym.category}
                </span>
              </div>
              {sym.subcategory && (
                <div className="text-[10px] text-[#c4a47c]/80 font-mono tracking-wide">
                  ✦ {sym.subcategory}
                </div>
              )}
              <p className="text-xs text-[#999] leading-relaxed line-clamp-3">
                {sym.meaning}
              </p>
              {sym.archetypes && sym.archetypes.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {sym.archetypes.slice(0, 3).map((arc, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-[#111] text-[#777] border border-[#1e1e1e] font-mono">
                      {arc}
                    </span>
                  ))}
                  {sym.category === 'Hayvan' && sym.designCompatibility?.canBeAbstractedToLines && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 font-mono">
                      Çizgisel Soyutlanabilir
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-[10px] text-[#666] pt-3 border-t border-[#1a1a1a] font-mono">
              <div className="truncate">
                <span className="text-[#c4a47c]">Numeroloji:</span> {sym.numerologyConnection}
              </div>
              <div className="truncate">
                <span className="text-cyan-400">Astroloji:</span> {sym.astrologyConnection}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Symbol Detail Modal */}
      {selectedSymbol && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl max-w-md w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl custom-scrollbar">
            <div className="flex items-start justify-between border-b border-[#1a1a1a] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#c4a47c] uppercase tracking-wider">{selectedSymbol.category}</span>
                  {selectedSymbol.subcategory && (
                    <span className="text-[9px] font-mono text-[#888] bg-[#141414] px-1.5 py-0.5 rounded border border-[#222]">
                      {selectedSymbol.subcategory}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white font-serif mt-0.5">{selectedSymbol.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSymbol(null)}
                className="text-[#666] hover:text-white text-xl font-bold px-2 cursor-pointer"
              >
                ×
              </button>
            </div>

            {selectedSymbol.archetypes && selectedSymbol.archetypes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedSymbol.archetypes.map((arc, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#161616] text-[#c4a47c] border border-[#262626] font-mono">
                    ✦ {arc}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#c4a47c] block">Ezoterik & Psikolojik Anlam</span>
              <p className="text-xs text-[#bbb] leading-relaxed bg-[#0d0d0d] p-3.5 rounded border border-[#1a1a1a]">
                {selectedSymbol.meaning}
              </p>
            </div>

            {selectedSymbol.positiveThemes && selectedSymbol.positiveThemes.length > 0 && (
              <div className="p-3 rounded bg-[#0d0d0d] border border-[#1a1a1a] space-y-2">
                <div>
                  <span className="text-emerald-400 font-mono font-bold block mb-1 text-[10px] uppercase">Aydınlık Temalar:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedSymbol.positiveThemes.map((t, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/30 text-emerald-300 border border-emerald-800/30 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedSymbol.shadowThemes && selectedSymbol.shadowThemes.length > 0 && (
                  <div>
                    <span className="text-rose-400 font-mono font-bold block mb-1 text-[10px] uppercase">Gölge / Dönüşüm Temaları:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedSymbol.shadowThemes.map((t, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/30 text-rose-300 border border-rose-800/30 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedSymbol.designCompatibility?.abstractGeometricEquivalent && (
              <div className="p-3 rounded bg-[#0d1216] border border-cyan-900/40">
                <span className="text-cyan-400 font-mono font-bold block mb-1 text-[10px] uppercase">
                  ✦ Çizgisel / Geometrik Soyutlama (Figür İstemeyenler İçin):
                </span>
                <p className="text-[11px] text-[#a0c0d0] leading-relaxed">
                  {selectedSymbol.designCompatibility.abstractGeometricEquivalent}
                </p>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-[#c4a47c] font-mono font-bold block mb-0.5 text-[10px] uppercase">Numerolojik Bağlantı:</span>
                <p className="text-[#aaa] text-[11px]">{selectedSymbol.numerologyConnection}</p>
              </div>

              <div className="p-3 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-cyan-400 font-mono font-bold block mb-0.5 text-[10px] uppercase">Astrolojik Rezonans:</span>
                <p className="text-[#aaa] text-[11px]">{selectedSymbol.astrologyConnection}</p>
              </div>

              <div className="p-3 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-rose-400 font-mono font-bold block mb-0.5 text-[10px] uppercase">Enneagram Arketipi:</span>
                <p className="text-[#aaa] text-[11px]">{selectedSymbol.enneagramConnection}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#666] block">Görsel AI Prompt İpuçları:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSymbol.visualKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#151515] text-[10px] text-[#999] border border-[#222] font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2 border-t border-[#1a1a1a]">
              {onSelectSymbolForDesign && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectSymbolForDesign(selectedSymbol.name);
                    setSelectedSymbol(null);
                  }}
                  className="flex-1 py-2.5 rounded bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Yeni Tasarıma Ekle</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedSymbol(null)}
                className="px-4 py-2.5 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-[#888] text-xs font-mono uppercase cursor-pointer"
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
