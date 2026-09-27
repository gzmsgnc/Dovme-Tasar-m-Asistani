import React from 'react';
import { NumerologyProfile, AstrologyProfile, NumerologyDetail } from '../../types';
import { X, HelpCircle, Calculator, Compass, Sparkles } from 'lucide-react';

interface CalculationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  numerology?: NumerologyProfile | null;
  astrology?: AstrologyProfile | null;
  initialTab?: 'numerology' | 'astrology';
}

export const CalculationDetailModal: React.FC<CalculationDetailModalProps> = ({
  isOpen,
  onClose,
  numerology,
  astrology,
  initialTab = 'numerology'
}) => {
  const [activeTab, setActiveTab] = React.useState<'numerology' | 'astrology'>(initialTab);

  if (!isOpen) return null;

  const renderDetailBlock = (title: string, detail?: NumerologyDetail) => {
    if (!detail) return null;
    return (
      <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white font-serif">{title}</span>
          <span className="text-xs font-mono font-bold text-[#c4a47c] px-2 py-0.5 rounded bg-[#16140e] border border-[#c4a47c]/40">
            Değer: {detail.value}
          </span>
        </div>
        
        <div className="p-2 rounded bg-[#111] border border-[#1f1f1f] text-[11px] font-mono text-[#c4a47c]">
          <span className="text-[#666] block text-[9px] uppercase">Kullanılan Pisagor Formülü:</span>
          {detail.formula}
        </div>

        <div className="space-y-1 pt-1">
          <span className="text-[9px] font-mono uppercase text-[#666] block">Adım Adım Hesaplama Akışı:</span>
          <ul className="space-y-1 text-[11px] text-[#aaa] font-mono">
            {(Array.isArray(detail.stepByStep) 
              ? detail.stepByStep 
              : typeof detail.stepByStep === 'string' 
                ? detail.stepByStep.split('\n').filter(Boolean)
                : []
            ).map((step, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#c4a47c] text-[10px]">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#c4a47c]" />
            <h3 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold">
              Deterministik Hesaplama Detayları & Formüller
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#181818] text-[#777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#1a1a1a]">
          <button
            type="button"
            onClick={() => setActiveTab('numerology')}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'numerology'
                ? 'border-[#c4a47c] text-[#c4a47c] font-bold'
                : 'border-transparent text-[#666] hover:text-[#bbb]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Numeroloji Pisagor Matrisi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('astrology')}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'astrology'
                ? 'border-[#c4a47c] text-[#c4a47c] font-bold'
                : 'border-transparent text-[#666] hover:text-[#bbb]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Astrolojik Doğruluk & Yükselen</span>
          </button>
        </div>

        {/* Numerology Tab Content */}
        {activeTab === 'numerology' && numerology && (
          <div className="space-y-3 pt-1">
            <p className="text-[11px] text-[#777] font-mono">
              Tüm numeroloji değerleri standart Pisagor harf-sayı matrisi (A=1, B=2 ... Z=8) ve doğum tarihi dijital kök indirgemesiyle kesin deterministik olarak hesaplanmıştır.
            </p>

            {renderDetailBlock('Yaşam Yolu (Life Path Number)', numerology.calculations?.lifePath)}
            {renderDetailBlock('Ana Kulvar / Kader Sayısı (Destiny Number)', numerology.calculations?.destiny)}
            {renderDetailBlock('Yan Kulvar / Ruh Güdüsü (Soul Urge)', numerology.calculations?.soulUrge)}
            {renderDetailBlock('Kişilik / Dış İzlenim Sayısı (Personality)', numerology.calculations?.personality)}
            {renderDetailBlock('Dünya Misyonu (DM Number)', numerology.calculations?.dm)}
            {renderDetailBlock('19 İlahi Yardım Tılsımı', numerology.calculations?.divineHelp19)}
            {renderDetailBlock('Eksik Sayılar & Çakra Dağılımı', numerology.calculations?.missingNumbers)}
          </div>
        )}

        {/* Astrology Tab Content */}
        {activeTab === 'astrology' && astrology && (
          <div className="space-y-3 pt-1">
            {/* Input parameters info */}
            <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-serif">Gerçek Astronomik Efemeris Parametreleri</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181818] border border-[#333] text-[#c4a47c]">
                  {astrology.zodiacSystem === 'Tropical' ? 'Batı / Tropikal Zodyak' : 'Vedik / Sideral (Lahiri)'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-[#aaa] pt-1">
                <div>
                  <span className="text-[#666] block text-[9px]">Doğum Tarihi:</span>
                  <span className="text-white">{astrology.usedBirthDate}</span>
                </div>
                <div>
                  <span className="text-[#666] block text-[9px]">Doğum Saati:</span>
                  <span className="text-white">{astrology.usedBirthTime}</span>
                </div>
                <div>
                  <span className="text-[#666] block text-[9px]">Doğum Yeri & Koord:</span>
                  <span className="text-white text-[10px]">{astrology.usedBirthPlace}</span>
                </div>
                <div>
                  <span className="text-[#666] block text-[9px]">Julian Günü (JD):</span>
                  <span className="text-[#c4a47c]">{astrology.astronomicalDetails?.julianDay.toFixed(3) || 'Hesaplandı'}</span>
                </div>
              </div>

              {astrology.astronomicalDetails && (
                <div className="pt-2 border-t border-[#1a1a1a] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-[#888]">
                  <div>UT Saati: <span className="text-white">{astrology.astronomicalDetails.utTime}</span></div>
                  <div>Yerel Yıldız Saati: <span className="text-white">{astrology.astronomicalDetails.localSiderealTime}</span></div>
                  <div>Greenwich GMST: <span className="text-white">{astrology.astronomicalDetails.greenwichMeanSiderealTime}</span></div>
                  <div>Ekliptik Eğiklik: <span className="text-white">{astrology.astronomicalDetails.obliquity.toFixed(3)}°</span></div>
                </div>
              )}

              {astrology.ayanamsaDegrees && (
                <div className="text-[10px] font-mono text-cyan-300/80 bg-cyan-950/20 px-2 py-1 rounded border border-cyan-900/30">
                  ✦ Lahiri Ayanamsa Kayması: {astrology.ayanamsaDegrees.toFixed(3)}° (Tropikal ekliptikten çıkartıldı)
                </div>
              )}

              {astrology.ascendantWarning && (
                <div className="p-2 rounded bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300 font-mono">
                  ⚠️ {astrology.ascendantWarning}
                </div>
              )}
            </div>

            {/* Moon Cusp Ingress Alert if applicable */}
            {astrology.isMoonNearCusp && astrology.moonCuspMessage && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <span>⚠️</span>
                  <span>Ay Burç Değişim Eşiğinde (Anaretik / Cusp Derecesi)</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed font-mono">
                  {astrology.moonCuspMessage}
                </p>
              </div>
            )}

            {/* Signs overview with exact degrees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-xs">
                <span className="text-[#666] text-[10px] font-mono uppercase block">Güneş Boylamı (Güneş Burcu)</span>
                <span className="text-[#c4a47c] font-bold font-serif text-sm block mt-0.5">
                  {astrology.sunDegreeFormatted} ({astrology.sunSignSymbol})
                </span>
                <span className="text-[10px] text-[#777] block mt-1 font-mono">Ekliptik Boylam: {astrology.sunLongitude.toFixed(2)}°</span>
              </div>

              <div className={`p-3 rounded-lg bg-[#0d0d0d] border text-xs ${astrology.isMoonNearCusp ? 'border-amber-500/50 bg-amber-950/10' : 'border-[#1a1a1a]'}`}>
                <span className="text-[#666] text-[10px] font-mono uppercase block">Ay Boylamı (Jean Meeus Efemerisi)</span>
                <span className="text-white font-bold font-serif text-sm block mt-0.5">
                  {astrology.moonDegreeFormatted} ({astrology.moonSignSymbol})
                </span>
                <span className="text-[10px] text-[#777] block mt-1 font-mono">
                  Ekliptik Boylam: {astrology.moonLongitude.toFixed(2)}°
                  {astrology.isMoonNearCusp && <span className="text-amber-400 font-bold ml-1">(Eşikte)</span>}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-xs">
                <span className="text-[#666] text-[10px] font-mono uppercase block">Yükselen Burç (ASC / Ufuk)</span>
                <span className="text-white font-bold font-serif text-sm block mt-0.5">
                  {astrology.ascendantDegreeFormatted} ({astrology.ascendantSignSymbol})
                </span>
                <span className="text-[10px] text-[#777] block mt-1 font-mono">Ufuk Açısı: {astrology.ascendantLongitude.toFixed(2)}°</span>
              </div>
            </div>

            {/* Element & Modality details */}
            <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-xs space-y-2">
              <span className="text-xs font-bold text-white">Element ve Nitelik Dengesi</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#aaa]">
                <div>Baskın Element: <strong className="text-[#c4a47c]">{astrology.dominantElement}</strong></div>
                <div>Nitelik: <strong className="text-white">{astrology.sunSignModality}</strong></div>
                <div>Yönetici Gezegen: <strong className="text-white">{astrology.rulingPlanet}</strong></div>
                <div>Mitolojik Arketip: <strong className="text-white">{astrology.archetype}</strong></div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[#1a1a1a] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#151515] hover:bg-[#222] border border-[#333] text-xs text-white cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
