import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Send, 
  FileText, 
  Sparkles, 
  Flame, 
  Disc, 
  ShieldCheck, 
  Compass, 
  Binary, 
  Layers,
  Paperclip,
  Share2,
  Printer
} from 'lucide-react';
import { TattooRecipe } from '../../types';
import { generateWhatsAppShareLink } from '../../utils/enneagramSharing';
import { PDFExportButton } from '../common/PDFExportButton';

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
  const [activeTab, setActiveTab] = useState<'visual' | 'fulltext' | 'whatsapp'>('visual');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !recipe) return null;

  const shadow = recipe.shadowAnalysis;
  const clientExplanation = shadow?.sectionClientExplanation;
  const fullText = clientExplanation?.fullClientLetterText || recipe.shadowDossierMarkdown || '';
  const attachments = clientExplanation?.attachmentsText || '';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadFile = (format: 'txt' | 'md') => {
    const filename = `${recipe.personData.name.replace(/\s+/g, '_')}_Dovme_Konsultasyon_Dosyasi_ve_Ekleri.${format}`;
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

  const handleDownloadAttachmentsOnly = () => {
    const filename = `${recipe.personData.name.replace(/\s+/g, '_')}_Dovme_Parcalari_ve_Ek_Dosyalar.txt`;
    const blob = new Blob([attachments], { type: 'text/plain;charset=utf-8' });
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
✨ Sevgili ${recipe.personData.name}! ✨

Dövme konsültasyon görüşmemiz doğrultusunda hazırlanan "Kişiye Özel Ezoterik Dövme Dosyanız ve Şifa Rehberiniz" hazırlandı.

🔮 *Çakra Denge Skoru:* ${recipe.chakra?.overallChakraBalanceScore || 85}/100
🌑 *Enneagram Arketip:* Tip ${recipe.enneagram.typeName} (${recipe.enneagram.wing})
🦅 *Totem Rehberiniz:* ${recipe.symbolism.totemAnimal}
✨ *Dövmenizin Ana Dönüşüm Mesajı:* "${shadow?.section2PsychoSymbolic.tattooTransformationMessage || 'Karanlıktan ışığa uyanış'}"

Tüm çakra analizlerinizi, gölge arketip raporunuzu, dövmenizin parçalarını ve bakım rehberini ekteki dosyada bulabilirsiniz. 🖋️✨
  `.trim();

  const whatsappLink = generateWhatsAppShareLink('', whatsappSummaryMessage);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#090909] border border-[#262626] rounded-2xl max-w-4xl w-full p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#c4a47c]/20 to-[#8a7250]/10 border border-[#c4a47c]/40 text-[#c4a47c]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-base sm:text-lg font-bold tracking-tight">
                  Danışana Gönderilecek Özel Konsültasyon & Şifa Dosyası
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1b12] border border-[#c4a47c]/40 text-[#c4a47c] font-bold">
                  Ek Dosyalar Dahil
                </span>
              </div>
              <p className="text-xs text-[#888] font-mono mt-0.5">
                Danışan: <strong className="text-white">{recipe.personData.name}</strong> • Tarih: {new Date(recipe.createdAt).toLocaleDateString('tr-TR')}
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
              title="Yazdır veya sistemden PDF olarak kaydet"
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
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#888] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#121212] rounded-xl border border-[#222]">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Şık Müşteri Görünümü (Lüks Kartlar)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fulltext')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'fulltext'
                ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Gönderilecek Tam Yazı Dosyası & Ekler</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>3. WhatsApp ile Danışana İlet</span>
          </button>
        </div>

        {/* TAB 1: VISUAL CLIENT DOSSIER CARDS */}
        {activeTab === 'visual' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Hero Welcome Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17140e] via-[#0f0e0a] to-[#0a0a0a] border border-[#c4a47c]/40 shadow-xl space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c4a47c] font-bold block">
                ✦ Bütüncül Ezoterik Görüşme Sentezi
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Sevgili {recipe.personData.name}, Kutsal Dövme Şifa Haritanız Hazırlandı
              </h3>
              <p className="text-xs text-[#bbb] leading-relaxed max-w-3xl">
                Bu tasarım sıradan bir çizim değil; doğum haritanızdan Pisagor numerolojinize, çakra blokajlarınızdan bilinçdışınızdaki en derin gölge arketipinize kadar uzanan kişisel enerji haritanızın bedene mühürlenmiş kutsal bir şifa tılsımıdır.
              </p>
            </div>

            {/* 1. Çakra Analiz Raporu */}
            {recipe.chakra && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0d0d] border border-[#222] space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Disc className="w-4 h-4 text-[#c4a47c]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      7+2 Çakra Analiz Raporu & Enerjetik Denge
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18150f] border border-[#c4a47c]/40 text-[#c4a47c] font-bold">
                    Denge Skoru: {recipe.chakra.overallChakraBalanceScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {recipe.chakra.chakras.slice(0, 7).map((c) => (
                    <div
                      key={c.number}
                      className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 ${
                        c.status === 'Blokajlı / Eksik'
                          ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                          : c.status === 'Aşırı Yoğun'
                          ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                          : 'bg-[#121212] border-[#1e1e1e] text-[#bbb]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5" style={{ color: c.color }}>
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                          {c.number}. {c.turkishName}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded ${
                          c.status === 'Blokajlı / Eksik' ? 'bg-rose-900/60 text-rose-300 font-bold' :
                          c.status === 'Aşırı Yoğun' ? 'bg-amber-900/60 text-amber-300' :
                          'bg-[#181818] text-[#888]'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#777]">{c.location}</div>
                      <div className="text-[9px] text-[#aaa] pt-0.5 border-t border-white/5">
                        <strong className="text-zinc-300">Şifa Yantrası:</strong> {c.yantraGeometry}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-[#14120a] border border-[#c4a47c]/20 text-[11px] text-[#d4c5b3] font-mono leading-relaxed">
                  ✦ <strong className="text-[#c4a47c]">Kozmik Denge Tavsiyesi:</strong> {recipe.chakra.primaryHealingDirective}
                </div>
              </div>
            )}

            {/* 2. Gölge Arketip & Enneagram Raporu */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0d0d0d] border border-[#222] space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Gölge Arketip Analizi & Bilinçdışı Dönüşüm
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 font-bold">
                  Tip {recipe.enneagram.typeName} ({recipe.enneagram.wing})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div className="p-3 rounded-lg bg-[#121212] border border-[#1e1e1e] space-y-1">
                  <span className="text-[10px] text-[#888] font-mono uppercase font-bold block">Temel Motivasyon & Güç:</span>
                  <p className="text-zinc-200">{recipe.enneagram.coreMotivation}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#121212] border border-[#1e1e1e] space-y-1">
                  <span className="text-[10px] text-rose-400 font-mono uppercase font-bold block">Gölge Yön & Bastırılmış Refleks:</span>
                  <p className="text-zinc-300">{recipe.enneagram.shadowTraits.join(', ')}</p>
                </div>
              </div>

              {shadow && (
                <div className="p-3.5 rounded-lg bg-gradient-to-r from-rose-950/20 via-[#14120a] to-[#0a0a0a] border border-[#c4a47c]/30 text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-[#c4a47c] font-bold block">
                    ✨ Dövmenizin Taşıdığı Bütüncül Dönüşüm Mesajı:
                  </span>
                  <p className="italic font-serif text-sm text-white">
                    "{shadow.section2PsychoSymbolic.tattooTransformationMessage}"
                  </p>
                </div>
              )}
            </div>

            {/* 3. Totem Hayvanı & Rehberlik */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0d0d0d] border border-[#222] space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#c4a47c]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Ruhani Totem Hayvanı & Koruyucu Rehberler
                  </h4>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  recipe.parameters.includeTotemInDesign
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-800 text-amber-300'
                }`}>
                  {recipe.parameters.includeTotemInDesign ? '✓ Dövmede Ana Odak' : '✕ Yalnızca Ruhani Analizde'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {recipe.symbolism.totemHierarchy?.map((totem, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#121212] border border-[#1e1e1e] text-xs space-y-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#181818] text-[#c4a47c] font-bold">
                      {totem.role}
                    </span>
                    <h5 className="font-bold text-white text-sm mt-1">{totem.name}</h5>
                    <p className="text-[10px] text-[#aaa] leading-relaxed line-clamp-3">{totem.meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Mors Alfabesi Şifresi (Seçilmişse) */}
            {recipe.morseCodePattern && (
              <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222] space-y-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Binary className="w-4 h-4 text-[#c4a47c]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Mors Alfabesi Kutsal Rakam / İfade Şifresi
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ✓ Tasarıma Mühürlendi
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#121212] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#777] font-mono block">Şifrelenen İfade:</span>
                    <span className="text-white font-mono font-bold text-sm">{recipe.morseCodePattern.rawText}</span>
                  </div>
                  <div className="p-2 rounded bg-black border border-white/10 text-[#c4a47c] text-center tracking-widest text-sm font-bold">
                    {recipe.morseCodePattern.morseDisplay}
                  </div>
                </div>
                <p className="text-[10px] text-[#888] font-mono">
                  {recipe.morseCodePattern.tattooSpecification.split('\n')[0].replace('- ', '')}
                </p>
              </div>
            )}

            {/* 5. Parçalar & Ek Dosyalar Özeti */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0e131d] border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-blue-900/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Yazı Dosyasına Ek Olarak Gönderilecek Parçalar
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadAttachmentsOnly}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-blue-950 hover:bg-blue-900 border border-blue-400/40 text-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Sadece Ekleri İndir</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-[#0b0e14] border border-blue-900/30 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-blue-300 font-bold block">EK 1: Dövme Parçaları</span>
                  <p className="text-[11px] text-[#ccc]">Ana odak figürü, yardımcı organik akış hatları ve kutsal geometri katmanları.</p>
                </div>

                <div className="p-3 rounded-lg bg-[#0b0e14] border border-blue-900/30 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-blue-300 font-bold block">EK 2: Stüdyo & İğne Kılavuzu</span>
                  <p className="text-[11px] text-[#ccc]">03RL, 05RL, Magnum iğne konfigürasyonları, gölgeleme ve negatif alan güvenliği.</p>
                </div>

                <div className="p-3 rounded-lg bg-[#0b0e14] border border-blue-900/30 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-blue-300 font-bold block">EK 3: Bakım & Ritüel</span>
                  <p className="text-[11px] text-[#ccc]">Medikal 14 günlük iyileşme adımları ve dövmenin enerjisiyle günlük merkezlenme rehberi.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL TEXT & ATTACHMENTS (DOWNLOADABLE TEXT FILE VIEW) */}
        {activeTab === 'fulltext' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#111] rounded-xl border border-[#222]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#aaa]">
                <FileText className="w-4 h-4 text-[#c4a47c]" />
                <span>Danışana Gönderilecek Eksiksiz Yazı Dosyası (Ekler ve Parçalar Dahil)</span>
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

        {/* TAB 3: WHATSAPP SHARE FORMAT */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-[#0c140d] border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Send className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  WhatsApp ile Danışana Gönderilecek Şık Karşılama ve Özet Mesajı
                </h4>
              </div>
              <p className="text-xs text-[#aaa] leading-relaxed">
                Danışanınıza bu mesajı WhatsApp üzerinden iletebilir ve ardından indirdiğiniz `.txt` dosyasını belge olarak ekleyebilirsiniz.
              </p>

              <textarea
                readOnly
                value={whatsappSummaryMessage}
                rows={9}
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
