import React, { useState } from 'react';
import { TattooRecipe } from '../../types';
import { exportRecipeToPDF } from '../../utils/pdfExport';
import { FileText, Check, Loader2 } from 'lucide-react';

interface PDFExportButtonProps {
  recipe: TattooRecipe;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact' | 'iconOnly';
  label?: string;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  recipe,
  className = '',
  variant = 'primary',
  label
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExporting) return;

    setIsExporting(true);
    setProgressStatus('Hazırlanıyor...');

    const success = await exportRecipeToPDF(recipe, (status) => {
      setProgressStatus(status);
    });

    setIsExporting(false);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setProgressStatus('');
      }, 3000);
    } else {
      setProgressStatus('Hata oluştu');
      setTimeout(() => setProgressStatus(''), 3000);
    }
  };

  if (variant === 'iconOnly') {
    return (
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        title={isExporting ? progressStatus : 'Şık PDF Konsültasyon Dosyası İndir'}
        className={`p-2 rounded-lg transition-all cursor-pointer ${
          isSuccess
            ? 'bg-emerald-950/50 border border-emerald-500/50 text-emerald-400'
            : 'bg-[#141416] hover:bg-[#1f1f24] border border-[#2a2a33] text-[#c4a47c] hover:border-[#c4a47c]'
        } ${className}`}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#c4a47c]" />
        ) : isSuccess ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className={`py-1.5 px-3 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
          isSuccess
            ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-300'
            : 'bg-[#15151c] hover:bg-[#20202a] border border-[#2e2e3d] text-[#c4a47c] hover:border-[#c4a47c]'
        } ${className}`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c4a47c]" />
            <span>{progressStatus || 'Oluşturuluyor...'}</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF İndirildi!</span>
          </>
        ) : (
          <>
            <FileText className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>{label || 'PDF İndir'}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className={`py-2 px-3.5 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
          isSuccess
            ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-300'
            : 'bg-[#131317] hover:bg-[#1a1a20] border border-[#2b2b36] hover:border-[#c4a47c] text-[#e0e0e0]'
        } ${className}`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#c4a47c]" />
            <span>{progressStatus || 'PDF Hazırlanıyor...'}</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>PDF İndirildi!</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 text-[#c4a47c]" />
            <span>{label || 'Şık PDF Konsültasyon Dosyası İndir'}</span>
          </>
        )}
      </button>
    );
  }

  // Primary variant
  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
        isSuccess
          ? 'bg-emerald-600 text-white shadow-emerald-950/50'
          : 'bg-gradient-to-r from-[#c4a47c] to-[#b39166] hover:from-[#bfa077] hover:to-[#a7865c] text-black shadow-[#c4a47c]/20'
      } ${className}`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-black" />
          <span>{progressStatus || 'PDF Derleniyor...'}</span>
        </>
      ) : isSuccess ? (
        <>
          <Check className="w-4 h-4 text-white" />
          <span>PDF Başarıyla İndirildi!</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 text-black" />
          <span>{label || 'Tüm Raporu Şık PDF Olarak İndir'}</span>
        </>
      )}
    </button>
  );
};
