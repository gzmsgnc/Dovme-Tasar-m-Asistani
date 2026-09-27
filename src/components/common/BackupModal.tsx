import React, { useState } from 'react';
import { exportAllDataAsJSON, importDataFromJSON } from '../../utils/storage';
import { Database, Download, Upload, Copy, Check, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored
}) => {
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportDownload = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dovme_Asistani_Yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ text: 'Yedek JSON dosyası cihazınıza indirildi.', isError: false });
  };

  const handleCopyJSON = () => {
    const jsonStr = exportAllDataAsJSON();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setStatusMessage({ text: 'Lütfen içe aktarılacak JSON verisini yapıştırın.', isError: true });
      return;
    }

    const result = importDataFromJSON(importText);
    if (result.success) {
      setStatusMessage({ text: result.message, isError: false });
      setImportText('');
      onDataRestored();
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ text: result.message, isError: true });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100 font-['Cinzel',serif] font-bold text-base">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Veri Yedekleme & Dışa Aktar</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-xl font-bold px-2"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Tüm kayıtlı kişi ve dövme tasarım arşivinizi cihazınıza yedekleyebilir veya başka bir cihazdan geri yükleyebilirsiniz.
        </p>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.isError
                ? 'bg-rose-950/40 border border-rose-800 text-rose-300'
                : 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Export Section */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
          <span className="text-xs font-bold text-amber-300 block">1. Verileri Dışa Aktar (Yedek Al)</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportDownload}
              className="flex-1 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON İndir</span>
            </button>
            <button
              type="button"
              onClick={handleCopyJSON}
              className="py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
          <span className="text-xs font-bold text-cyan-300 block">2. Verileri İçe Aktar (Geri Yükle)</span>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700"
          />
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Veya yedek JSON metnini buraya yapıştırın..."
            rows={3}
            className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleImport}
            className="w-full py-2 px-3 rounded-lg bg-cyan-600/80 hover:bg-cyan-600 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Yedeği Geri Yükle</span>
          </button>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
