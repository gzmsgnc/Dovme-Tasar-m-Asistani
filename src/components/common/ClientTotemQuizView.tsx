import React, { useState, useEffect } from 'react';
import { 
  TOTEM_BEHAVIORAL_QUESTIONS, 
  calculateBehavioralTotemResult, 
  TotemTestCalculationResult 
} from '../../utils/behavioralTotemEngine';
import { 
  generateClientReturnWhatsAppTotemMessage, 
  encodeTotemAnswersToToken, 
  generateWhatsAppShareLink 
} from '../../utils/totemSharing';
import { postClientQuizToServer } from '../../utils/storage';
import { 
  Compass, 
  Check, 
  Send, 
  Copy, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

interface ClientTotemQuizViewProps {
  clientName?: string;
  onReturnToStudio?: () => void;
  onCompletedAnswers?: (answers: Record<number, string>, result: TotemTestCalculationResult) => void;
}

export const ClientTotemQuizView: React.FC<ClientTotemQuizViewProps> = ({
  clientName = 'Değerli Danışanımız',
  onReturnToStudio,
  onCompletedAnswers
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [serverSaved, setServerSaved] = useState<boolean>(false);

  const totalQuestions = TOTEM_BEHAVIORAL_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  // En az 3 soru yanıtlandığında anlık hesaplama yapılır
  const calculationResult: TotemTestCalculationResult | null = 
    answeredCount >= 3 ? calculateBehavioralTotemResult(answers) : null;

  // Test bittiğinde stüdyo sunucusuna sessizce kaydet
  useEffect(() => {
    if (isComplete && !serverSaved && calculationResult) {
      postClientQuizToServer({
        clientName: clientName || 'Danışan',
        answers: answers as any
      }).then(res => {
        if (res.success) {
          setServerSaved(true);
        }
      }).catch(err => {
        console.warn('Silent totem quiz post error:', err);
      });

      if (onCompletedAnswers) {
        onCompletedAnswers(answers, calculationResult);
      }
    }
  }, [isComplete, answers, clientName, serverSaved, calculationResult, onCompletedAnswers]);

  const handleSelectOption = (questionId: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleReset = () => {
    setAnswers({});
    setCopiedToken(false);
  };

  const returnMessage = isComplete && calculationResult 
    ? generateClientReturnWhatsAppTotemMessage(answers, clientName, calculationResult) 
    : '';
  const token = isComplete 
    ? encodeTotemAnswersToToken(answers, clientName) 
    : '';

  const handleSendWhatsApp = () => {
    if (returnMessage) {
      const link = generateWhatsAppShareLink('', returnMessage);
      const a = document.createElement('a');
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#e0e0e0] font-sans selection:bg-[#c4a47c]/30 selection:text-[#c4a47c] p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Top Bar with Return button */}
        <div className="flex items-center justify-between">
          {onReturnToStudio && (
            <button
              type="button"
              onClick={onReturnToStudio}
              className="py-1.5 px-3 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] text-xs text-[#aaa] hover:text-white flex items-center gap-1.5 font-mono cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Stüdyo / Tasarım Paneline Dön</span>
            </button>
          )}
          <div className="text-[10px] font-mono text-[#c4a47c] uppercase tracking-widest ml-auto">
            Ezoterik Dövme Stüdyosu • Ruh Totemi Portalı
          </div>
        </div>

        {/* Hero Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#14120b] to-[#0c0c0c] border border-[#c4a47c]/30 shadow-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1a10] border border-[#c4a47c]/40 text-[#c4a47c] text-xs font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>52 Kadim Hayvan Arketipi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {clientName} için Davranışsal Ruh Totemi Testi
          </h1>
          <p className="text-xs sm:text-sm text-[#aaa] max-w-lg mx-auto leading-relaxed">
            Bu test hayvan isimlerini doğrudan sormaz. Kriz, yalnızlık, tehdit ve karar anlarındaki gerçek içsel reflekslerinizi 20 boyutta analiz ederek size en yakın kadim rehber hayvanları ortaya çıkarır.
          </p>

          {/* Progress */}
          <div className="pt-2 max-w-md mx-auto space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-[#888]">
              <span>İlerleme Durumu</span>
              <span className="text-[#c4a47c] font-bold">{answeredCount} / {totalQuestions} Soru Tamamlandı</span>
            </div>
            <div className="h-1.5 bg-[#181818] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#b89569] to-[#c4a47c] transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {TOTEM_BEHAVIORAL_QUESTIONS.map((q, idx) => {
            const selectedOpt = answers[q.id];
            return (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-xl bg-[#0d0d0d] border border-[#1c1c1c] space-y-3 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-[#c4a47c] bg-[#1a1710] px-2 py-1 rounded border border-[#c4a47c]/30 shrink-0">
                    Soru {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {q.question}
                    </h3>
                    <span className="text-[10px] text-[#666] font-mono block mt-0.5">
                      {q.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1 pl-0 sm:pl-9">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === opt.id;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`text-left p-3 rounded-lg text-xs transition-all border cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#18140c] border-[#c4a47c] text-white shadow-md shadow-[#c4a47c]/10'
                            : 'bg-[#121212] border-[#202020] text-[#888] hover:text-[#eee] hover:border-[#333]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            isSelected ? 'bg-[#c4a47c] text-black' : 'bg-[#1a1a1a] text-[#777]'
                          }`}>
                            {letter}
                          </span>
                          <span className="block text-xs sm:text-[13px] leading-relaxed text-zinc-200">
                            {opt.text}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#c4a47c] shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Completed Result & Send Buttons */}
        {isComplete && calculationResult && (
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#14120b] to-[#0a0a0a] border-2 border-[#c4a47c] shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#c4a47c]/30 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#c4a47c] font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Tebrikler! Ruh Toteminiz Belirlendi
              </span>
              <span className="text-xs font-mono font-bold text-black px-2.5 py-1 rounded bg-[#c4a47c]">
                %{calculationResult.confidenceScore} Uyum
              </span>
            </div>

            {/* Primary Totem */}
            <div className="p-4 rounded-xl bg-[#111116] border border-[#c4a47c]/40 space-y-2">
              <span className="text-[10px] font-mono text-[#c4a47c] uppercase tracking-wider block font-bold">
                ★ BİRİNCİL RUH TOTEMİ
              </span>
              <h2 className="text-xl font-bold text-white font-serif">
                {calculationResult.primaryTotem.name}
              </h2>
              <p className="text-xs text-[#888] font-mono">
                {calculationResult.primaryTotem.turkishName} • {calculationResult.primaryTotem.element} Elementi • {calculationResult.primaryTotem.realm}
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                {calculationResult.primaryTotem.mainSymbolism}
              </p>
              <div className="pt-1 text-[11px] text-[#aaa]">
                <strong className="text-[#c4a47c]">Güçlü Yön:</strong> {calculationResult.primaryTotem.strongSide}
              </div>
            </div>

            {/* Allies & Shadows Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0e0e12] border border-[#222230] space-y-1">
                <span className="text-[10px] font-mono text-[#c4a47c] uppercase tracking-wider block font-bold">
                  ◆ İkincil Müttefik
                </span>
                <h4 className="text-sm font-bold text-white font-serif">
                  {calculationResult.secondaryTotem.name}
                </h4>
                <p className="text-[11px] text-[#888] font-mono">
                  {calculationResult.secondaryTotem.turkishName} • {calculationResult.secondaryTotem.element}
                </p>
                <p className="text-[11px] text-[#aaa] leading-relaxed pt-0.5">
                  {calculationResult.secondaryTotem.mainSymbolism}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e0e12] border border-purple-950/40 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Gölge & Koruyucu
                </span>
                <h4 className="text-sm font-bold text-white font-serif">
                  {calculationResult.shadowTotem.name}
                </h4>
                <p className="text-[11px] text-[#888] font-mono">
                  {calculationResult.shadowTotem.turkishName} • {calculationResult.shadowTotem.element}
                </p>
                <p className="text-[11px] text-[#aaa] leading-relaxed pt-0.5">
                  {calculationResult.shadowTotem.protectivePower} ({calculationResult.shadowTotem.shadowTrait})
                </p>
              </div>
            </div>

            {/* Actions for customer */}
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#aaa]">
                  Sonuçları Dövme Sanatçınıza İletin:
                </span>
                {serverSaved && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Stüdyo Sistemine İletildi</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Cevaplarımı WhatsApp ile Sanatçıma Gönder</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="py-3 px-4 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-xs text-white font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToken ? 'Kod Kopyalandı!' : 'Aktarım Kodunu Kopyala'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center text-[10px] text-[#666] font-mono pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Testi Baştan Çöz</span>
                </button>
                <span className="truncate max-w-[200px]" title={token}>Kod: {token}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
