import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Link, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  ShieldCheck,
  Compass,
  Layers,
  Heart
} from 'lucide-react';
import { generateWhatsAppShareLink } from '../../utils/enneagramSharing';

interface ClientIntakeLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFormInApp?: () => void;
}

export const ClientIntakeLinkModal: React.FC<ClientIntakeLinkModalProps> = ({
  isOpen,
  onClose,
  onOpenFormInApp
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const intakeUrl = `${origin}/?mode=client-form`;

  const whatsappMessage = `✨ Merhaba! ✨\n\nSize özel sembol haritanızı, astrolojik & numerolojik arketipinizi ve dövme tasarım kompozisyonunuzu hazırlayabilmemiz için lütfen aşağıdaki Danışan Bilgi Formu'nu doldurunuz:\n\n🔗 ${intakeUrl}\n\nForm üzerinden iletişim (telefon, e-posta), doğum bilgileri, Enneagram ve davranışsal Totem testinizi tamamladığınızda bilgileriniz doğrudan stüdyomuza güvenle ulaşacaktır.\n\nTeşekkür ederiz! ✨🖋️`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(intakeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const link = generateWhatsAppShareLink(phoneNumber, whatsappMessage);
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c4a47c]/10 border border-[#c4a47c]/30 flex items-center justify-center text-[#c4a47c]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold">
                Tekil Danışan Bilgi Formu Linki
              </h3>
              <p className="text-[11px] text-[#777] font-mono mt-0.5">
                Müşterinize tek bir form göndererek tüm verileri eksiksiz toplayın.
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

        {/* Feature Highlights Card */}
        <div className="p-4 rounded-xl bg-[#0f0e0b] border border-[#c4a47c]/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c4a47c]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bu Form Müşteriden Hangi Bilgileri Toplar?</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#aaa]">
            <div className="flex items-center gap-1.5 bg-[#080808] p-2 rounded border border-[#1a1a1a]">
              <span className="text-[#c4a47c]">✓</span>
              <span>Ad & Soyad</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#080808] p-2 rounded border border-[#1a1a1a]">
              <span className="text-[#c4a47c]">✓</span>
              <span>Anne Adı (Ebced / Soy)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#080808] p-2 rounded border border-[#1a1a1a]">
              <span className="text-[#c4a47c]">✓</span>
              <span>Doğum Tarihi & Saati</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#080808] p-2 rounded border border-[#1a1a1a]">
              <span className="text-[#c4a47c]">✓</span>
              <span>Doğum Yeri (Şehir)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#080808] p-2 rounded border border-[#1a1a1a]">
              <Layers className="w-3 h-3 text-[#c4a47c]" />
              <span>5 Soru Enneagram</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#080808] p-2 rounded border border-[#1a1a1a]">
              <Compass className="w-3 h-3 text-[#c4a47c]" />
              <span>15 Soru Totem Testi</span>
            </div>
          </div>
          <div className="text-[10px] text-[#777] font-mono italic pt-1">
            * Müşteri ham yanıtları doldurur; kişisel sonuçlar (Enneagram/Totem) müşteriye gösterilmez, doğrudan stüdyonuza "Yeni Danışan" olarak düşer.
          </div>
        </div>

        {/* Link Card */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#bbb] block">
            Doğrudan Form Bağlantısı (URL):
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-[#121212] border border-[#222] rounded-lg text-xs font-mono text-[#e0e0e0] truncate select-all">
              {intakeUrl}
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-[#181818] hover:bg-[#222] border border-[#333] hover:border-[#c4a47c] text-[#c4a47c]'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Sharing Card */}
        <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#1c1c1c] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp ile Danışana Gönder</span>
            </span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-[11px] font-mono text-[#888] hover:text-[#c4a47c] flex items-center gap-1 cursor-pointer"
            >
              {copiedMessage ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedMessage ? 'Metin Kopyalandı' : 'Metni Kopyala'}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-[#777] block">
              Danışan Telefon Numarası (İsteğe Bağlı, örn: 905xxxxxxxxx):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="905xxxxxxxxx (Boş bırakırsanız WhatsApp kişi listesi açılır)"
                className="flex-1 px-3 py-2 bg-[#121212] border border-[#222] focus:border-[#c4a47c] rounded-lg text-xs font-mono text-white placeholder-[#555] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-900/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp Aç</span>
              </button>
            </div>
          </div>

          {/* Pre-composed message preview */}
          <div className="p-2.5 rounded-lg bg-[#080808] border border-[#181818] text-[11px] font-mono text-[#888] whitespace-pre-line leading-relaxed max-h-28 overflow-y-auto custom-scrollbar">
            {whatsappMessage}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#181818]">
          <a
            href={intakeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] text-[#aaa] hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Yeni Sekmede Önizle</span>
          </a>

          {onOpenFormInApp && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFormInApp();
              }}
              className="px-4 py-2 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Formu Şimdi Doldur</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
