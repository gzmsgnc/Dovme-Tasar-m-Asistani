import React, { useState } from 'react';
import { 
  X, 
  Clipboard, 
  Check, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle,
  FileCheck,
  Send
} from 'lucide-react';
import { parseUniversalClientImport, UniversalParsedClient } from '../../utils/enneagramSharing';
import { PersonData } from '../../types';
import { ENNEAGRAM_TYPES } from '../../utils/enneagram';
import { calculateBehavioralTotemResult } from '../../utils/behavioralTotemEngine';
import { getTotemAnimalById } from '../../utils/totemCatalogData';

interface WhatsAppImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedClient: PersonData) => void;
}

export const WhatsAppImportModal: React.FC<WhatsAppImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const parsed: UniversalParsedClient | null = parseUniversalClientImport(inputText);

  const handleApply = () => {
    if (!parsed) {
      setErrorMessage('Yapıştırılan metinden danışan bilgisi veya geçerli bir aktarım kodu tespit edilemedi. Lütfen WhatsApp mesajını veya aktarım kodunu eksiksiz yapıştırın.');
      return;
    }

    const nowIso = new Date().toISOString();
    const id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Totem hesapla eğer totem yanıtları varsa
    let primaryTotemId = parsed.primaryTotemId;
    let secondaryTotemId = parsed.secondaryTotemId;
    let shadowTotemId = parsed.shadowTotemId;
    let totemScore: number | undefined = undefined;

    if (parsed.totemAnswers && Object.keys(parsed.totemAnswers).length > 0) {
      const totemRes = calculateBehavioralTotemResult(parsed.totemAnswers, parsed.enneagramType || 4);
      primaryTotemId = totemRes.primaryTotem?.id || primaryTotemId;
      secondaryTotemId = totemRes.secondaryTotem?.id || secondaryTotemId;
      shadowTotemId = totemRes.shadowTotem?.id || shadowTotemId;
      totemScore = totemRes.confidenceScore;
    }

    const newClient: PersonData = {
      id,
      name: parsed.name.trim(),
      phone: parsed.phone,
      email: parsed.email,
      birthDate: parsed.birthDate || '',
      birthTime: parsed.birthTime || '12:00',
      birthPlace: parsed.birthPlace || '',
      birthCity: parsed.birthCity,
      birthCountry: parsed.birthCountry,
      birthLatitude: parsed.birthLatitude,
      birthLongitude: parsed.birthLongitude,
      birthTimezone: parsed.birthTimezone,
      motherName: parsed.motherName || '',
      zodiacSystem: 'Tropical',
      enneagramType: parsed.enneagramType || 4,
      enneagramWing: parsed.enneagramWing || (parsed.enneagramType ? `${parsed.enneagramType}w${parsed.enneagramType === 9 ? 1 : parsed.enneagramType + 1}` : '4w5'),
      enneagramAnswers: parsed.enneagramAnswers,
      totemAnswers: parsed.totemAnswers,
      primaryTotemId,
      secondaryTotemId,
      shadowTotemId,
      totemConfidenceScore: totemScore,
      personalStory: parsed.personalStory,
      notes: `WhatsApp İçe Aktarım (${parsed.kind === 'full_client' ? 'Tam Danışan Formu' : parsed.kind === 'totem_quiz' ? 'Ruh Totemi Testi' : 'Enneagram/Mini Test'})`,
      source: 'client_form',
      status: 'new',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    onImportSuccess(newClient);
    onClose();
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setErrorMessage(null);
      }
    } catch {
      setErrorMessage('Panoya erişilemedi. Lütfen metni kutunun içine klavyeden (Ctrl+V / Cmd+V) yapıştırın.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0b0b] border border-[#222] rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Clipboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold">
                WhatsApp Yanıtını İçe Aktar
              </h3>
              <p className="text-[11px] text-[#777] font-mono mt-0.5">
                Danışanın WhatsApp'tan geri gönderdiği metni veya aktarım kodunu buraya yapıştırın.
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

        {/* Input Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#bbb]">Danışandan Gelen WhatsApp Mesajı / Kod:</span>
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="text-[#c4a47c] hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
            >
              <Clipboard className="w-3 h-3" />
              <span>Panodan Yapıştır</span>
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setErrorMessage(null);
            }}
            rows={5}
            placeholder={`Örnek 1: Danışanın WhatsApp'tan gönderdiği tam mesaj\nÖrnek 2: [CLIENT-INTAKE:eyJuc...]\nÖrnek 3: [ENNEA-TOKEN:1=4,2=5,3=4,4=8,5=3|Melis Kaya]`}
            className="w-full px-3.5 py-3 bg-[#111] border border-[#222] focus:border-[#c4a47c] rounded-xl text-xs font-mono text-[#eee] placeholder-[#444] focus:outline-none custom-scrollbar"
          />
        </div>

        {/* Real-time Parsed Preview */}
        {parsed && (
          <div className="p-4 rounded-xl bg-[#0e120e] border border-emerald-500/40 space-y-3 font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-950">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>Tespit Edilen Danışan Verisi</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {parsed.kind === 'full_client' ? '✓ Tam Danışan Kaydı' : '✓ Enneagram Yanıtı'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#ccc] text-[11px]">
              <div>
                <span className="text-[#666] block">Danışan:</span>
                <span className="text-white font-medium">{parsed.name}</span>
              </div>
              {parsed.phone && (
                <div>
                  <span className="text-[#666] block">Telefon:</span>
                  <span className="text-white font-medium">{parsed.phone}</span>
                </div>
              )}
              {parsed.birthDate && (
                <div>
                  <span className="text-[#666] block">Doğum Tarihi & Yeri:</span>
                  <span className="text-white font-medium">{parsed.birthDate} • {parsed.birthPlace || 'Belirtilmedi'}</span>
                </div>
              )}
              {parsed.motherName && (
                <div>
                  <span className="text-[#666] block">Anne Adı:</span>
                  <span className="text-white font-medium">{parsed.motherName}</span>
                </div>
              )}
              {parsed.enneagramType && (
                <div>
                  <span className="text-[#666] block">Enneagram:</span>
                  <span className="text-[#c4a47c] font-medium">Tip {parsed.enneagramWing || parsed.enneagramType}</span>
                </div>
              )}
              {parsed.totemAnswers && (
                <div>
                  <span className="text-[#666] block">Totem Testi:</span>
                  <span className="text-emerald-400 font-medium">{Object.keys(parsed.totemAnswers).length} Soru Yanıtlandı</span>
                </div>
              )}
              {parsed.primaryTotemId && (
                <div>
                  <span className="text-[#666] block">Hesaplanan Totem:</span>
                  <span className="text-[#c4a47c] font-medium">
                    {getTotemAnimalById(parsed.primaryTotemId)?.name || parsed.primaryTotemId}
                    {parsed.totemConfidenceScore ? ` (%${parsed.totemConfidenceScore})` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1c1c1c]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2b2b2b] text-[#888] hover:text-white text-xs font-mono transition-all cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!parsed}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <Check className="w-4 h-4" />
            <span>Sisteme Kaydet & Ekle</span>
          </button>
        </div>

      </div>
    </div>
  );
};
