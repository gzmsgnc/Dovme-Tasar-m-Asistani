import React, { useState, useEffect } from 'react';
import { 
  TOTEM_BEHAVIORAL_QUESTIONS, 
  calculateBehavioralTotemResult, 
  TotemTestCalculationResult 
} from '../../utils/behavioralTotemEngine';
import { 
  Compass, 
  Check, 
  X, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Layers,
  HelpCircle
} from 'lucide-react';

interface TotemQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult: (answers: Record<number, string>, result: TotemTestCalculationResult) => void;
  initialAnswers?: Record<number, string>;
  enneagramType?: number;
  clientName?: string;
}

export const TotemQuizModal: React.FC<TotemQuizModalProps> = ({
  isOpen,
  onClose,
  onApplyResult,
  initialAnswers = {},
  enneagramType = 4,
  clientName
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);
  const [result, setResult] = useState<TotemTestCalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'result'>('questions');

  useEffect(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
      if (Object.keys(initialAnswers).length >= 5) {
        const calculated = calculateBehavioralTotemResult(initialAnswers, enneagramType);
        setResult(calculated);
      }
    } else {
      setAnswers({});
      setResult(null);
      setActiveTab('questions');
    }
  }, [initialAnswers, isOpen, enneagramType]);

  if (!isOpen) return null;

  const totalQuestions = TOTEM_BEHAVIORAL_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  const handleSelectOption = (questionId: number, optionId: string) => {
    const updated = { ...answers, [questionId]: optionId };
    setAnswers(updated);

    // Otomatik hesaplama (her seçimde güncellenir)
    if (Object.keys(updated).length >= 5) {
      const calculated = calculateBehavioralTotemResult(updated, enneagramType);
      setResult(calculated);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setActiveTab('questions');
  };

  const handleConfirmAndApply = () => {
    if (result) {
      onApplyResult(answers, result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0a0a0c] border border-[#22222a] rounded-2xl max-w-3xl w-full p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a24] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c4a47c]/10 border border-[#c4a47c]/30 flex items-center justify-center text-[#c4a47c]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold flex items-center gap-2">
                <span>Davranışsal Ruh Totemi Testi</span>
                {clientName && <span className="text-[#888] font-normal">• {clientName}</span>}
              </h3>
              <p className="text-[11px] text-[#777] font-mono">
                15 Senaryo Odaklı Davranış Sorusu • 52 Kadim Hayvan Kütüphanesi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#181820] text-[#777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs (Eğer en az 5 soru yanıtlandıysa sonuç sekmesi açılır) */}
        <div className="flex items-center justify-between gap-2 border-b border-[#161620] pb-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-[#c4a47c]/15 text-[#c4a47c] border border-[#c4a47c]/40'
                  : 'text-[#666] hover:text-white'
              }`}
            >
              Sorular ({answeredCount}/{totalQuestions})
            </button>
            {result && (
              <button
                type="button"
                onClick={() => setActiveTab('result')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'result'
                    ? 'bg-[#c4a47c] text-black font-bold'
                    : 'text-[#c4a47c] hover:bg-[#161620] border border-[#c4a47c]/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analiz Sonucu: {result.primaryTotem.name} (%{result.confidenceScore})</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-[#666] hover:text-[#999] flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[#666]">
            <span>İlerleme Seviyesi</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}% Tamamlandı</span>
          </div>
          <div className="h-1.5 bg-[#14141c] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c4a47c] to-[#e6ca9f] transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions Tab Content */}
        {activeTab === 'questions' && (
          <div className="space-y-4 pt-1">
            <div className="p-3 rounded-xl bg-[#0e0e14] border border-[#1c1c28] text-[11px] text-[#888] font-mono leading-relaxed">
              ✦ Bu test, hayvan isimlerini doğrudan sormaz. Kişinin kriz, tehdit, yalnızlık, liderlik ve özgürlük anlarındaki gerçek davranış reflekslerini 20 bağımsız boyutta ölçer ve 52 kadim hayvan profiliyle en yüksek matematiksel uyumu çıkarır.
            </div>

            <div className="space-y-4">
              {TOTEM_BEHAVIORAL_QUESTIONS.map((q, idx) => {
                const selectedOpt = answers[q.id];
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedOpt 
                        ? 'bg-[#0d0d12] border-[#c4a47c]/30 shadow-md' 
                        : 'bg-[#0a0a0e] border-[#181822]'
                    } space-y-3`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="text-[10px] font-mono font-bold text-[#c4a47c] bg-[#14141e] px-2 py-0.5 rounded border border-[#2a2a3a]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#777] font-mono block">
                            {q.category}
                          </span>
                          <p className="text-xs font-semibold text-white leading-snug mt-0.5">
                            {q.question}
                          </p>
                        </div>
                      </div>
                      {selectedOpt && (
                        <span className="p-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => {
                        const isSelected = selectedOpt === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`p-3 rounded-lg text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#c4a47c]/15 border border-[#c4a47c] text-white shadow-sm'
                                : 'bg-[#12121a]/70 hover:bg-[#161622] border border-[#1f1f2c] text-[#aaa] hover:text-[#ddd]'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono mt-0.5 ${
                              isSelected ? 'bg-[#c4a47c] text-black font-bold' : 'bg-[#181824] text-[#666]'
                            }`}>
                              {opt.id.slice(-1).toUpperCase()}
                            </span>
                            <span className="leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#1a1a24] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-[#777]">
                {isComplete ? (
                  <span className="text-emerald-400 font-bold">✓ 15 sorunun tamamı yanıtlandı!</span>
                ) : (
                  <span>Analiz için en az 5 soru yanıtlamanız yeterlidir (Önerilen: 15).</span>
                )}
              </div>

              {result && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('result')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#161622] border border-[#c4a47c]/40 text-[#c4a47c] hover:bg-[#1c1c2a] text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Analizi Görüntüle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmAndApply}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#c4a47c] hover:bg-[#b89569] text-black text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#c4a47c]/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Profile Uygula</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result Tab Content */}
        {activeTab === 'result' && result && (
          <div className="space-y-5 pt-1">
            {/* Primary Totem Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121218] via-[#0d0d12] to-[#09090c] border border-[#c4a47c]/50 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-[#c4a47c]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222230] pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#c4a47c] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Birincil Ruh Totemi (Primary Life Totem)</span>
                  </span>
                  <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                    {result.primaryTotem.name}
                  </h4>
                  <span className="text-xs text-[#888] font-mono">
                    {result.primaryTotem.turkishName} • {result.primaryTotem.element} Elementi • {result.primaryTotem.realm}
                  </span>
                </div>

                <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                  <span className="text-2xl font-serif font-extrabold text-[#c4a47c]">
                    %{result.confidenceScore}
                  </span>
                  <span className="text-[10px] text-[#666] font-mono">Matematiksel Uyum</span>
                </div>
              </div>

              {/* Proximity / Ambiguity Notice */}
              {result.isProximityClose && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs font-mono space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Yüksek Profil Yakınlığı (Çok Boyutlu Denge):</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    İkincil arketipiniz olan <strong>{result.secondaryTotem.name}</strong> ile fark yalnızca %{result.proximityDifference}'dir. Bu durum, danışanın hem {result.primaryTotem.name} hem de {result.secondaryTotem.name} arketiplerini yüksek esneklikle sentezleyebildiğini gösterir.
                  </p>
                </div>
              )}

              {/* Symbolism & Traits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#14141e] border border-[#222232] space-y-1">
                  <span className="text-[10px] font-mono text-[#c4a47c] uppercase tracking-wider block font-bold">
                    Ana Sembolizm & Işık Gücü
                  </span>
                  <p className="text-[#ccc] leading-relaxed">
                    {result.primaryTotem.mainSymbolism}
                  </p>
                  <p className="text-[11px] text-[#888] pt-1">
                    <strong>Güçlü Yön:</strong> {result.primaryTotem.strongSide}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#14141e] border border-[#222232] space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">
                    Gölge Yüz & Dönüşüm Kapısı
                  </span>
                  <p className="text-[#ccc] leading-relaxed">
                    {result.primaryTotem.shadowTrait}
                  </p>
                  <p className="text-[11px] text-[#888] pt-1">
                    <strong>Dengesiz Refleks:</strong> {result.primaryTotem.unbalancedBehavior}
                  </p>
                </div>
              </div>

              {/* Tattoo Specs */}
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#1f1f2e] text-xs space-y-1.5">
                <span className="text-[10px] font-mono text-[#c4a47c] uppercase tracking-wider block font-bold">
                  Dövme Anatomisi & Kompozisyon Rolü
                </span>
                <p className="text-[#bbb] leading-relaxed">
                  {result.primaryTotem.tattooPhysicalFeature}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[#888] pt-1">
                  <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#2a2a3a]">
                    Bakış: {result.primaryTotem.gazeDirection}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#2a2a3a]">
                    Duruş: {result.primaryTotem.posture}
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary & Shadow Totems Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Secondary Totem */}
              <div className="p-4 rounded-xl bg-[#0c0c12] border border-[#1e1e2c] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c4a47c] font-bold flex items-center gap-1">
                  <span>◆</span>
                  <span>İkincil Ruhani Müttefik</span>
                </span>
                <h5 className="text-base font-serif font-bold text-white">
                  {result.secondaryTotem.name}
                </h5>
                <p className="text-[11px] text-[#888] font-mono">
                  {result.secondaryTotem.turkishName} • {result.secondaryTotem.element}
                </p>
                <p className="text-xs text-[#aaa] leading-relaxed pt-1">
                  {result.secondaryTotem.mainSymbolism}
                </p>
              </div>

              {/* Shadow Guardian Totem */}
              <div className="p-4 rounded-xl bg-[#0c0c12] border border-purple-900/40 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Gölge & Bilinçdışı Muhafızı</span>
                </span>
                <h5 className="text-base font-serif font-bold text-white">
                  {result.shadowTotem.name}
                </h5>
                <p className="text-[11px] text-[#888] font-mono">
                  {result.shadowTotem.turkishName} • {result.shadowTotem.element}
                </p>
                <p className="text-xs text-[#aaa] leading-relaxed pt-1">
                  {result.shadowTotem.protectivePower} ({result.shadowTotem.shadowTrait})
                </p>
              </div>
            </div>

            {/* Top 5 Ranked Matches */}
            <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#1a1a26] space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#888] block font-bold">
                Kütüphanedeki En Yüksek 5 Hayvan Uyumu
              </span>
              <div className="space-y-1.5">
                {result.topMatches.slice(0, 5).map((match, rank) => (
                  <div key={match.animal.id} className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-[#111118] border border-[#1b1b26]">
                    <span className="flex items-center gap-2">
                      <span className="text-[#666] font-bold">#{rank + 1}</span>
                      <span className="text-white font-serif">{match.animal.name}</span>
                      <span className="text-[10px] text-[#666]">({match.animal.element})</span>
                    </span>
                    <span className="font-bold text-[#c4a47c]">%{match.similarityScore}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross Enneagram Insight */}
            <div className="p-4 rounded-xl bg-[#11111a] border border-[#232334] text-xs space-y-1.5 font-mono">
              <span className="text-[10px] uppercase tracking-wider text-[#c4a47c] font-bold block">
                Çapraz Analiz (Enneagram Tip {enneagramType} & {result.primaryTotem.name})
              </span>
              <p className="text-[#aaa] leading-relaxed">
                {result.crossEnneagramInsight}
              </p>
            </div>

            {/* Apply Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className="px-4 py-2.5 rounded-xl border border-[#333] hover:border-[#666] text-[#aaa] text-xs font-mono cursor-pointer"
              >
                Sorulara Geri Dön
              </button>
              <button
                type="button"
                onClick={handleConfirmAndApply}
                className="px-6 py-2.5 rounded-xl bg-[#c4a47c] hover:bg-[#b89569] text-black text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-lg shadow-[#c4a47c]/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Bu Sonuçları Danışan Profiline Kaydet</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
