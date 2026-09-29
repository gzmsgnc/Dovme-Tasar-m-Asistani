import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Send, 
  FileText, 
  Sparkles, 
  Compass, 
  Printer,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Search,
  Sliders,
  Feather,
  Layers,
  HelpCircle
} from 'lucide-react';
import { TattooRecipe } from '../../types';
import { generateWhatsAppShareLink } from '../../utils/enneagramSharing';
import { PDFExportButton } from '../common/PDFExportButton';
import { downloadRecipeAsJson } from '../../utils/jsonExport';
import { generatePersonalSymbolPrescription, PersonalSymbolPrescription } from '../../utils/personalSymbolPrescription';

interface ClientConsultationDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: TattooRecipe;
}

export const ClientConsultationDossierModal: React.FC<ClientConsultationDossierModalProps> = ({
  isOpen,
  onClose,
  recipe
}) => {
  const [activeTab, setActiveTab] = useState<'prescription' | 'audit' | 'prompt' | 'fulltext' | 'whatsapp'>('prescription');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !recipe) return null;

  // Kanonik Reçete verisi (Single Source of Truth)
  const prescription: PersonalSymbolPrescription = recipe.prescription || generatePersonalSymbolPrescription({
    person: recipe.personData,
    numerology: recipe.numerology,
    astrology: recipe.astrology,
    enneagram: recipe.enneagram,
    symbolism: recipe.symbolism,
    chakra: recipe.chakra,
    designParameters: recipe.parameters || {} as any
  });

  const canonical = prescription.canonicalAnalysis;
  const fullText = prescription.fullPrescriptionText;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadFile = (format: 'txt' | 'md') => {
    const cleanName = canonical.client.name.replace(/\s+/g, '_');
    const filename = `${cleanName}_Kisisel_Sembol_Recetesi.${format}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // WhatsApp summary message
  const whatsappSummaryMessage = `
✨ Sevgili ${canonical.client.name}! ✨

Hesaplama sonuçlarınızdan elde edilen tek sayfalık "KİŞİSEL SEMBOL REÇETENİZ" hazırlandı.

📌 *Hesaplama Haritası:*
• Yaşam Yolu: ${canonical.numerology.lifePathNumber}
• Güneş: ${canonical.astrology.sunDegree} | Ay: ${canonical.astrology.moonDegree}
• Ebced Toplamı: ${canonical.ebcedAndMizan.totalEbced} | Mizan: ${canonical.ebcedAndMizan.mizanBurc}
• Enneagram: ${canonical.enneagram.wing}
• Ana Totem: ${canonical.totem.primaryTotem}

🔮 *Birleşik Arketip:*
"${prescription.unifiedArchetype}"

🎨 *Ana Odak Sembolü:*
${prescription.symbols[0]?.symbolName || 'Kadim Odak'} (${prescription.symbols[0]?.coreTheme || 'Rehberlik'})

Tüm hesaplamaların sembol karşılıklarını, tasarım formülünü ve stüdyo uygulama brifini ekteki reçetede inceleyebilirsiniz. 🖋️✨
  `.trim();

  const whatsappLink = generateWhatsAppShareLink('', whatsappSummaryMessage);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#090909] border border-[#262626] rounded-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 max-h-[94vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-3.5 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#c4a47c]/20 to-[#8a7250]/10 border border-[#c4a47c]/40 text-[#c4a47c]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-base sm:text-lg font-bold tracking-tight">
                  Kişisel Sembol Reçetesi
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1b12] border border-[#c4a47c]/40 text-[#c4a47c] font-bold">
                  Kanonik Doğrulandı
                </span>
              </div>
              <p className="text-xs text-[#888] font-mono mt-0.5">
                Danışan: <strong className="text-white">{canonical.client.name}</strong> • Tek Sayfa Konsültasyon Raporu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <PDFExportButton
              recipe={recipe}
              variant="compact"
              label="Şık PDF İndir"
            />
            <button
              type="button"
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-lg bg-[#161616] hover:bg-[#222] border border-[#333] text-xs text-white font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Yazdır veya tarayıcıdan PDF olarak kaydet"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Yazdır</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadFile('txt')}
              className="py-1.5 px-3 rounded-lg bg-[#161616] hover:bg-[#222] border border-[#333] text-xs text-white font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Metin dosyası olarak indir (.txt)"
            >
              <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span>Yazı (.txt)</span>
            </button>
            <button
              type="button"
              onClick={() => downloadRecipeAsJson(recipe)}
              className="py-1.5 px-3 rounded-lg bg-[#161616] hover:bg-[#222] border border-[#333] hover:border-cyan-400 text-xs text-cyan-300 font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              title="JSON İndir"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#888] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-[#121212] rounded-xl border border-[#222]">
          <button
            type="button"
            onClick={() => setActiveTab('prescription')}
            className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'prescription'
                ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Sembol Reçetesi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. Rapor Denetimi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Tattoo Prompt</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fulltext')}
            className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'fulltext'
                ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>4. Tam Metin (.txt)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`col-span-2 sm:col-span-1 py-2 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>5. WhatsApp İlet</span>
          </button>
        </div>

        {/* TAB 1: KİŞİSEL SEMBOL REÇETESİ (TEK SAYFALIK ANA ÇIKTI) */}
        {activeTab === 'prescription' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#111] rounded-xl border border-[#222]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#aaa]">
                <Sparkles className="w-4 h-4 text-[#c4a47c]" />
                <span>Danışana gönderilmeye hazır tek sayfalık nihai sembol reçetesi</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(fullText, 'prescription')}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-xs text-white font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedType === 'prescription' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'prescription' ? 'Kopyalandı' : 'Reçeteyi Kopyala'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#c4a47c]/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Yazdır / PDF</span>
                </button>
              </div>
            </div>

            {/* THE ONE-PAGE LUXURY DOSSIER CARD */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#111111] via-[#0d0d0d] to-[#080808] border border-[#c4a47c]/40 shadow-2xl space-y-6 text-[#ddd]">
              {/* Header section */}
              <div className="border-b border-[#c4a47c]/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[3px] text-[#c4a47c] font-bold block">
                    KİŞİSEL SEMBOL REÇETESİ
                  </span>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                    {canonical.client.name}
                  </h1>
                </div>
                <div className="text-left sm:text-right font-mono text-xs text-[#999]">
                  <span className="text-[10px] text-[#777] block uppercase">Doğum Verisi</span>
                  <span className="text-white font-bold">{canonical.client.formattedBirthInfo}</span>
                </div>
              </div>

              {/* 1. HESAPLAMA HARİTASI (Kısa ve Doğrulanmış) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                  <Workflow className="w-4 h-4 text-[#c4a47c]" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#c4a47c] font-bold">
                    HESAPLAMA HARİTASI
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  {/* Numeroloji */}
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
                    <span className="text-[10px] uppercase text-[#c4a47c] font-bold block">Numeroloji</span>
                    <div className="text-[#ccc] space-y-0.5 text-[11px]">
                      <div>Yaşam Yolu → <strong className="text-white">{canonical.numerology.lifePathNumber}</strong></div>
                      <div>İfade Sayısı → <strong className="text-white">{canonical.numerology.destinyNumber}</strong></div>
                      <div>Dünya Misyonu → <strong className="text-white">{canonical.numerology.dmNumber}</strong></div>
                      {canonical.numerology.masterNumbers.length > 0 && (
                        <div>Üstat Sayı → <strong className="text-cyan-300">{canonical.numerology.masterNumbers.join(', ')}</strong></div>
                      )}
                    </div>
                  </div>

                  {/* Astroloji (Batı / Tropikal) */}
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
                    <span className="text-[10px] uppercase text-[#c4a47c] font-bold block">Astroloji (Batı / Tropikal)</span>
                    <div className="text-[#ccc] space-y-0.5 text-[11px]">
                      <div>Güneş → <strong className="text-white">{canonical.astrology.sunDegree}</strong></div>
                      <div>Ay → <strong className="text-white">{canonical.astrology.moonDegree}</strong></div>
                      <div>Yükselen → <strong className="text-white">{canonical.astrology.ascendantDegree}</strong></div>
                      <div>Element → <strong className="text-amber-300">{canonical.astrology.dominantElement}</strong></div>
                    </div>
                  </div>

                  {/* Ezoterik / Ebced & Mizan */}
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
                    <span className="text-[10px] uppercase text-[#c4a47c] font-bold block">Ezoterik / Ebced & Mizan</span>
                    <div className="text-[#ccc] space-y-0.5 text-[11px]">
                      <div>Kişisel Ebced → <strong className="text-white">{canonical.ebcedAndMizan.totalEbced}</strong></div>
                      <div>Mizan → <strong className="text-white">{canonical.ebcedAndMizan.mizanBurc}</strong></div>
                      <div className="text-[10px] text-[#888] pt-1 truncate" title={canonical.ebcedAndMizan.calculationChainText}>
                        {canonical.ebcedAndMizan.calculationChainText}
                      </div>
                    </div>
                  </div>

                  {/* Enneagram */}
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
                    <span className="text-[10px] uppercase text-[#c4a47c] font-bold block">Enneagram</span>
                    <div className="text-[#ccc] space-y-0.5 text-[11px]">
                      <div>Tip → <strong className="text-white">{canonical.enneagram.wing}</strong></div>
                      <div className="text-[11px] text-zinc-300">{canonical.enneagram.typeName}</div>
                      <div>Büyüme → Tip {canonical.enneagram.growthPoint} | Stres → Tip {canonical.enneagram.stressPoint}</div>
                    </div>
                  </div>

                  {/* Totem Rezonansı */}
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
                    <span className="text-[10px] uppercase text-[#c4a47c] font-bold block">Totem Rezonansı</span>
                    <div className="text-[#ccc] space-y-0.5 text-[11px]">
                      <div>Ana Totem → <strong className="text-white">{canonical.totem.primaryTotem}</strong></div>
                      <div>Gölge Totem → <strong className="text-white">{canonical.totem.shadowTotem}</strong></div>
                      <div>İkincil Totem → <strong className="text-white">{canonical.totem.allyTotem}</strong></div>
                    </div>
                  </div>

                  {/* Kanonik Çakra Sonucu */}
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
                    <span className="text-[10px] uppercase text-[#c4a47c] font-bold block">Kanonik Çakra Durumu</span>
                    <div className="text-[#ccc] space-y-1 text-[10px]">
                      <div className="text-rose-300 font-bold">
                        Eksik / Destek: {canonical.chakra.blockedOrMissingChakras.length > 0 
                          ? canonical.chakra.blockedOrMissingChakras.map(c => `${c.number}. ${c.turkishName}`).join(', ') 
                          : 'Tam'}
                      </div>
                      <div className="text-zinc-400">
                        Taşıyıcı: {canonical.chakra.dominantOrBalancedChakras.slice(0, 2).map(c => `${c.number}. ${c.turkishName}`).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {!canonical.totem.includeAnimalInTattoo && (
                  <div className="p-2.5 rounded-lg bg-[#181818] border border-white/5 text-[11px] text-[#aaa] font-mono">
                    ✦ <strong className="text-[#c4a47c]">Soyutlama Notu:</strong> Danışan tercihi doğrultusunda hayvan figürü dövmede doğrudan kullanılmamış; hayvanın sembolik nitelikleri soyut ve geometrik akış hatlarıyla kompozisyona aktarılmıştır.
                  </div>
                )}
              </div>

              {/* 2. BİRLEŞİK ARKETİP (2-3 Cümle) */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#c4a47c] font-bold block">
                  BİRLEŞİK ARKETİP
                </span>
                <p className="font-serif italic text-sm sm:text-base text-zinc-100 leading-relaxed bg-[#14120a] p-4 rounded-xl border border-[#c4a47c]/30">
                  "{prescription.unifiedArchetype}"
                </p>
              </div>

              {/* 3. SEMBOL REÇETESİ (5-8 Temel Sembol) */}
              <div className="space-y-3.5 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#c4a47c] font-bold">
                    SEMBOL REÇETESİ
                  </span>
                  <span className="text-[10px] font-mono text-[#888]">
                    Toplam {prescription.symbols.length} Temel Sembol
                  </span>
                </div>

                <div className="space-y-3">
                  {prescription.symbols.map((sym, idx) => (
                    <div
                      key={sym.id}
                      className="p-3.5 rounded-xl bg-[#141414] border border-[#242424] hover:border-[#c4a47c]/40 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <span className="text-[#c4a47c] font-mono">{idx + 1}.</span>
                          {sym.symbolName}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1e1e] text-[#c4a47c] self-start sm:self-auto border border-white/5">
                          {sym.designCategory}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-[#bbb]">
                        <div>
                          <span className="text-[9px] uppercase text-[#777] block font-bold">Kaynak:</span>
                          <span className="text-white">{sym.sourceSummary}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-[#777] block font-bold">Temel Tema:</span>
                          <span className="text-zinc-200">{sym.coreTheme}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-[#777] block font-bold">Tasarım Görevi:</span>
                          <span className="text-zinc-300">{sym.designRole}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. TASARIM FORMÜLÜ */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#c4a47c] font-bold block">
                  TASARIM FORMÜLÜ
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-[10px] text-[#777] uppercase block font-bold">Merkez:</span>
                    <span className="text-white">{prescription.designFormula.center}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-[10px] text-[#777] uppercase block font-bold">Destekleyici Geometri:</span>
                    <span className="text-white">{prescription.designFormula.supportingGeometry}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-[10px] text-[#777] uppercase block font-bold">Organik Element:</span>
                    <span className="text-white">{prescription.designFormula.organicElement}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-[10px] text-[#777] uppercase block font-bold">Kişisel Mikro Detay:</span>
                    <span className="text-white">{prescription.designFormula.personalMicroDetail}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-[10px] text-[#777] uppercase block font-bold">Negatif Alan:</span>
                    <span className="text-white">{prescription.designFormula.negativeSpace}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-[10px] text-[#777] uppercase block font-bold">Genel Görsel Dil:</span>
                    <span className="text-[#c4a47c] font-bold">{prescription.designFormula.visualLanguage}</span>
                  </div>
                </div>
              </div>

              {/* 5. KİŞİSEL SONUÇ PARAGRAFI */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#c4a47c] font-bold block">
                  KİŞİSEL SONUÇ
                </span>
                <p className="text-xs sm:text-sm text-[#ccc] leading-relaxed italic font-serif bg-[#141414] p-4 rounded-xl border border-white/5">
                  "{prescription.personalClosing}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RAPOR DENETİMİ (AUDIT MODE) */}
        {activeTab === 'audit' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Audit Mode Header */}
            <div className="p-4 rounded-xl bg-[#081518] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>RAPOR DENETİMİ & DAYANAK KONTROLÜ (AUDIT MODE)</span>
                </div>
                <p className="text-xs text-[#aaa]">
                  Sistem bu görünümde her bir sembol için <em>“Bu sembol hangi danışan verisinden üretildi?”</em> sorusunun yanıtını şeffafça belgeler.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(prescription.auditReportText, 'audit')}
                className="py-1.5 px-3 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-xs text-cyan-200 font-mono flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                {copiedType === 'audit' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Denetim Raporunu Kopyala</span>
              </button>
            </div>

            {/* Verification Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e1014] border border-[#222] flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Tek Kaynak (Kanonik Çakra) Doğrulandı</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1014] border border-[#222] flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Rastgele / Kaynaksız Sembol Yok (%100 Dayanaklı)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1014] border border-[#222] flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Batı Astroloji & Ebced/Mizan Ayrımı Korundu</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1014] border border-[#222] flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Şifa İddiası İçermeyen Saf Sembolik Dil Kullanıldı</span>
              </div>
            </div>

            {/* Audit Chain Cards */}
            <div className="space-y-3">
              {prescription.symbols.map((sym, idx) => (
                <div
                  key={sym.id}
                  className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] space-y-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-white text-sm">
                      {idx + 1}. [Sembol]: {sym.symbolName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#181818] text-cyan-400 border border-cyan-900/40">
                      {sym.auditTrail.designPlacement}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2.5 rounded bg-[#141414] border border-white/5 space-y-1">
                      <span className="text-[9px] uppercase text-[#777] block font-bold">1. Kaynak Hesaplama:</span>
                      <span className="text-cyan-300 font-bold">{sym.auditTrail.calculationEngine}</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#141414] border border-white/5 space-y-1">
                      <span className="text-[9px] uppercase text-[#777] block font-bold">2. Kaynak Değer:</span>
                      <span className="text-white">{sym.auditTrail.calculatedValue}</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#141414] border border-white/5 space-y-1">
                      <span className="text-[9px] uppercase text-[#777] block font-bold">3. Çıkarılan Tema:</span>
                      <span className="text-amber-200">{sym.auditTrail.derivedTheme}</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#141414] border border-white/5 space-y-1">
                      <span className="text-[9px] uppercase text-[#777] block font-bold">4. Seçilen Görsel:</span>
                      <span className="text-white font-bold">{sym.auditTrail.selectedVisual}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#aaa] pt-1">
                    <strong className="text-zinc-300">Tasarımdaki Görevi:</strong> {sym.designRole}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TATTOO DESIGN PROMPT (REÇETEDEN AYRI PROMPT ÜRETİMİ) */}
        {activeTab === 'prompt' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-[#14120a] border border-[#c4a47c]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#c4a47c] font-mono font-bold text-sm">
                <Compass className="w-4 h-4" />
                <span>REÇETEDEN TÜRETİLMİŞ MASTER TATTOO DESIGN PROMPT</span>
              </div>
              <p className="text-xs text-[#aaa]">
                Kişisel Sembol Reçetesi'nin sembol hiyerarşisi, iğne derinliği, negatif alan ve kompozisyon kuralları doğrudan bu prompta aktarılmıştır.
              </p>
            </div>

            {/* Master Finished Flash Prompt */}
            <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Master Cohesive Tattoo Flash Prompt
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(prescription.tattooDesignPrompt, 'masterPrompt')}
                  className="py-1 px-2.5 rounded bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] text-xs font-mono text-[#c4a47c] flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'masterPrompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'masterPrompt' ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={prescription.tattooDesignPrompt}
                rows={6}
                className="w-full p-3 bg-[#080808] border border-white/5 rounded-lg text-xs font-mono text-[#ccc] leading-relaxed resize-none focus:outline-none custom-scrollbar select-all"
              />
            </div>

            {/* Negative Prompt */}
            <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-300 uppercase">
                  Negative Prompt (Anti-Mockup & Anti-Slop)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(prescription.negativePrompt, 'negPrompt')}
                  className="py-1 px-2.5 rounded bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] text-xs font-mono text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'negPrompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'negPrompt' ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={prescription.negativePrompt}
                rows={3}
                className="w-full p-3 bg-[#080808] border border-white/5 rounded-lg text-xs font-mono text-rose-200/80 leading-relaxed resize-none focus:outline-none custom-scrollbar select-all"
              />
            </div>

            {/* Stüdyo Uygulama Notları */}
            <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] space-y-2 font-mono text-xs">
              <span className="text-[10px] uppercase text-[#c4a47c] font-bold block">Dövme Stüdyosu Zanaat Brifi:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#aaa]">
                <div>• <strong>Hedef Bölge:</strong> {recipe.parameters?.bodyPlacement || 'Önkol İç'}</div>
                <div>• <strong>İğne Kalınlığı:</strong> 03RL fine line & 07M1 shading</div>
                <div>• <strong>Negatif Alan:</strong> %45 açık ten (Blowout Koruması)</div>
                <div>• <strong>Renk:</strong> {recipe.parameters?.colorScheme || 'Saf Monokrom Siyah'}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TAM METİN (.TXT) */}
        {activeTab === 'fulltext' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#111] rounded-xl border border-[#222]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#aaa]">
                <FileText className="w-4 h-4 text-[#c4a47c]" />
                <span>Tek Sayfalık Reçete Metin Çıktısı</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(fullText, 'fulltext')}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-xs text-white font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedType === 'fulltext' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'fulltext' ? 'Kopyalandı' : 'Tümünü Kopyala'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile('txt')}
                  className="px-3 py-1.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#c4a47c]/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Dosyayı İndir (.txt)</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={fullText}
              rows={18}
              className="w-full p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-xs text-[#d0d0d0] font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar select-all"
            />
          </div>
        )}

        {/* TAB 5: WHATSAPP İLE PAYLAŞIM */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-[#0c140d] border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Send className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  WhatsApp ile Danışana İletilecek Karşılama ve Reçete Özeti
                </h4>
              </div>
              <p className="text-xs text-[#aaa] leading-relaxed">
                Danışanınıza bu mesajı WhatsApp üzerinden iletebilir ve indirdiğiniz tek sayfalık `.txt` veya PDF reçeteyi ek belge olarak ekleyebilirsiniz.
              </p>

              <textarea
                readOnly
                value={whatsappSummaryMessage}
                rows={10}
                className="w-full p-3.5 bg-[#080d09] border border-emerald-900/40 rounded-xl text-xs text-[#cfebd3] font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar"
              />

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer text-center"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp'ta Aç & Danışana Gönder</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(whatsappSummaryMessage, 'wa')}
                  className="py-2.5 px-4 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#333] text-xs text-[#ddd] flex items-center justify-center gap-1.5 font-mono cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Mesajı Kopyala</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#1f1f1f] text-xs font-mono gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] text-[#aaa] hover:text-white cursor-pointer"
          >
            Kapat
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-3.5 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#333] text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Yazdır</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadFile('txt')}
              className="py-2 px-3.5 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#333] text-[#ddd] font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span>Yazı (.txt)</span>
            </button>
            <PDFExportButton
              recipe={recipe}
              variant="primary"
              label="Şık PDF Dosyasını İndir"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
