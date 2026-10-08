import React, { useState } from 'react';
import { X, Send, Copy, Check, Compass, Link, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { 
  generateClientWhatsAppTotemQuizMessage, 
  parseClientTotemAnswers 
} from '../../utils/totemSharing';
import { generateWhatsAppShareLink } from '../../utils/enneagramSharing';
import { TotemTestCalculationResult } from '../../utils/behavioralTotemEngine';

interface TotemShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  onApplyImportedResult: (answers: Record<number, string>, result: TotemTestCalculationResult) => void;
  onOpenClientView: () => void;
}

export const TotemShareModal: React.FC<TotemShareModalProps> = ({
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

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ezoterik-tattoo.studio';
  const clientTestUrl = `${origin}/?mode=totem-quiz&client=${encodeURIComponent(clientName || 'Danisan')}`;
  const whatsappMessage = generateClientWhatsAppTotemQuizMessage(clientName || 'Danışanımız', clientTestUrl);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleOpenWhatsApp = () => {
    const link = generateWhatsAppShareLink(phoneNumber, whatsappMessage);
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Live parsing of pasted customer totem answers
  const parsed = parseClientTotemAnswers(pastedAnswerText);

  const handleApplyImport = () => {
    if (parsed) {
      onApplyImportedResult(parsed.answers, parsed.calculatedResult);
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
            <Compass className="w-4 h-4 text-[#c4a47c]" />
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold">
                Ruh Totemi Testini Danışana Gönderme & Cevap Alma
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
                  <span>{copiedType === 'msg' ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={whatsappMessage}
                className="w-full p-3 bg-[#111] border border-[#222] rounded-lg text-xs text-[#bbb] font-mono resize-none focus:outline-none custom-scrollbar"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp'ta Aç ve Gönder</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Test Linkini Paylaş */}
        {activeTab === 'link' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-lg bg-[#14120c] border border-[#c4a47c]/30 space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#c4a47c] font-bold block">
                Özel Danışan Test Bağlantısı
              </span>
              <p className="text-xs text-[#aaa] leading-relaxed">
                Bu bağlantıyı danışanınıza Instagram, E-posta, SMS veya Telegram üzerinden gönderebilirsiniz. Danışanınız testi telefondan çözdüğünde sonuçlar stüdyonuza tek tıkla ulaşır.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#888] font-mono font-bold block">
                Test Linki:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={clientTestUrl}
                  className="flex-1 px-3 py-2 bg-[#121212] border border-[#222] rounded-lg text-xs text-white font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(clientTestUrl, 'link')}
                  className="px-4 py-2 bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedType === 'link' ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'link' ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs font-mono">
              <span className="text-[#666]">Danışanın gördüğü ekranı test etmek için:</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenClientView();
                }}
                className="text-[#c4a47c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Danışan Görünümünü Aç</span>
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Cevapları İçe Aktar */}
        {activeTab === 'import' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#888] font-mono font-bold block">
                Müşterinin Gönderdiği WhatsApp Mesajını veya Aktarım Kodunu Yapıştırın:
              </label>
              <textarea
                rows={4}
                value={pastedAnswerText}
                onChange={(e) => setPastedAnswerText(e.target.value)}
                placeholder="Örnek: [TOTEM-TOKEN:1=1a,2=2b...|Gizem] veya '1-A, 2-C, 3-B...' gibi serbest cevap metni"
                className="w-full p-3 bg-[#111] border border-[#222] rounded-lg text-xs text-white font-mono resize-none focus:border-blue-500 focus:outline-none custom-scrollbar"
              />
            </div>

            {/* Parsed Result Preview */}
            {parsed ? (
              <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Totem Yanıtları Başarıyla Algılandı ({parsed.matchedCount} Soru)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-black px-2 py-0.5 rounded bg-[#c4a47c]">
                    {parsed.calculatedResult.primaryTotem.name} (%{parsed.calculatedResult.confidenceScore})
                  </span>
                </div>
                <div className="text-xs text-[#ccc] space-y-1">
                  <div><strong>Birincil Totem:</strong> {parsed.calculatedResult.primaryTotem.name} ({parsed.calculatedResult.primaryTotem.element})</div>
                  <div><strong>İkincil Müttefik:</strong> {parsed.calculatedResult.secondaryTotem.name}</div>
                  <div><strong>Gölge Muhafız:</strong> {parsed.calculatedResult.shadowTotem.name}</div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyImport}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{importSuccess ? '✓ Danışan Profiline Uygulandı!' : 'Sonuçları Danışan Profiline Uygula'}</span>
                </button>
              </div>
            ) : pastedAnswerText.trim() ? (
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 font-mono">
                Girilen metinde geçerli totem cevapları veya token tespit edilemedi. Lütfen aktarım kodunu eksiksiz yapıştırınız.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
