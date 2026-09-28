import React, { useState } from 'react';
import { 
  SymbolicIntegrationModelResult, 
  SymbolRegistryItem,
  SymbolPriority,
  SymbolSourceType
} from '../../types';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Check, 
  Copy, 
  Download, 
  ShieldCheck, 
  Info, 
  Compass, 
  Flame, 
  Activity, 
  ChevronRight,
  Maximize2,
  RefreshCw,
  FileCode
} from 'lucide-react';
import { downloadAsSvg } from '../../utils/imageExport';

interface SymbolIntegrationViewerProps {
  integration: SymbolicIntegrationModelResult;
  onDownloadJson?: () => void;
}

export const SymbolIntegrationViewer: React.FC<SymbolIntegrationViewerProps> = ({
  integration,
  onDownloadJson
}) => {
  const [viewMode, setViewMode] = useState<'final' | 'deconstruction'>('final');
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'layers' | 'traceability' | 'validation' | 'prompt'>('layers');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const selectedSymbol = integration.symbols.find(s => s.symbolId === selectedSymbolId);
  const selectedMapItem = integration.symbolMap.find(m => m.symbolId === selectedSymbolId);
  const selectedTrace = integration.traceability.find(t => t.symbolId === selectedSymbolId);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(integration.masterIntegratedAiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleDownloadCurrentSvg = () => {
    const svgToDownload = viewMode === 'final' 
      ? integration.svgUnifiedVectorPreview 
      : integration.svgDeconstructedVectorPreview;
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgToDownload)}`;
    const filename = `${integration.user.name.replace(/\s+/g, '_')}_${viewMode === 'final' ? 'Butunsel_Dovme' : 'Sembol_Haritasi'}`;
    downloadAsSvg(dataUrl, filename);
  };

  // Helper for Priority Badges
  const getPriorityBadge = (priority: SymbolPriority) => {
    switch (priority) {
      case 'PRIMARY':
        return <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/40 font-bold">1. BİRİNCİL ARMATÜR</span>;
      case 'SECONDARY':
        return <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/40 font-bold">2. İKİNCİL ENTEGRE</span>;
      case 'ACCENT':
        return <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold">3. VURGU MOTİFİ</span>;
      case 'SUBTLE_FILL':
        return <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-teal-950/60 text-teal-300 border border-teal-500/40 font-bold">4. MİKRO DOKU</span>;
      case 'HIDDEN':
        return <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold">5. GİZLİ / NEGATİF ALAN</span>;
    }
  };

  // Helper for Source Type Badges
  const getSourceBadge = (source: SymbolSourceType) => {
    switch (source) {
      case 'CALCULATED':
        return <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">Hesaplanan Sonuç</span>;
      case 'TRADITIONAL':
        return <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-500/30">Kadim / Geleneksel</span>;
      case 'TOTEM_DERIVED':
        return <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-500/30">Totemden Türetilmiş</span>;
      case 'VISUAL_ABSTRACTION':
        return <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">Görsel Soyutlama</span>;
      case 'MODEL_GENERATED':
        return <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-600">Model Bağlayıcı</span>;
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0d] border border-[#232330] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#c4a47c]/20 to-[#8a7250]/10 border border-[#c4a47c]/40 text-[#c4a47c]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-white text-sm sm:text-base font-bold font-serif tracking-wide">
                Sembol Entegrasyon Modeli & Logo Ayrıştırma Haritası
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16140e] border border-[#c4a47c]/40 text-[#c4a47c] font-bold">
                Anti-Sticker • Interlocking Monogram
              </span>
            </div>
            <p className="text-[11px] text-[#888] font-mono mt-0.5">
              Semboller ayrı etiketler gibi değil; ortak çizgiler, hekzagram yayları ve negatif alanla tek bir özgün armaya dönüştürüldü.
            </p>
          </div>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="p-1 rounded-xl bg-[#141418] border border-[#2a2a38] flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setViewMode('final');
                setSelectedSymbolId(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'final'
                  ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nihai Bütünsel Dövme</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('deconstruction')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'deconstruction'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sembol Haritası (Renkli)</span>
            </button>
          </div>

          {onDownloadJson && (
            <button
              type="button"
              onClick={onDownloadJson}
              className="py-2 px-3 rounded-xl bg-[#16161b] hover:bg-[#202026] border border-[#333342] hover:border-[#c4a47c] text-xs font-mono text-zinc-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Tüm hesaplama ve entegrasyon sonuçlarını standart JSON olarak indir"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON İndir</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadCurrentSvg}
            className="py-2 px-3 rounded-xl bg-[#16161b] hover:bg-[#202026] border border-[#333342] hover:border-[#c4a47c] text-xs font-mono text-zinc-300 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Şu anki vektör çizimini SVG olarak indir"
          >
            <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>SVG İndir</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas on Left, Details & Layers on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Vector Interactive Stage (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a0a0c] border border-[#1e1e28] rounded-2xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full inline-block bg-emerald-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                {viewMode === 'final' ? 'Final Design (Tekil Siyah Mürekkep)' : 'Symbol Deconstruction (Renkli Katmanlar)'}
              </span>
            </div>
            {viewMode === 'deconstruction' && (
              <button
                type="button"
                onClick={() => setSelectedSymbolId(null)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedSymbolId === null 
                    ? 'bg-purple-950 text-purple-300 border border-purple-500/50' 
                    : 'bg-[#181820] text-zinc-400 hover:text-white'
                }`}
              >
                Tüm Katmanları Göster
              </button>
            )}
          </div>

          {/* SVG Frame Container */}
          <div className="relative w-full aspect-[2/3] max-h-[580px] bg-white rounded-xl border border-zinc-300 overflow-hidden flex items-center justify-center p-3 shadow-inner">
            <div 
              className="w-full h-full flex items-center justify-center transition-all duration-300"
              dangerouslySetInnerHTML={{ 
                __html: viewMode === 'final' 
                  ? integration.svgUnifiedVectorPreview 
                  : integration.svgDeconstructedVectorPreview 
              }}
            />

            {/* Floating Quick Hint */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300 font-mono flex items-center justify-between">
              <span>{viewMode === 'final' ? '✦ %100 Termal Stencil & Dövme Uyumlu' : '✦ Her renk farklı bir analitik katmanı temsil eder'}</span>
              <span className="text-[#c4a47c] font-bold">{integration.symbols.length} Entegre Sembol</span>
            </div>
          </div>

          {/* Active Highlight Info Card (If a symbol is clicked/focused) */}
          {selectedSymbol && selectedMapItem && (
            <div 
              className="p-3.5 rounded-xl border space-y-1.5 animate-fadeIn"
              style={{ 
                backgroundColor: `${selectedMapItem.highlightColor}15`,
                borderColor: `${selectedMapItem.highlightColor}60` 
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-serif text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: selectedMapItem.highlightColor }} />
                  {selectedSymbol.symbolName}
                </span>
                {getPriorityBadge(selectedSymbol.priority)}
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                <strong>Konum:</strong> {selectedMapItem.region} • <strong>Kaynak:</strong> {selectedSymbol.sourceAnalysis}
              </p>
              <p className="text-[10px] text-zinc-400 font-mono italic">
                "{selectedSymbol.visualMeaning}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Layer Explorer, Traceability, Validator (7 cols) */}
        <div className="lg:col-span-7 bg-[#0a0a0c] border border-[#1e1e28] rounded-2xl p-5 flex flex-col space-y-4">
          {/* Sub-Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#121216] border border-[#232330] text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('layers')}
              className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'layers'
                  ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semboller ({integration.symbols.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('traceability')}
              className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'traceability'
                  ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>İzlenebilirlik (Trace)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('validation')}
              className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'validation'
                  ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Doğrulama (Audit)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'prompt'
                  ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bütünsel AI Prompt</span>
            </button>
          </div>

          {/* TAB 1: SYMBOL LAYERS & INTERLOCKING BREAKDOWN */}
          {activeTab === 'layers' && (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[520px] pr-1 custom-scrollbar">
              <div className="p-3 rounded-xl bg-[#111116] border border-[#22222d] text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#c4a47c] font-bold block">
                  ✦ Interlocking Logo Mimarisi ve Ortak Çizgiler:
                </span>
                <p className="text-[11px] text-[#aaa] leading-relaxed">
                  Semboller bağımsız çizilmez; bir sembolün çizgisi başka sembolün kenarını oluşturur.
                  Aşağıdaki listeden bir sembole tıklayarak onun dövmedeki konumunu ve birleştiği çizgileri inceleyebilirsiniz.
                </p>
              </div>

              {/* Symbol Cards List */}
              <div className="space-y-2.5">
                {integration.symbols.map(s => {
                  const loc = integration.symbolMap.find(m => m.symbolId === s.symbolId);
                  const isSelected = selectedSymbolId === s.symbolId;
                  const color = loc?.highlightColor || '#ffffff';

                  return (
                    <div
                      key={s.symbolId}
                      onClick={() => {
                        setSelectedSymbolId(s.symbolId);
                        setViewMode('deconstruction');
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#181824] ring-2 shadow-lg' 
                          : 'bg-[#0f0f13] hover:bg-[#14141a] border-[#22222d]'
                      }`}
                      style={{
                        borderColor: isSelected ? color : undefined,
                        boxShadow: isSelected ? `0 0 16px ${color}30` : undefined
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full inline-block shrink-0 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <h4 className="text-xs sm:text-sm font-bold text-white font-serif">
                              {s.symbolName}
                            </h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {getPriorityBadge(s.priority)}
                            {getSourceBadge(s.sourceType)}
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                              {s.symbolCategory}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-zinc-400 font-bold shrink-0">
                          {loc?.region.split(' ')[0]} ↗
                        </span>
                      </div>

                      <p className="text-[11px] text-[#bbb] leading-relaxed pt-2 mt-2 border-t border-white/5">
                        <strong className="text-white">Dövmedeki Karşılığı:</strong> {s.visualMeaning}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-zinc-400 pt-1.5">
                        <span><strong>Dayanak / Kök:</strong> {s.basisOrOrigin || s.sourceAnalysis}</span>
                        <span className="text-emerald-400 font-bold">Güven Skoru: %{s.confidence}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TRACEABILITY (WHY, HOW, WHERE) */}
          {activeTab === 'traceability' && (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[520px] pr-1 custom-scrollbar">
              <div className="p-3 rounded-xl bg-[#111116] border border-[#22222d] text-xs">
                <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block mb-1">
                  ✦ Şeffaf Geriye Doğru İzlenebilirlik (Traceability Matrix):
                </span>
                <p className="text-[11px] text-[#aaa] leading-relaxed">
                  Final dövmedeki her çizgi için: <strong>"Nereden geldi?"</strong>, <strong>"Neden seçildi?"</strong> ve <strong>"Dövmede nereye saklandı?"</strong> sorularının tam cevabı.
                </p>
              </div>

              <div className="space-y-3">
                {integration.traceability.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0f0f13] border border-[#22222d] space-y-2">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-white font-serif flex items-center gap-1.5">
                        <span className="text-[#c4a47c]">◆</span> {t.tattooElement}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {t.sourceAnalysis} ({t.sourceValue})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-amber-300 font-bold uppercase block">1. NEDEN SEÇİLDİ? (WHY)</span>
                        <p className="text-zinc-300 leading-relaxed">{t.whySelected}</p>
                      </div>

                      <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase block">2. NASIL DÖNÜŞTÜ? (HOW)</span>
                        <p className="text-zinc-300 leading-relaxed">{t.howTransformed}</p>
                      </div>

                      <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase block">3. NEREDE YER ALIYOR? (WHERE)</span>
                        <p className="text-zinc-300 leading-relaxed">{t.wherePlaced}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VALIDATION & FEASIBILITY AUDIT */}
          {activeTab === 'validation' && (
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[520px] pr-1 custom-scrollbar">
              <div className="p-4 rounded-xl bg-[#0d140e] border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white font-mono uppercase">
                      Symbol Integration Validator Sonucu: GEÇERLİ (VALID)
                    </h4>
                    <span className="text-[11px] text-emerald-300 font-mono">
                      Denetim Skoru: {integration.validation.score}/100 • {integration.validation.integratedSymbolsCount} Sembol Kenetlendi
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded bg-emerald-500 text-black font-mono font-bold text-xs">
                  ONAYLI
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                  Otomatik Uygunluk ve Zanaat Kriterleri:
                </span>
                {integration.validation.checks.map((chk, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#111116] border border-[#22222d] flex items-start gap-2.5">
                    <div className="p-1 rounded bg-emerald-950 text-emerald-400 mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white font-mono block">{chk.name}</span>
                      <p className="text-[11px] text-[#aaa] leading-relaxed">{chk.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Linework Specs */}
              <div className="p-4 rounded-xl bg-[#0e0e12] border border-[#1e1e28] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#c4a47c] font-bold block">
                  Dövme Zanaat Parametreleri (Feasibility):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-black/50 border border-white/5">
                    <span className="text-[9px] text-[#666] block uppercase">İğne Kalınlığı</span>
                    <span className="text-white font-bold">{integration.designGeometry.lineWeight.split(',')[0]}</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-white/5">
                    <span className="text-[9px] text-[#666] block uppercase">Negatif Alan</span>
                    <span className="text-emerald-400 font-bold">{integration.designGeometry.negativeSpaceRatio.split(' ')[0]}</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-white/5">
                    <span className="text-[9px] text-[#666] block uppercase">Kompozisyon</span>
                    <span className="text-[#c4a47c] font-bold">{integration.designGeometry.compositionType}</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-white/5">
                    <span className="text-[9px] text-[#666] block uppercase">Simetri</span>
                    <span className="text-cyan-300 font-bold">{integration.designGeometry.symmetry.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UNIFIED MASTER AI PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
                    Bütünsel Interlocking AI Dövme Promptu
                  </h4>
                  <span className="text-[10px] text-[#888] font-mono">
                    Midjourney v6.1 / Flux / Gemini (Çıkartma/İkon oluşturmayı yasaklayan formülasyon)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="px-3 py-1.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#c4a47c]/20"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'KOPYALANDI' : 'Promptu Kopyala'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={integration.masterIntegratedAiPrompt}
                rows={11}
                className="w-full flex-1 p-4 rounded-xl bg-[#0d0d11] border border-[#232332] text-xs font-mono text-[#eee] leading-relaxed resize-none outline-none select-all custom-scrollbar"
              />

              <div className="p-3 rounded-lg bg-[#141209] border border-[#c4a47c]/20 text-[10px] text-[#d4c5b3] font-mono flex items-center justify-between">
                <span>✦ <strong>Kural:</strong> "DO NOT create floating stickers. Single monolithic interlocking composition."</span>
                <span className="text-emerald-400 font-bold">✓ Prompt Suite Uyumlu</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
