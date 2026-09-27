import React, { useState } from 'react';
import { X, Copy, Check, Binary, Sparkles, Sliders } from 'lucide-react';
import { encodeToMorse, generateClientMorsePresets, MorseEncodeResult } from '../../utils/morseCode';

interface MorseCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthDate?: string;
  lifePathNumber?: number;
  personalNumbers?: string;
  dmNumber?: number;
  clientName?: string;
  onApplyToDesign?: (morseResult: MorseEncodeResult) => void;
}

export const MorseCodeModal: React.FC<MorseCodeModalProps> = ({
  isOpen,
  onClose,
  birthDate = '',
  lifePathNumber,
  personalNumbers = '',
  dmNumber,
  clientName = '',
  onApplyToDesign
}) => {
  const presets = generateClientMorsePresets(birthDate, lifePathNumber, personalNumbers, dmNumber, clientName);
  
  const [customInput, setCustomInput] = useState<string>(
    presets[0]?.raw || (birthDate ? birthDate.split('-').reverse().join('.') : '24.11.1991')
  );
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentResult = encodeToMorse(customInput);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleApply = () => {
    if (onApplyToDesign) {
      onApplyToDesign(currentResult);
      setAppliedSuccess(true);
      setTimeout(() => {
        setAppliedSuccess(false);
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
            <Binary className="w-4 h-4 text-[#c4a47c]" />
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold">
                Mors Alfabesi & Kutsal Rakam Şifreleme Stüdyosu
              </h3>
              <p className="text-[10px] text-[#666] font-mono mt-0.5">
                Rakamları kaba Latin tipografisi yerine zarif Fine-Line & Micro-Dotwork çizgilerine dönüştürün
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

        {/* Hazır Danışan Verisi Şablonları */}
        {presets.length > 0 && (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-[#777] font-mono font-bold block">
              Danışanın Verilerinden Hazır Rakam Şablonları:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset, idx) => {
                const isSelected = customInput === preset.raw;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomInput(preset.raw)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#18150e] border-[#c4a47c] shadow-sm shadow-[#c4a47c]/20'
                        : 'bg-[#111] border-[#1e1e1e] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">{preset.title}</span>
                      <span className="text-[10px] font-mono text-[#c4a47c] font-bold">{preset.raw}</span>
                    </div>
                    <span className="text-[9px] text-[#666] font-mono mt-1 block truncate">
                      {preset.result.morseDisplay}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Özel Metin / Rakam Girişi */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#777] font-mono font-bold block flex items-center justify-between">
            <span>Şifrelenecek Rakam / Tarih / Koordinat / İsim:</span>
            <span className="text-[#666] text-[9px]">Tarih, saat veya özel koordinat girebilirsiniz</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Örn: 24.11.1991, 19, 41.0082 N 28.9784 E"
              className="flex-1 px-3 py-2 bg-[#121212] border border-[#222] rounded-lg text-xs text-white font-mono focus:border-[#c4a47c] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setCustomInput('')}
              className="px-2.5 py-2 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] text-xs text-[#777] hover:text-[#bbb] border border-[#222] font-mono cursor-pointer"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Görsel Mors Dövme Şeridi Önizleme (Visual Tattoo Strip Preview) */}
        {currentResult.rawInput && (
          <div className="p-4 rounded-xl bg-[#111] border border-[#222] space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#c4a47c] font-mono font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Dövme İçin Görsel Mors Çizim Şeridi (Fine-Line & Micro Dotwork)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentResult.morseDisplay, 'visual')}
                className="text-[10px] font-mono text-[#aaa] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedType === 'visual' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'visual' ? 'Kopyalandı' : 'Karakterleri Kopyala'}</span>
              </button>
            </div>

            {/* Stylized Visual Tattoo Strip */}
            <div className="p-4 rounded-lg bg-[#080808] border border-white/10 flex flex-wrap items-center justify-center gap-1.5 min-h-[50px]">
              {currentResult.tokens.map((tok, i) => {
                if (tok.type === 'dot') {
                  return (
                    <span
                      key={i}
                      title="Nokta (03RL Micro-Dot)"
                      className="w-2.5 h-2.5 rounded-full bg-[#c4a47c] inline-block shadow-sm shadow-[#c4a47c]/30"
                    />
                  );
                } else if (tok.type === 'dash') {
                  return (
                    <span
                      key={i}
                      title="Çizgi (03RL Fine-Line Çubuk 1.5mm)"
                      className="w-6 h-2 rounded bg-zinc-200 inline-block shadow-sm shadow-white/20"
                    />
                  );
                } else if (tok.type === 'char-space') {
                  return <span key={i} className="w-2 inline-block" />;
                } else {
                  return (
                    <span key={i} className="text-[#666] font-mono font-bold px-1.5 text-xs">
                      /
                    </span>
                  );
                }
              })}
            </div>

            {/* Metin & Standart Mors Karşılığı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#161616] border border-[#222]">
                <span className="text-[9px] text-[#666] uppercase block">Metin / Rakam Girdisi:</span>
                <span className="text-white font-bold text-sm">{currentResult.rawInput}</span>
              </div>
              <div className="p-2.5 rounded bg-[#161616] border border-[#222]">
                <span className="text-[9px] text-[#666] uppercase block">Dövme Tipografisi:</span>
                <span className="text-[#c4a47c] font-bold text-sm tracking-wider">{currentResult.morseDisplay}</span>
              </div>
            </div>

            {/* Dövme Teknik Uygulama Direktifleri */}
            <div className="p-3 rounded-lg bg-[#14120a] border border-[#c4a47c]/30 text-[10px] text-[#d4c5b3] font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[#c4a47c] font-bold">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3" /> Dövme Sanatçısı Teknik İğne & Uygulama Kılavuzu:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(currentResult.tattooSpecification, 'specs')}
                  className="text-[9px] underline hover:text-white cursor-pointer"
                >
                  {copiedType === 'specs' ? 'Kılavuz Kopyalandı' : 'Kılavuzu Kopyala'}
                </button>
              </div>
              <p className="leading-relaxed text-[#aaa]">
                • <strong>Noktalar (•):</strong> 03RL iğneyle tek vuruş micro-dotwork stippling (0.35mm).<br />
                • <strong>Çizgiler (—):</strong> 03RL veya 05RL ile 1.5mm uzunluğunda fine-line çizgi.<br />
                • <strong>Boşluk Güvenliği:</strong> Nokta/çizgi aralarında min 1mm açık deri boşluğu bırakılarak 10 yıllık pigment birleşmesi (blowout) önlenir.<br />
                • <strong>Yerleşim Önerisi:</strong> Kutsal geometrik dairenin dış çemberine kavisli olarak veya dikey omurga/kol çizgisine paralel.
              </p>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-xs text-[#aaa] cursor-pointer"
          >
            Kapat
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(currentResult.morseStandard, 'standard')}
              className="px-3 py-1.5 rounded bg-[#151515] hover:bg-[#202020] border border-[#2a2a2a] text-xs text-[#ccc] flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedType === 'standard' ? 'Kopyalandı' : 'Standart Mors Kopyala'}</span>
            </button>

            {onApplyToDesign && (
              <button
                type="button"
                disabled={!currentResult.rawInput}
                onClick={handleApply}
                className="px-4 py-1.5 rounded bg-[#c4a47c] hover:bg-[#b89569] disabled:opacity-40 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#c4a47c]/20"
              >
                {appliedSuccess ? <Check className="w-3.5 h-3.5 text-black" /> : <Sparkles className="w-3.5 h-3.5 text-black" />}
                <span>{appliedSuccess ? 'Tasarıma Uygulandı!' : 'Tasarıma Şifre Olarak Ekle'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
