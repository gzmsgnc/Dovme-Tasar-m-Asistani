import React, { useState } from 'react';
import { ShadowArchetypeAnalysisReport } from '../../types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Flame, 
  Layers, 
  Compass, 
  ShieldCheck, 
  Eye, 
  Maximize2,
  ChevronDown,
  ChevronUp,
  Send,
  Heart,
  Shield,
  Activity
} from 'lucide-react';

interface ShadowAnalysisViewerProps {
  report: ShadowArchetypeAnalysisReport;
  onDownloadMarkdown?: () => void;
  onOpenClientDossier?: () => void;
}

export const ShadowAnalysisViewer: React.FC<ShadowAnalysisViewerProps> = ({
  report,
  onDownloadMarkdown,
  onOpenClientDossier
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'client-letter' | 'analysis' | 'studio-brief' | 'prompts'>('all');
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const toggleSection = (secIndex: number) => {
    if (expandedSection === secIndex) setExpandedSection(null);
    else setExpandedSection(secIndex);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#c4a47c]/10 border border-[#c4a47c]/30 text-[#c4a47c]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white text-sm font-bold tracking-wide flex items-center gap-2">
              Kişiye Özel Gölge Arketip + Çakra + Totem Dövme Analizi
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1c15] text-[#c4a47c] border border-[#c4a47c]/30">
                12 Bölüm + Müşteri Şifa Rehberi
              </span>
            </h2>
            <p className="text-[11px] text-[#777] font-mono">
              Danışan: {report.section1ClientData.personName} | {report.section1ClientData.birthDate}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenClientDossier && (
            <button
              type="button"
              onClick={onOpenClientDossier}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#c4a47c]/30 to-amber-700/20 hover:from-[#c4a47c]/40 hover:to-amber-700/30 border border-[#c4a47c]/60 hover:border-[#c4a47c] text-[#f4e6d4] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#c4a47c]/10"
              title="Danışana gönderilecek şık konsültasyon dosyasını ve parçaları aç"
            >
              <FileText className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span>📁 Danışan Görüşme & Şifa Dosyası (Ekler Dahil)</span>
            </button>
          )}

          {report.sectionClientExplanation && (
            <button
              type="button"
              onClick={() => handleCopy(report.sectionClientExplanation.fullClientLetterText, 'client_top')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              {copiedType === 'client_top' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Send className="w-3.5 h-3.5" />}
              <span className={copiedType === 'client_top' ? 'font-bold' : ''}>
                {copiedType === 'client_top' ? 'MÜŞTERİ METNİ KOPYALANDI' : 'Müşteri Açıklamasını Kopyala'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleCopy(report.fullMarkdownDossier, 'all')}
            className="px-3 py-1.5 rounded-lg bg-[#18150f] hover:bg-[#252015] border border-[#c4a47c]/40 hover:border-[#c4a47c] text-[#c4a47c] text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedType === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className={copiedType === 'all' ? 'text-emerald-400 font-bold' : ''}>
              {copiedType === 'all' ? 'TÜMÜ KOPYALANDI' : 'Tüm 12 Bölümü Kopyala'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy(report.section11TattooArtistBrief, 'specsheet')}
            className="px-3 py-1.5 rounded-lg bg-[#111] hover:bg-[#181818] border border-[#333] hover:border-[#c4a47c] text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedType === 'specsheet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
            <span>Sanatçı Brifini Kopyala</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy(report.section12Prompts.midjourneyMasterPrompt, 'mj')}
            className="px-3 py-1.5 rounded-lg bg-[#111] hover:bg-[#181818] border border-[#333] hover:border-cyan-400 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedType === 'mj' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Midjourney Promptunu Kopyala</span>
          </button>

          {onDownloadMarkdown && (
            <button
              type="button"
              onClick={onDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#c4a47c]/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İndir (.md)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#222] pb-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#c4a47c] text-black font-bold'
              : 'text-[#888] hover:text-white bg-[#111]'
          }`}
        >
          Tüm Rapor (12 Bölüm)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('client-letter')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'client-letter'
              ? 'bg-emerald-500 text-black font-bold shadow'
              : 'text-emerald-400 hover:text-white bg-emerald-950/30 border border-emerald-500/30'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          💌 Müşteriye Açıklama Metni (Danışan Dosyası)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analysis')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'analysis'
              ? 'bg-[#c4a47c] text-black font-bold'
              : 'text-[#888] hover:text-white bg-[#111]'
          }`}
        >
          I. Ezoterik & Gölge Analizi (Bölüm 1 - 10)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('studio-brief')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'studio-brief'
              ? 'bg-[#c4a47c] text-black font-bold'
              : 'text-[#888] hover:text-white bg-[#111]'
          }`}
        >
          II. Dövme Sanatçısı Teknik Brifi (Bölüm 11)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prompts')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'prompts'
              ? 'bg-[#c4a47c] text-black font-bold'
              : 'text-[#888] hover:text-white bg-[#111]'
          }`}
        >
          III. AI Master Prompt Paketi (Bölüm 12)
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6">

        {/* SECTION 1: Danışan Verileri & Ezoterik Özet */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                <span>◆ Bölüm 1:</span> Danışan Verileri & Ezoterik Özet
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#888]">
                Doğum & İsim Matrisi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#666] block">Danışan & Doğum:</span>
                <p className="text-white font-medium">{report.section1ClientData.personName}</p>
                <p className="text-[#aaa] font-mono text-[11px]">{report.section1ClientData.birthDate} ({report.section1ClientData.birthTime})</p>
                <p className="text-[#777] text-[11px]">{report.section1ClientData.birthPlace}</p>
                <p className="text-cyan-300 font-mono text-[11px]">Anne Adı: {report.section1ClientData.motherName}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#666] block">Numeroloji & Astroloji:</span>
                <p className="text-[#c4a47c] font-mono">{report.section1ClientData.numerologySummary}</p>
                <p className="text-zinc-300 font-mono text-[11px]">{report.section1ClientData.astrologySummary}</p>
                <p className="text-[#888] font-mono text-[11px]">Önemli Sayılar: {report.section1ClientData.personalNumbers}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#666] block">Ebced & Yıldızname:</span>
                <p className="text-amber-300 font-mono">{report.section1ClientData.ebcedSummary}</p>
                <p className="text-emerald-400 font-mono text-[11px]">{report.section1ClientData.yildiznameSummary}</p>
                <p className="text-[#888] text-[11px] truncate">Mevcut Totemler: {report.section1ClientData.existingTotems}</p>
              </div>
            </div>

            {report.section1ClientData.personalStory && (
              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] text-xs">
                <span className="text-[10px] uppercase font-mono text-[#666] block mb-1">Kişisel Hikâye & Temalar:</span>
                <p className="text-[#bbb] italic leading-relaxed">{report.section1ClientData.personalStory}</p>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: Temel Psiko-Sembolik Analiz */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                <span>◆ Bölüm 2:</span> Temel Psiko-Sembolik Analiz
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#888]">
                Bilinçdışı & Simya
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                <div>
                  <span className="text-[10px] text-[#666] uppercase font-mono block">Temel Karakter Teması:</span>
                  <p className="text-white font-medium">{report.section2PsychoSymbolic.coreCharacterTheme}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] uppercase font-mono block">Tekrarlayan Yaşam Teması:</span>
                  <p className="text-[#aaa] leading-relaxed">{report.section2PsychoSymbolic.recurringLifeTheme}</p>
                </div>
                <div>
                  <span className="text-[10px] text-rose-400/90 uppercase font-mono block">Bastırılmış Yön:</span>
                  <p className="text-rose-200/90">{report.section2PsychoSymbolic.suppressedAspect}</p>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-mono block">Gölge Yön:</span>
                  <p className="text-amber-200/90">{report.section2PsychoSymbolic.shadowAspect}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-mono block">Dönüştürülmesi Gereken Temel Tema:</span>
                  <p className="text-emerald-200/90 font-medium">{report.section2PsychoSymbolic.coreTransformationTheme}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase font-mono block">Dengesizleşen Güçlü Yön:</span>
                  <p className="text-[#ccc]">{report.section2PsychoSymbolic.unbalancedStrength}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase font-mono block">Yüzleşilemeyen Sembolik Tema:</span>
                  <p className="text-[#aaa]">{report.section2PsychoSymbolic.unconfrontedSymbolicTheme}</p>
                </div>
              </div>
            </div>

            {/* Dövmenin Taşıması Gereken Ana Dönüşüm Mesajı */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-[#17140e] to-[#0d0d0d] border border-[#c4a47c]/30 text-xs">
              <span className="text-[10px] text-[#c4a47c] uppercase font-mono font-bold block mb-1">
                ✦ Dövmenin Taşıması Gereken Ana Dönüşüm Mesajı:
              </span>
              <p className="text-white text-sm italic font-serif leading-relaxed">
                "{report.section2PsychoSymbolic.tattooTransformationMessage}"
              </p>
            </div>
          </div>
        )}

        {/* SECTION 3: Enneagram Gölge Arketipi & Görsel Karşılığı */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                <span>◆ Bölüm 3:</span> Enneagram Gölge Arketipi & Görsel Karşılığı
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#c4a47c]">
                Tip {report.section3EnneagramShadow.type} ({report.section3EnneagramShadow.wing})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Psikolojik Profil */}
              <div className="p-3.5 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                <span className="text-[10px] uppercase font-mono text-[#c4a47c] font-bold block border-b border-white/5 pb-1">
                  1. Enneagram Psikolojik Dinamiği
                </span>
                <p><strong className="text-[#888]">Temel Tip:</strong> Tip {report.section3EnneagramShadow.typeName} ({report.section3EnneagramShadow.wing})</p>
                <p><strong className="text-[#888]">Temel Motivasyon:</strong> {report.section3EnneagramShadow.coreMotivation}</p>
                <p><strong className="text-[#888]">Temel Korku:</strong> {report.section3EnneagramShadow.coreFear}</p>
                <p><strong className="text-rose-400">Stres Gölge Davranışı:</strong> {report.section3EnneagramShadow.stressShadowBehavior}</p>
                <p><strong className="text-amber-400">Bastırılan İhtiyaç:</strong> {report.section3EnneagramShadow.suppressedNeed}</p>
                <p><strong className="text-emerald-400">Dengelenmiş Hali:</strong> {report.section3EnneagramShadow.balancedTransformedState}</p>
              </div>

              {/* Görsel Karşılığı (Visual Translation) */}
              <div className="p-3.5 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                <span className="text-[10px] uppercase font-mono text-cyan-300 font-bold block border-b border-white/5 pb-1">
                  2. Gölgenin Dövmedeki Görsel Karşılığı
                </span>
                <p><strong className="text-white">Temsil Eden Figür:</strong> {report.section3EnneagramShadow.visualTranslation.figure}</p>
                <p><strong className="text-[#888]">Bakış & Yüz İfadesi:</strong> {report.section3EnneagramShadow.visualTranslation.facialExpressionGaze}</p>
                <p><strong className="text-[#888]">Vücut / Hareket Dili:</strong> {report.section3EnneagramShadow.visualTranslation.bodyMovementLanguage}</p>
                <p><strong className="text-[#888]">Geometrik Karşılık:</strong> {report.section3EnneagramShadow.visualTranslation.geometricEquivalent}</p>
                <p><strong className="text-[#888]">Organik Sembol:</strong> {report.section3EnneagramShadow.visualTranslation.organicSymbolEquivalent}</p>
                <p><strong className="text-[#888]">Kompozisyondaki Konum:</strong> {report.section3EnneagramShadow.visualTranslation.compositionLocation}</p>
                <div className="pt-1 border-t border-white/5 text-[11px] text-[#aaa]">
                  <strong className="text-[#c4a47c] block text-[10px] uppercase">Gölgenin Görsel İfadesi:</strong>
                  {report.section3EnneagramShadow.visualTranslation.psychologicalShadowPortrayal}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Totem Hayvanı Analizi (Güç + Gölge) */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-3 gap-2">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                <span>◆ Bölüm 4:</span> Totem Hayvanı Analizi (Kişisel Frekans & Güç/Gölge Kodu)
              </h3>
              <div className="flex items-center gap-2">
                {report.section8MainConcept.totemAnimal && !report.section8MainConcept.totemAnimal.includes('dahil edilmedi') ? (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-bold">
                    ✓ Tasarıma Dahil Edildi
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 font-bold">
                    ✕ Tasarıma Dahil Edilmedi (Ruhani Analiz)
                  </span>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#888]">
                  Deterministik Hesaplama
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {report.section4TotemAnimals.map((totem, i) => (
                <div key={i} className="p-4 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#c4a47c]" /> {totem.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#c4a47c]">
                      {totem.role}
                    </span>
                  </div>

                  <p className="text-[#bbb]">{totem.mainTotemSymbolism}</p>

                  <div className="space-y-1.5 pt-1">
                    <p><strong className="text-emerald-400">Güçlü Tarafı:</strong> {totem.strongSide}</p>
                    <p><strong className="text-cyan-300">Koruyucu & İçgüdüsel:</strong> {totem.protectiveSide}</p>
                    <div className="p-2 rounded bg-amber-950/20 border border-amber-500/20 text-amber-200/90">
                      <strong className="text-amber-400 block text-[10px] uppercase">Gölge Tarafı & Dengesiz Hali:</strong>
                      {totem.shadowSide} — {totem.unbalancedBehavior}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#141414] border border-[#222] space-y-1 font-mono text-[11px]">
                    <span className="text-[#c4a47c] block text-[9px] uppercase font-bold">Dövmedeki Görsel & Fiziksel Kodlama:</span>
                    <p className="text-[#ccc]">• <strong>Bakış & Baş Açısı:</strong> {totem.gazeDirection} ({totem.headAngle})</p>
                    <p className="text-[#ccc]">• <strong>Hareket / Pençe / Kanat:</strong> {totem.movementDetail}</p>
                    <p className="text-[#ccc]">• <strong>Duruş & Görev:</strong> {totem.posture} | {totem.compositionRole}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: Çakra Blokajları & Organik Entegrasyon */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                <span>◆ Bölüm 5:</span> Kritik Çakra Blokajları & Organik Entegrasyon
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#888]">
                Geometrik ve Doğal Dönüşüm
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {report.section5ChakraBlockages.map((chk, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-2">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-[#c4a47c]">✦</span> {chk.chakraNumber}. {chk.chakraName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-rose-300 border border-rose-500/20">
                      Blokaj / Dengesizlik
                    </span>
                  </div>

                  <p className="text-[#aaa]"><strong className="text-white">Blokaj Anlamı:</strong> {chk.symbolicBlockageMeaning}</p>
                  <p className="text-[#999]"><strong className="text-white">Davranışsal Yansıma:</strong> {chk.behavioralManifestation}</p>

                  <div className="grid grid-cols-2 gap-2 p-2 rounded bg-[#141414] border border-[#222] font-mono text-[10px]">
                    <div>
                      <span className="text-[#666] block uppercase text-[8px]">Geometrik Karşılık:</span>
                      <span className="text-[#c4a47c]">{chk.geometricEquivalent}</span>
                    </div>
                    <div>
                      <span className="text-[#666] block uppercase text-[8px]">Doğal Sembol:</span>
                      <span className="text-emerald-400">{chk.naturalSymbol}</span>
                    </div>
                    <div>
                      <span className="text-[#666] block uppercase text-[8px]">Dövme Bölgesi:</span>
                      <span className="text-white">{chk.designPlacementSection}</span>
                    </div>
                    <div>
                      <span className="text-[#666] block uppercase text-[8px]">Şifa Mührü:</span>
                      <span className="text-cyan-300">{chk.healingTransformationSymbol}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: Gölge + Çakra + Totem Kesişimi */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                <span>◆ Bölüm 6:</span> Gölge + Çakra + Totem Kesişimi
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                Sadeleştirme & Sentez
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#c4a47c] block font-bold">1. Kesişim Analizi:</span>
                <p className="text-[#ccc]">• {report.section6Intersection.enneagramShadowChakraIntersection}</p>
                <p className="text-[#ccc]">• {report.section6Intersection.totemShadowChakraIntersection}</p>
                <p className="text-amber-200/90 font-medium">• {report.section6Intersection.recurringSharedTheme}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30">
                  <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block mb-1">
                    En Güçlü Gölge Motifi:
                  </span>
                  <p className="text-amber-100 text-xs">{report.section6Intersection.strongestShadowMotif}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-mono text-emerald-300 font-bold block mb-1">
                    En Güçlü Dönüşüm Motifi:
                  </span>
                  <p className="text-emerald-100 text-xs">{report.section6Intersection.strongestTransformationMotif}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c]">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1.5 uppercase">
                    ✓ Birbirini Destekleyen Seçili Semboller:
                  </span>
                  <ul className="space-y-1 text-[#bbb] list-disc list-inside">
                    {report.section6Intersection.supportingSymbols.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c]">
                  <span className="text-[10px] font-mono text-rose-400 font-bold block mb-1.5 uppercase">
                    ✗ Elenen Gereksiz Tekrarlar:
                  </span>
                  <ul className="space-y-1 text-[#888] list-disc list-inside">
                    {report.section6Intersection.eliminatedRedundantSymbols.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: Sembolik Görsel Sözlük Tablosu */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                <span>◆ Bölüm 7:</span> Sembolik Görsel Sözlük Tablosu
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#888]">
                Görsel Görev Matrisi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#222] bg-[#111] text-[10px] font-mono text-[#888] uppercase">
                    <th className="p-2.5">Sembol</th>
                    <th className="p-2.5">Kaynak</th>
                    <th className="p-2.5">Ezoterik Anlam</th>
                    <th className="p-2.5">Gölge / Dönüşüm</th>
                    <th className="p-2.5">Görsel Görevi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {report.section7VisualDictionary.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-2.5 font-bold text-white font-mono whitespace-nowrap">
                        <span className="text-[#c4a47c] mr-1">✦</span>
                        {item.symbol}
                      </td>
                      <td className="p-2.5 text-[#aaa] font-mono text-[11px]">{item.source}</td>
                      <td className="p-2.5 text-[#bbb] leading-relaxed">{item.meaning}</td>
                      <td className="p-2.5 text-amber-200/90 leading-relaxed">{item.shadowOrTransformation}</td>
                      <td className="p-2.5 text-cyan-300 font-mono text-[11px]">{item.visualRole}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 8 & 9: Ana Dövme Konsepti & Kompozisyon Mimarisi */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 8: Ana Konsept */}
            <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-3 text-xs">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold border-b border-[#1f1f1f] pb-2 flex items-center gap-1.5">
                <span>◆ Bölüm 8:</span> Ana Dövme Konsepti & Hiyerarşisi
              </h3>
              <p><strong className="text-white">Ana Sembol:</strong> {report.section8MainConcept.mainSymbol}</p>
              <p><strong className="text-[#888]">Yardımcı Semboller:</strong> {report.section8MainConcept.secondarySymbols.join(', ')}</p>
              <p><strong className="text-amber-400">Gölge Sembolü:</strong> {report.section8MainConcept.shadowSymbol}</p>
              <div className="p-2.5 rounded bg-[#111] border border-[#222] font-mono text-[11px] space-y-1">
                <span className="text-[#c4a47c] font-bold block text-[9px] uppercase">Görsel Hiyerarşi Yüzdeleri:</span>
                <p className="text-emerald-400">• Ana Odak: {report.section8MainConcept.visualHierarchy.primaryFocusPercent}</p>
                <p className="text-white">• Yardımcı Semboller: {report.section8MainConcept.visualHierarchy.secondaryPercent}</p>
                <p className="text-amber-300">• Ezoterik Mikro Detaylar: {report.section8MainConcept.visualHierarchy.microDetailsPercent}</p>
              </div>
              <p><strong className="text-[#888]">Negatif Alan:</strong> {report.section8MainConcept.negativeSpaceUsage}</p>
              <p className="text-[#aaa] leading-relaxed"><strong className="text-white">Gözün İzleyeceği Yol:</strong> {report.section8MainConcept.eyeMovementPath}</p>
            </div>

            {/* Section 9: Kompozisyon Mimarisi */}
            <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-3 text-xs">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold border-b border-[#1f1f1f] pb-2 flex items-center gap-1.5">
                <span>◆ Bölüm 9:</span> Dövme Kompozisyon Mimarisi
              </h3>
              <p><strong className="text-white">Eksen & Yönelim:</strong> {report.section9CompositionArchitecture.axisOrientation}</p>
              <p><strong className="text-[#888]">Simetri / Denge:</strong> {report.section9CompositionArchitecture.symmetryType}</p>
              <p><strong className="text-[#888]">Ana Figürün Açısı:</strong> {report.section9CompositionArchitecture.mainFigureDirection}</p>
              <div className="space-y-1.5 p-2.5 rounded bg-[#111] border border-[#222] text-[11px]">
                <p><strong className="text-cyan-300">Üst Bölüm:</strong> {report.section9CompositionArchitecture.topSection}</p>
                <p><strong className="text-white">Merkez Bölüm:</strong> {report.section9CompositionArchitecture.centerSection}</p>
                <p><strong className="text-amber-300">Alt Bölüm:</strong> {report.section9CompositionArchitecture.bottomSection}</p>
              </div>
              <p className="text-[#888] font-mono text-[10px]">
                <strong>Mikro Detay Yerleşimi:</strong> {report.section9CompositionArchitecture.microDetailsPlacement}
              </p>
            </div>
          </div>
        )}

        {/* SECTION 10: Ezoterik Mikro Detaylar */}
        {(activeTab === 'all' || activeTab === 'analysis') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                <span>◆ Bölüm 10:</span> Ezoterik Mikro Detaylar & Mühürler
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#888]">
                Gizli Mühürler & Fibonacci
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {report.section10EsotericMicroDetails.map((micro, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0e0e0e] border border-[#1c1c1c] space-y-1.5 font-mono">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c] border border-[#c4a47c]/30">
                    {micro.type}
                  </span>
                  <p className="text-white font-bold">{micro.name}</p>
                  <p className="text-[#aaa] text-[11px] leading-relaxed">{micro.detail}</p>
                  <p className="text-[#777] text-[10px] pt-1 border-t border-white/5">{micro.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MÜŞTERİYE ÖZEL SEMBOL & ŞİFA AÇIKLAMA REHBERİ (CLIENT DOSSIER) */}
        {(activeTab === 'all' || activeTab === 'client-letter') && report.sectionClientExplanation && (
          <div className="p-6 rounded-xl bg-[#090b0a] border border-emerald-500/40 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-inner">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-emerald-300 text-sm uppercase tracking-wider font-mono font-bold">
                      Müşteriye Gönderilecek Sembolizm & Şifa Açıklama Rehberi
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      Müşteri İletişim Metni
                    </span>
                  </div>
                  <p className="text-[11px] text-[#888] font-mono mt-0.5">
                    Bu metin, danışanınıza WhatsApp, E-posta veya basılı kart olarak doğrudan iletilmek üzere hazırlanmıştır.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(report.sectionClientExplanation.fullClientLetterText, 'client_letter_inner')}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-500/20"
                >
                  {copiedType === 'client_letter_inner' ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedType === 'client_letter_inner' ? 'METİN KOPYALANDI!' : 'Müşteri Metnini Kopyala'}</span>
                </button>
              </div>
            </div>

            {/* Danışan Giriş & Bütüncül Mesaj Kartı */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 p-4 rounded-xl bg-[#0f1411] border border-emerald-900/50 space-y-2">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Danışana Özel Giriş
                </span>
                <p className="text-xs text-[#ddd] leading-relaxed italic font-serif">
                  "{report.sectionClientExplanation.greetingAndIntro}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14120a] border border-amber-500/30 space-y-2">
                <span className="text-[10px] uppercase font-mono text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Bütüncül Şifa & Dönüşüm Mesajı
                </span>
                <p className="text-xs text-amber-200/90 leading-relaxed font-mono">
                  "{report.sectionClientExplanation.holisticTalismanTheme}"
                </p>
              </div>
            </div>

            {/* DÖVMEDEKİ SEMBOLLERİN TEK TEK AÇIKLAMASI */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-mono text-[#c4a47c] tracking-widest font-bold flex items-center gap-2">
                  <span>◆ Dövmedeki Sembollerin Tek Tek Açıklaması, Nedeni & Şifası</span>
                  <span className="text-[10px] text-[#777] font-normal">({report.sectionClientExplanation.symbols.length} Temel Öğe)</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.sectionClientExplanation.symbols.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-[#0c0e0d] border border-[#1b221e] hover:border-emerald-500/40 transition-all space-y-3"
                  >
                    {/* Symbol Title & Category */}
                    <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 block">{idx + 1}. Sembol</span>
                        <h5 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                          {item.symbolName}
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 whitespace-nowrap">
                        {item.category}
                      </span>
                    </div>

                    {/* Meaning */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-[#888] block font-semibold flex items-center gap-1">
                        📜 Sembolün Anlamı:
                      </span>
                      <p className="text-xs text-[#ccc] leading-relaxed">
                        {item.meaning}
                      </p>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1 p-2.5 rounded-lg bg-[#0e1210] border border-emerald-950">
                      <span className="text-[10px] uppercase font-mono text-cyan-400 block font-semibold flex items-center gap-1">
                        🎯 Neden Seçildi (Danışan Verisindeki Kaynağı):
                      </span>
                      <p className="text-xs text-[#bbb] leading-relaxed">
                        {item.reason}
                      </p>
                    </div>

                    {/* Benefits & Healing */}
                    <div className="space-y-1 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                      <span className="text-[10px] uppercase font-mono text-emerald-300 block font-bold flex items-center gap-1">
                        🌿 Neye İyi Gelecek (Ruhsal & Psikolojik Şifası):
                      </span>
                      <p className="text-xs text-emerald-100/90 leading-relaxed">
                        {item.benefitsAndHealing}
                      </p>
                    </div>

                    {/* Visual Placement */}
                    <div className="text-[11px] text-[#888] font-mono pt-1 border-t border-white/5 flex items-start gap-1">
                      <span className="text-[#666]">Dövmedeki Yeri:</span>
                      <span className="text-[#aaa]">{item.visualRepresentation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Günlük Yaşamda Bağ Kurma Rehberi */}
            <div className="p-4 rounded-xl bg-[#0e1311] border border-emerald-900/40 space-y-2">
              <span className="text-[11px] uppercase font-mono text-emerald-300 font-bold tracking-wider flex items-center gap-2">
                🧘 Günlük Yaşamda Bu Dövmenin Enerjisiyle Bağ Kurma Rehberi
              </span>
              <pre className="text-xs text-[#bbb] font-mono whitespace-pre-wrap leading-relaxed">
                {report.sectionClientExplanation.dailyAffirmationAndIntegration}
              </pre>
            </div>

            {/* Tek Tıkla Müşteriye Gönderilecek Ham Metin Kutusu */}
            <div className="p-4 rounded-xl bg-[#090909] border border-[#222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#888] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp / E-Posta Gönderim Formatı (Doğrudan Kopyalayabilirsiniz)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(report.sectionClientExplanation.fullClientLetterText, 'raw_client_text')}
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'raw_client_text' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'raw_client_text' ? 'KOPYALANDI' : 'Metni Kopyala'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={report.sectionClientExplanation.fullClientLetterText}
                rows={12}
                className="w-full bg-[#050505] p-3 rounded-lg border border-[#1a1a1a] text-xs font-mono text-emerald-100/90 leading-relaxed resize-none outline-none select-all"
              />
            </div>
          </div>
        )}

        {/* SECTION 11: Dövme Sanatçısı Teknik Uygulama Brifi */}
        {(activeTab === 'all' || activeTab === 'studio-brief') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/40">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-amber-300 text-xs uppercase tracking-widest font-mono font-bold">
                    Bölüm 11: Dövme Sanatçısı Teknik Uygulama Brifi (Studio Spec Sheet)
                  </h3>
                  <span className="text-[10px] text-[#777] font-mono">İğne, Gölgeleme, Negatif Alan & Blowout Güvenliği</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(report.section11TattooArtistBrief, 'specsheet_sec11')}
                className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {copiedType === 'specsheet_sec11' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'specsheet_sec11' ? 'KOPYALANDI' : 'Brifi Kopyala'}</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#0e0e0e] border border-[#222]">
              <pre className="text-xs font-mono text-amber-100/90 whitespace-pre-wrap leading-relaxed select-all">
                {report.section11TattooArtistBrief}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 12: Midjourney v6.1 / Niji 6 Master Prompt & AI Suite */}
        {(activeTab === 'all' || activeTab === 'prompts') && (
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#c4a47c]/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#c4a47c]/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#c4a47c]/10 text-[#c4a47c] border border-[#c4a47c]/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest font-mono font-bold">
                    Bölüm 12: Midjourney v6.1 / Niji 6 Master Prompt & AI Suite
                  </h3>
                  <span className="text-[10px] text-[#777] font-mono">
                    Tattoo Flash Plate | Sıfır Mockup / Sıfır İnsan Bedeni
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(report.section12Prompts.midjourneyMasterPrompt, 'mj_sec12')}
                className="px-3 py-1.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#c4a47c]/20"
              >
                {copiedType === 'mj_sec12' ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'mj_sec12' ? 'KOPYALANDI' : 'Midjourney Promptunu Kopyala'}</span>
              </button>
            </div>

            {/* Prompt Cards */}
            <div className="space-y-4">
              {/* Midjourney v6.1 */}
              <div className="p-4 rounded-lg bg-[#0e0e0e] border border-[#222] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#c4a47c] font-bold uppercase">
                    1. Midjourney v6.1 / Niji 6 Master Prompt:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(report.section12Prompts.midjourneyMasterPrompt, 'sub_mj')}
                    className="text-[10px] font-mono text-[#888] hover:text-[#c4a47c] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'sub_mj' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Kopyala
                  </button>
                </div>
                <textarea
                  readOnly
                  value={report.section12Prompts.midjourneyMasterPrompt}
                  rows={6}
                  className="w-full bg-transparent text-xs font-mono text-[#eee] leading-relaxed resize-none outline-none select-all"
                />
              </div>

              {/* DALL-E 3 */}
              <div className="p-4 rounded-lg bg-[#0e0e0e] border border-[#222] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                    2. DALL-E 3 Master Tattoo Flash Plate Prompt:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(report.section12Prompts.dalle3Prompt, 'sub_dalle')}
                    className="text-[10px] font-mono text-[#888] hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'sub_dalle' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Kopyala
                  </button>
                </div>
                <textarea
                  readOnly
                  value={report.section12Prompts.dalle3Prompt}
                  rows={4}
                  className="w-full bg-transparent text-xs font-mono text-[#ddd] leading-relaxed resize-none outline-none select-all"
                />
              </div>

              {/* 03RL Thermal Stencil Transfer */}
              <div className="p-4 rounded-lg bg-[#0e0e0e] border border-[#222] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#c4a47c] font-bold uppercase">
                    3. 03RL Termal Stencil Transfer Çizimi (Saf Çizgi):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(report.section12Prompts.stencilPrompt, 'sub_stencil')}
                    className="text-[10px] font-mono text-[#888] hover:text-[#c4a47c] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'sub_stencil' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Kopyala
                  </button>
                </div>
                <textarea
                  readOnly
                  value={report.section12Prompts.stencilPrompt}
                  rows={3}
                  className="w-full bg-transparent text-xs font-mono text-[#c4a47c] leading-relaxed resize-none outline-none select-all"
                />
              </div>

              {/* Anti-Slop & Anti-Mockup Negatif Prompt */}
              <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-rose-300 font-bold uppercase">
                    🚫 Anti-Mockup & Anti-Skin Negatif Prompt:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(report.section12Prompts.negativePrompt, 'sub_neg')}
                    className="text-[10px] text-rose-400 hover:text-rose-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'sub_neg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Kopyala
                  </button>
                </div>
                <p className="text-rose-200/90 text-[11px] select-all leading-relaxed">
                  {report.section12Prompts.negativePrompt}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
