import React, { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface SectionCopyButtonProps {
  label?: string;
  successMessage?: string;
  errorMessage?: string;
  onCopy: () => Promise<boolean> | boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'gold' | 'secondary' | 'outline' | 'ghost';
  showIconOnly?: boolean;
  title?: string;
  onFeedback?: (msg: string, isError?: boolean) => void;
}

export const SectionCopyButton: React.FC<SectionCopyButtonProps> = ({
  label = 'Kopyala',
  successMessage = 'Panoya kopyalandı.',
  errorMessage = '⚠️ Kopyalama başarısız oldu. Tarayıcı izinlerini kontrol edin.',
  onCopy,
  className = '',
  size = 'sm',
  variant = 'secondary',
  showIconOnly = false,
  title,
  onFeedback
}) => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await onCopy();
      if (result) {
        setStatus('success');
        if (onFeedback) onFeedback(successMessage, false);
        setTimeout(() => setStatus('idle'), 2500);
      } else {
        setStatus('error');
        if (onFeedback) onFeedback(errorMessage, true);
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Section copy error:', err);
      setStatus('error');
      if (onFeedback) onFeedback(errorMessage, true);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-xs'
  }[size];

  const variantClasses = {
    gold: 'bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold shadow-sm shadow-[#c4a47c]/20',
    secondary: 'bg-[#161616] hover:bg-[#222] border border-[#333] hover:border-[#c4a47c] text-[#ccc] hover:text-white',
    outline: 'bg-transparent hover:bg-white/5 border border-[#333] hover:border-[#c4a47c] text-[#aaa] hover:text-[#c4a47c]',
    ghost: 'bg-transparent hover:bg-white/10 text-[#888] hover:text-white'
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title || label}
      aria-label={title || label}
      className={`font-mono inline-flex items-center gap-1.5 rounded-lg transition-all cursor-pointer ${sizeClasses} ${variantClasses} ${
        status === 'success' ? '!border-emerald-500 !text-emerald-400 !bg-emerald-950/30' : ''
      } ${
        status === 'error' ? '!border-rose-500 !text-rose-400 !bg-rose-950/30' : ''
      } ${className}`}
    >
      {status === 'success' ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {!showIconOnly && <span className="text-emerald-400 font-bold">Kopyalandı</span>}
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          {!showIconOnly && <span className="text-rose-400 font-bold">Hata</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 shrink-0" />
          {!showIconOnly && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
