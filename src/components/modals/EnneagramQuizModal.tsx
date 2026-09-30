import React, { useEffect, useState } from 'react';
import { ENNEAGRAM_MINI_TEST_QUESTIONS, calculateEnneagramFromAnswers, ENNEAGRAM_TYPES } from '../../utils/enneagram';
import { HelpCircle, Check, X, ArrowRight, RotateCcw } from 'lucide-react';

interface EnneagramQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult: (type: number, wing: string, answers: Record<number, number>) => void;
  initialAnswers?: Record<number, number>;
}

export const EnneagramQuizModal: React.FC<EnneagramQuizModalProps> = ({
  isOpen,
  onClose,
  onApplyResult,
  initialAnswers = {}
}) => {
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers);

  useEffect(() => {
    if (isOpen) {
      setAnswers(initialAnswers);
      if (Object.keys(initialAnswers).length === ENNEAGRAM_MINI_TEST_QUESTIONS.length) {
        setResult(calculateEnneagramFromAnswers(initialAnswers));
      } else {
        setResult(null);
      }
    }
  }, [isOpen, initialAnswers]);
  const [result, setResult] = useState<{ type: number; wing: string } | null>(null);

  if (!isOpen) return null;

  const totalQuestions = ENNEAGRAM_MINI_TEST_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  const handleSelectOption = (questionId: number, typeNumber: number) => {
    const updated = { ...answers, [questionId]: typeNumber };
    setAnswers(updated);

    if (Object.keys(updated).length === totalQuestions) {
      const calculated = calculateEnneagramFromAnswers(updated);
      setResult(calculated);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
  };

  const handleConfirm = () => {
    if (result) {
      onApplyResult(result.type, result.wing, answers);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#c4a47c]" />
            <h3 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold">
              Enneagram Arketip Mini Testi
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

        <p className="text-[11px] text-[#777] font-mono leading-relaxed">
          Bu 5 soruluk test, dövme tasarımındaki gölge yönleri ve temel psikolojik motivasyonları doğru arketiple eşleştirmek için tasarlanmıştır. Doğum tarihinden bağımsızdır.
        </p>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[#666]">
            <span>İlerleme</span>
            <span>{answeredCount} / {totalQuestions} Soru</span>
          </div>
          <div className="h-1 bg-[#151515] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c4a47c] transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4 pt-1">
          {ENNEAGRAM_MINI_TEST_QUESTIONS.map((q, idx) => {
            const selectedType = answers[q.id];
            return (
              <div
                key={q.id}
                className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] space-y-2.5"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#c4a47c] bg-[#151515] px-1.5 py-0.5 rounded border border-[#222]">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-semibold text-white leading-snug">
                    {q.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-1.5 pl-6">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedType === opt.type;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.type)}
                        className={`text-left p-2.5 rounded text-xs transition-all border cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#c4a47c]/20 border-[#c4a47c] text-white font-medium'
                            : 'bg-[#111] border-[#1f1f1f] text-[#888] hover:text-[#e0e0e0] hover:border-[#333]'
                        }`}
                      >
                        <div className="flex-1">
                          <span className="block text-[11px] leading-relaxed">{opt.text}</span>
                          <span className="text-[9px] text-[#666] font-mono mt-0.5 block">{opt.description}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#c4a47c] shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Result Preview */}
        {result && (
          <div className="p-4 rounded-lg bg-[#14120c] border border-[#c4a47c]/40 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#c4a47c] font-bold">Hesaplanan Enneagram Profili:</span>
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-[#1f1a12] border border-[#c4a47c]/60">
                {result.wing}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {ENNEAGRAM_TYPES[result.type]?.typeName}
            </h4>
            <p className="text-[11px] text-[#aaa]">
              <strong className="text-[#888]">Temel İtici Güç:</strong> {ENNEAGRAM_TYPES[result.type]?.coreMotivation}
            </p>
            <p className="text-[11px] text-[#c4a47c]">
              <strong className="text-[#c4a47c]">Sembolik İfade:</strong> {ENNEAGRAM_TYPES[result.type]?.symbolicMeaning}
            </p>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-xs text-[#777] hover:text-[#bbb] flex items-center gap-1.5 cursor-pointer font-mono"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-xs text-[#aaa] cursor-pointer"
            >
              İptal
            </button>
            <button
              type="button"
              disabled={!isComplete}
              onClick={handleConfirm}
              className="px-4 py-1.5 rounded bg-[#c4a47c] hover:bg-[#b89569] disabled:opacity-40 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#c4a47c]/15"
            >
              <span>Sonucu Tasarıma Uygula</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
