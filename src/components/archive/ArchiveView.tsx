import React, { useState } from 'react';
import { TattooRecipe } from '../../types';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  Eye, 
  Printer, 
  Download,
  FileText
} from 'lucide-react';
import { ClientConsultationDossierModal } from '../modals/ClientConsultationDossierModal';

interface ArchiveViewProps {
  recipes: TattooRecipe[];
  onDeleteRecipe: (id: string) => void;
  onStartNewDesign: () => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  recipes,
  onDeleteRecipe,
  onStartNewDesign
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<TattooRecipe | null>(null);
  const [dossierRecipe, setDossierRecipe] = useState<TattooRecipe | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.parameters.selectedStyles.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    r.parameters.mainSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.parameters.bodyPlacement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handlePrintRecipe = () => {
    window.print();
  };

  const handleDownloadRecipeMarkdown = (recipe: TattooRecipe) => {
    const md = `
# DÖVME TASARIM REÇETESİ
**Danışan:** ${recipe.clientName}
**Tarih:** ${new Date(recipe.createdAt).toLocaleDateString('tr-TR')}
**Başlık:** ${recipe.title}

---
## 1. KİŞİ & DOĞUM VERİLERİ
- Doğum Tarihi: ${recipe.personData.birthDate} ${recipe.personData.birthTime || ''}
- Doğum Yeri: ${recipe.personData.birthPlace || 'Belirtilmedi'}
- Özel Notlar: ${recipe.personData.notes || 'Yok'}

---
## 2. EZOTERİK PROFİL
- **Numeroloji:** Yaşam Yolu ${recipe.numerology.lifePathNumber} (${recipe.numerology.lifePathTitle}), Ana Kulvar ${recipe.numerology.destinyNumber}, DM ${recipe.numerology.dmNumber}
- **Astroloji:** Güneş ${recipe.astrology.sunSign}, Ay ${recipe.astrology.moonSign}, Yükselen ${recipe.astrology.ascendantSign}, Element: ${recipe.astrology.dominantElement}
- **Enneagram:** ${recipe.enneagram.typeName} (${recipe.enneagram.wing})

---
## 3. SEMBOL GEREKÇELERİ
${recipe.symbolRationales.map(r => `### ${r.symbolName} (${r.symbolCategory})\n- **Ezoterik Bağ:** ${r.esotericConnection}\n- **Görsel Rol:** ${r.visualRole}`).join('\n\n')}

---
## 4. TEKNİK & ANATOMİK YÖNERGELER
**Kompozisyon:**
${recipe.compositionGuide}

**Yerleşim & Anatomi:**
${recipe.placementAnatomyNotes}

**İğne & Teknik:**
${recipe.needleAndTechniqueGuide}

---
## 5. MASTER AI PROMPT (MIDJOURNEY / FLUX)
\`\`\`
${recipe.masterEnglishPrompt}
\`\`\`

**Negatif Prompt:**
\`\`\`
${recipe.negativePrompt}
\`\`\`
    `.trim();

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tasarim_Recetesi_${recipe.clientName.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 bg-[#080808]/80 backdrop-blur-md p-4 rounded-xl">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold flex items-center gap-2">
            <span>◆</span>
            <span>Tasarım Arşivi & Reçeteler ({recipes.length})</span>
          </h2>
          <p className="text-[11px] text-[#666] font-mono mt-0.5">
            Kaydedilen dövme reçeteleri, sembolik gerekçeler ve AI promptları.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewDesign}
          className="px-4 py-2 rounded bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#c4a47c]/15 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Yeni Reçete Oluştur</span>
        </button>
      </header>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-[#555] absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Reçete adı, kişi, stil veya sembol ara..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-xs text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
        />
      </div>

      {/* Recipes List */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-16 border border-[#1a1a1a] rounded-xl bg-[#0a0a0a] p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-[#444] mx-auto" />
          <p className="text-xs text-[#777] font-mono">Henüz kayıtlı dövme reçetesi bulunmuyor veya arama eşleşmedi.</p>
          <button
            type="button"
            onClick={onStartNewDesign}
            className="px-4 py-2 rounded bg-[#151515] border border-[#333] hover:border-[#c4a47c] text-[#c4a47c] text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            İlk Reçeteyi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border border-[#1a1a1a] hover:border-[#c4a47c]/40 bg-[#0a0a0a] rounded-xl p-5 transition-all space-y-3.5 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#151515] border border-[#222] text-[#c4a47c]">
                        {recipe.clientName}
                      </span>
                      <span className="text-[10px] text-[#666] flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-[#555]" />
                        {new Date(recipe.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white font-serif">{recipe.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Hızlı Prompt Kopyala"
                      onClick={() => handleCopyPrompt(recipe.masterEnglishPrompt, recipe.id)}
                      className="p-1.5 rounded bg-[#111] hover:bg-[#181818] text-[#888] hover:text-[#c4a47c] border border-[#222] text-xs transition-all cursor-pointer"
                    >
                      {copiedPromptId === recipe.id ? <Check className="w-3.5 h-3.5 text-[#c4a47c]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      title="Reçeteyi Sil"
                      onClick={() => {
                        if (confirm(`"${recipe.title}" reçetesini silmek istediğinize emin misiniz?`)) {
                          onDeleteRecipe(recipe.id);
                        }
                      }}
                      className="p-1.5 rounded bg-[#111] hover:bg-rose-950/40 text-[#888] hover:text-rose-400 border border-[#222] text-xs transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Styles and Placement Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#151515] border border-[#222] text-white">
                    {recipe.parameters.bodyPlacement}
                  </span>
                  {recipe.parameters.selectedStyles.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-[#111] text-[#888] border border-[#1a1a1a]">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Quick AI Prompt Preview */}
                <div className="p-2.5 rounded bg-[#0d0d0d] border border-[#1a1a1a] text-[11px] font-mono text-[#888] line-clamp-2 leading-relaxed">
                  {recipe.masterEnglishPrompt}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#1a1a1a] flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setDossierRecipe(recipe)}
                  className="w-full py-2 px-3 rounded bg-gradient-to-r from-amber-600/20 to-[#c4a47c]/20 hover:from-amber-600/30 hover:to-[#c4a47c]/30 border border-[#c4a47c]/50 hover:border-[#c4a47c] text-[#f4e6d4] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Çakra analizleri, gölge yanlar ve ek dosya parçalarını içeren danışan dosyasını aç"
                >
                  <FileText className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>📁 Danışan Görüşme & Şifa Dosyası (Ekler Dahil)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full py-1.5 px-3 rounded bg-[#111] hover:bg-[#181818] border border-[#222] hover:border-[#c4a47c] text-[#aaa] hover:text-[#c4a47c] text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Stüdyo Reçetesini & Promptları İncele</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1a1a1a] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#c4a47c] uppercase tracking-wider">DÖVME REÇETESİ • {selectedRecipe.clientName}</span>
                <h3 className="text-base font-bold text-white font-serif">{selectedRecipe.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadRecipeMarkdown(selectedRecipe)}
                  title="Markdown İndir"
                  className="p-1.5 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-[#888] hover:text-white cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePrintRecipe}
                  title="Yazdır"
                  className="p-1.5 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-[#888] hover:text-white cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-[#666] hover:text-white text-xl font-bold px-2 cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Profile Summary Badge Bar */}
            <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
              <div>
                <span className="text-[#666] block text-[8px] uppercase">Yaşam Yolu:</span>
                <span className="text-[#c4a47c] font-bold">
                  {selectedRecipe.numerology.lifePathNumber} ({selectedRecipe.numerology.lifePathTitle})
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[8px] uppercase">Güneş:</span>
                <span className="text-white">
                  {selectedRecipe.astrology.sunDegreeFormatted || selectedRecipe.astrology.sunSign}
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[8px] uppercase">Ay:</span>
                <span className={selectedRecipe.astrology.isMoonNearCusp ? 'text-amber-300 font-bold' : 'text-white'}>
                  {selectedRecipe.astrology.moonDegreeFormatted || selectedRecipe.astrology.moonSign}
                  {selectedRecipe.astrology.isMoonNearCusp && ' ⚠️'}
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[8px] uppercase">Yükselen:</span>
                <span className="text-white">
                  {selectedRecipe.astrology.ascendantDegreeFormatted || selectedRecipe.astrology.ascendantSign}
                </span>
              </div>
            </div>

            {/* Moon Cusp Warning if present */}
            {selectedRecipe.astrology.isMoonNearCusp && (
              <div className="p-2.5 rounded bg-amber-950/25 border border-amber-500/30 text-amber-200 text-[11px] font-mono">
                ⚠️ {selectedRecipe.astrology.moonCuspMessage || 'Ay burç değişim eşiğinde (29° İkizler).'}
              </div>
            )}

            {/* Generated Sketch if present */}
            {selectedRecipe.generatedSketchUrl && (
              <div className="p-3 rounded-xl bg-[#050505] border border-[#1a1a1a] text-center">
                <span className="text-[10px] font-mono text-[#666] block mb-2 uppercase">Oluşturulan Tasarım Eskizi</span>
                <img
                  src={selectedRecipe.generatedSketchUrl}
                  alt="Tattoo Stencil"
                  referrerPolicy="no-referrer"
                  className="max-h-64 mx-auto rounded border border-[#222] object-contain bg-black"
                />
              </div>
            )}

            {/* Feasibility / Dövme Uygulanabilirliği if present */}
            {selectedRecipe.feasibility && (
              <div className="p-3.5 rounded bg-[#0d0d0d] border border-[#1f1f1f] space-y-2">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-1">
                  <span className="text-[10px] font-mono text-[#c4a47c] uppercase font-bold">
                    Dövme Uygulanabilirlik Kriterleri
                  </span>
                  <span className="text-[10px] font-mono text-[#c4a47c]">
                    Skor: {selectedRecipe.feasibility.overallFeasibilityScore}/100
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a]">
                    <span className="text-[#666] block text-[8px] uppercase">Çizgi:</span>
                    <span className="text-white">{selectedRecipe.feasibility.lineWeight}</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a]">
                    <span className="text-[#666] block text-[8px] uppercase">Negatif Alan:</span>
                    <span className="text-emerald-400">{selectedRecipe.feasibility.negativeSpaceRatio}</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a]">
                    <span className="text-[#666] block text-[8px] uppercase">Yaşlanma / Blowout:</span>
                    <span className="text-amber-300">{selectedRecipe.feasibility.agingBlowoutRisk}</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a]">
                    <span className="text-[#666] block text-[8px] uppercase">Min Boyut:</span>
                    <span className="text-[#c4a47c]">{selectedRecipe.feasibility.recommendedSize}</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a] col-span-2">
                    <span className="text-[#666] block text-[8px] uppercase">Anatomik Akış:</span>
                    <span className="text-[#bbb]">{selectedRecipe.feasibility.anatomicalFlow}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Symbol Rationales */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#c4a47c] uppercase tracking-wider font-mono block">
                ◆ Sembol Gerekçeleri & Ezoterik Çözümleme
              </span>
              <div className="space-y-2">
                {selectedRecipe.symbolRationales.map((rat, i) => (
                  <div key={i} className="p-3.5 rounded bg-[#0d0d0d] border border-[#1a1a1a] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{rat.symbolName}</strong>
                      <span className="text-[10px] text-[#666] font-mono">{rat.symbolCategory}</span>
                    </div>
                    <p className="text-[#aaa] leading-relaxed text-[11px]">{rat.esotericConnection}</p>
                    <p className="text-[10px] text-[#666] italic font-mono">Görsel Rol: {rat.visualRole}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement & Needle Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded bg-[#0d0d0d] border border-[#1a1a1a] space-y-1">
                <strong className="text-[#c4a47c] font-mono uppercase text-[10px] block">Kompozisyon & Anatomi:</strong>
                <p className="text-[11px] text-[#aaa] whitespace-pre-line leading-relaxed">
                  {selectedRecipe.compositionGuide}
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#0d0d0d] border border-[#1a1a1a] space-y-1">
                <strong className="text-[#c4a47c] font-mono uppercase text-[10px] block">İğne & Teknik Rehberi:</strong>
                <p className="text-[11px] text-[#aaa] whitespace-pre-line leading-relaxed">
                  {selectedRecipe.needleAndTechniqueGuide}
                </p>
              </div>
            </div>

            {/* Master AI Prompt */}
            <div className="p-4 rounded-xl bg-[#080808] border border-[#222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#c4a47c] font-mono uppercase">Master AI Prompt (Midjourney / Flux)</span>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(selectedRecipe.masterEnglishPrompt, selectedRecipe.id)}
                  className="px-2.5 py-1 rounded bg-[#151515] border border-[#333] hover:border-[#c4a47c] text-[#c4a47c] text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedPromptId === selectedRecipe.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPromptId === selectedRecipe.id ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
              <div className="p-3 rounded bg-[#050505] border border-[#1a1a1a] text-xs font-mono text-[#999] leading-relaxed select-all">
                {selectedRecipe.masterEnglishPrompt}
              </div>
              <div className="text-[10px] text-[#555] font-mono">
                Negatif: {selectedRecipe.negativePrompt}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setDossierRecipe(selectedRecipe);
                }}
                className="flex-1 py-2.5 rounded bg-gradient-to-r from-amber-600/30 to-[#c4a47c]/30 hover:from-amber-600/40 hover:to-[#c4a47c]/40 border border-[#c4a47c]/70 text-[#f5e6cc] font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#c4a47c]/10"
              >
                <FileText className="w-4 h-4 text-[#c4a47c]" />
                <span>Danışan Dosyasını Aç (Ekler Dahil)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="py-2.5 px-6 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-[#e0e0e0] text-xs uppercase font-mono tracking-wider cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danışan Görüşme & Şifa Dosyası Modal */}
      {dossierRecipe && (
        <ClientConsultationDossierModal
          isOpen={Boolean(dossierRecipe)}
          onClose={() => setDossierRecipe(null)}
          recipe={dossierRecipe}
        />
      )}
    </div>
  );
};
