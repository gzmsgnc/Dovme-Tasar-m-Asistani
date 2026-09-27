import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, Link, ArrowRight, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { 
  generateClientWhatsAppQuizMessage, 
  generateWhatsAppShareLink, 
  parseClientAnswers 
} from '../../utils/enneagramSharing';
import { ENNEAGRAM_TYPES } from '../../utils/enneagram';

interface EnneagramShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  onApplyImportedResult: (type: number, wing: string) => void;
  onOpenClientView: () => void;
}

export const EnneagramShareModal: React.FC<EnneagramShareModalProps> = ({
  isOpen,
  onClose,
  clientName,
  onApplyImportedResult,
  onOpenClientView
}) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'link' | 'import'>('whatsapp');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  
  // Import Answer State
  const [pastedAnswerText, setPastedAnswerText] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const clientTestUrl = `${window.location.origin}/?mode=enneagram-quiz&client=${encodeURIComponent(clientName || 'Danisan')}`;
  const whatsappMessage = generateClientWhatsAppQuizMessage(clientName || 'Danışanımız', clientTestUrl);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleOpenWhatsApp = () => {
    const link = generateWhatsAppShareLink(phoneNumber, whatsappMessage);
    window.open(link, '_blank');
  };

  // Live parsing of pasted customer answers
  const parsed = parseClientAnswers(pastedAnswerText);

  const handleApplyImport = () => {
    if (parsed) {
      onApplyImportedResult(parsed.calculatedType, parsed.calculatedWing);
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#c4a47c]" />
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold">
                Enneagram Mini Testini Müşteriye Gönderme & Cevap Alma
              </h3>
              <p className="text-[10px] text-[#666] font-mono mt-0.5">
                Danışanınız: <strong className="text-white">{clientName || 'Belirtilmedi'}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#181818] text-[#777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#121212] rounded-lg border border-[#222]">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>1. WhatsApp ile Gönder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-[#c4a47c] text-black shadow-sm shadow-[#c4a47c]/30'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>2. Test Linkini Paylaş</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'bg-[#3b82f6] text-white shadow-sm shadow-blue-500/30'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>3. Cevapları İçe Aktar</span>
          </button>
        </div>

        {/* TAB 1: WhatsApp ile Gönder */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#888] font-mono font-bold block">
                Müşteri Telefon Numarası (İsteğe bağlı):
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Örn: 0532 123 45 67 veya +905321234567"
                className="w-full px-3 py-2 bg-[#121212] border border-[#222] rounded-lg text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-wider text-[#888] font-mono font-bold">
                  Müşteriye Gönderilecek WhatsApp Mesaj Önizlemesi:
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(whatsappMessage, 'msg')}
                  className="text-[10px] font-mono text-[#aaa] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'msg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'msg' ? 'Kopyalandı' : 'Tüm Mesajı Kopyala'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={whatsappMessage}
                rows={8}
                className="w-full p-3 bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg text-[11px] text-[#ccc] font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp'ta Aç & Danışana Gönder</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy(whatsappMessage, 'msg')}
                className="py-2.5 px-4 rounded-lg bg-[#151515] hover:bg-[#202020] border border-[#333] text-xs text-[#ddd] flex items-center justify-center gap-1.5 font-mono cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Metni Kopyala</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Paylaşılabilir Web Linki */}
        {activeTab === 'link' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-[#0f0e0a] border border-[#c4a47c]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#c4a47c]">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  Danışana Özel Mobil Test Sayfası Linki
                </h4>
              </div>
              <p className="text-[11px] text-[#aaa] leading-relaxed">
                Bu linki müşterinize Instagram DM, WhatsApp veya SMS ile gönderebilirsiniz. Müşteriniz telefonundan linki açtığında doğrudan 5 soruluk temiz bir teste girer ve sonuçlarını tek tıkla size iletebilir.
              </p>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080808] border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={clientTestUrl}
                  className="flex-1 bg-transparent text-xs text-[#c4a47c] font-mono focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(clientTestUrl, 'url')}
                  className="px-3 py-1.5 rounded bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-xs text-white font-mono flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedType === 'url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'url' ? 'Kopyalandı' : 'Linki Kopyala'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenClientView}
                  className="w-full py-2 px-3 rounded-lg bg-[#14120c] hover:bg-[#1f1a10] border border-[#c4a47c]/50 text-xs text-[#e5d5be] font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>👁️ Müşterinin Göreceği Ekranı Şimdi Önizle (Client Quiz Mode)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c4a47c]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Müşteri Cevaplarını İçe Aktar (Import Answers) */}
        {activeTab === 'import' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#888] font-mono font-bold block flex items-center justify-between">
                <span>Müşteriden Gelen Mesajı veya Kodu Buraya Yapıştırın:</span>
                <span className="text-blue-400 text-[9px] font-mono">Otomatik Algılanır</span>
              </label>
              <textarea
                value={pastedAnswerText}
                onChange={(e) => setPastedAnswerText(e.target.value)}
                placeholder="Örn müşterinin ilettiği kodu yapıştırın:
[ENNEA-TOKEN:1=4,2=5,3=4,4=8,5=3|Gizem]
veya
1-A, 2-C, 3-B, 4-A, 5-D
veya
Tip 4w5"
                rows={5}
                className="w-full p-3 bg-[#111] border border-[#222] rounded-lg text-xs text-white font-mono leading-relaxed focus:border-blue-500 focus:outline-none resize-none custom-scrollbar"
              />
            </div>

            {/* Live Parsing Preview */}
            {parsed ? (
              <div className="p-3.5 rounded-lg bg-[#0e1626] border border-blue-500/40 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-blue-300 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Başarıyla Ayrıştırıldı
                  </span>
                  <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-blue-950 border border-blue-400/50">
                    Tip {parsed.calculatedWing}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {ENNEAGRAM_TYPES[parsed.calculatedType]?.typeName}
                  </h4>
                  <p className="text-[11px] text-[#aaa] mt-0.5">
                    {ENNEAGRAM_TYPES[parsed.calculatedType]?.coreMotivation}
                  </p>
                </div>
                <div className="pt-2 border-t border-blue-900/40 flex items-center justify-between">
                  <span className="text-[10px] text-blue-300 font-mono">
                    {parsed.matchedCount} Soru / Parametre Doğrulandı
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyImport}
                    className="py-1.5 px-4 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/40 transition-all"
                  >
                    {importSuccess ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{importSuccess ? 'Uygulandı!' : 'Tasarıma Hemen Uygula'}</span>
                  </button>
                </div>
              </div>
            ) : pastedAnswerText.trim() ? (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 text-[11px] text-rose-300 font-mono">
                ⚠️ Metin formatı tam okunamadı. Lütfen müşterinin gönderdiği kodu veya "1-A, 2-C..." listesini kontrol edin.
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#111] border border-[#222] text-[10px] text-[#777] font-mono leading-relaxed">
                💡 Danışanınız testi tamamladığında size WhatsApp veya SMS ile gönderdiği metni veya kodu buraya yapıştırıp tek tıkla tasarıma yansıtabilirsiniz.
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-xs text-[#aaa] cursor-pointer"
          >
            Kapat
          </button>
          <div className="text-[10px] text-[#666] font-mono">
            {activeTab === 'whatsapp' && 'WhatsApp Entegrasyonu Aktif'}
            {activeTab === 'link' && 'Müşteri Görünümü Destekleniyor'}
            {activeTab === 'import' && 'Otomatik Token Okuma Aktif'}
          </div>
        </div>
      </div>
    </div>
  );
};
