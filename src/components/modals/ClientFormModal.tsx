import React, { useState, useEffect } from 'react';
import { PersonData } from '../../types';
import { 
  X, 
  Save, 
  Sparkles, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Check,
  Compass
} from 'lucide-react';
import { calculateEbcedAndYildizname } from '../../utils/ebced';
import { calculateNumerology } from '../../utils/numerology';
import { calculateAstrology, validateCalendarDate, resolveCityLocation } from '../../utils/astrology';
import { LocationAutocompleteInput } from '../common/LocationAutocompleteInput';
import { ResolvedLocation } from '../../utils/locationResolver';
import { TotemQuizModal } from './TotemQuizModal';
import { EnneagramQuizModal } from './EnneagramQuizModal';
import { TOTEM_ANIMALS_52 } from '../../utils/totemCatalogData';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveClient: (client: PersonData) => void;
  onSaveAndStartDesign?: (client: PersonData) => void;
  initialClient?: PersonData | null;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSaveClient,
  onSaveAndStartDesign,
  initialClient
}) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ResolvedLocation | null>(null);
  const [motherName, setMotherName] = useState('');
  const [notes, setNotes] = useState('');
  const [zodiacSystem, setZodiacSystem] = useState<'Tropical' | 'Sidereal'>('Tropical');
  const [enneagramType, setEnneagramType] = useState<number>(4);
  const [enneagramWing, setEnneagramWing] = useState<string>('4w5');
  const [existingTotems, setExistingTotems] = useState('');
  const [existingSymbols, setExistingSymbols] = useState('');
  const [personalNumbers, setPersonalNumbers] = useState('');
  const [personalStory, setPersonalStory] = useState('');
  const [totemAnswers, setTotemAnswers] = useState<Record<number, string>>({});
  const [primaryTotemId, setPrimaryTotemId] = useState<string | undefined>(undefined);
  const [totemConfidenceScore, setTotemConfidenceScore] = useState<number | undefined>(undefined);
  const [enneagramAnswers, setEnneagramAnswers] = useState<Record<number, number>>({});
  const [showTotemModal, setShowTotemModal] = useState<boolean>(false);
  const [showEnneagramModal, setShowEnneagramModal] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (initialClient) {
      setName(initialClient.name || '');
      setBirthDate(initialClient.birthDate || '');
      setBirthTime(initialClient.birthTime || '');
      setBirthPlace(initialClient.birthPlace || '');
      if (initialClient.birthLatitude && initialClient.birthLongitude) {
        setSelectedLocation({
          id: `loc_${initialClient.id}`,
          name: initialClient.birthPlace || '',
          displayName: initialClient.birthPlace || '',
          city: initialClient.birthCity || initialClient.birthPlace || '',
          region: initialClient.birthRegion,
          country: initialClient.birthCountry || '',
          countryCode: initialClient.birthCountryCode || '',
          lat: initialClient.birthLatitude,
          lon: initialClient.birthLongitude,
          timezone: initialClient.birthTimezone || 'Europe/Istanbul',
          defaultTz: initialClient.birthTimezoneOffset
        });
      } else {
        setSelectedLocation(null);
      }
      setMotherName(initialClient.motherName || '');
      setNotes(initialClient.notes || '');
      setZodiacSystem(initialClient.zodiacSystem || 'Tropical');
      setEnneagramType(initialClient.enneagramType || 4);
      setEnneagramWing(initialClient.enneagramWing || '4w5');
      setExistingTotems(initialClient.existingTotems || '');
      setExistingSymbols(initialClient.existingSymbols || '');
      setPersonalNumbers(initialClient.personalNumbers || '');
      setPersonalStory(initialClient.personalStory || '');
      setTotemAnswers(initialClient.totemAnswers || {});
      setPrimaryTotemId(initialClient.primaryTotemId);
      setTotemConfidenceScore(initialClient.totemConfidenceScore);
      setEnneagramAnswers(initialClient.enneagramAnswers || {});
    } else {
      setName('');
      setBirthDate('');
      setBirthTime('');
      setBirthPlace('');
      setSelectedLocation(null);
      setMotherName('');
      setNotes('');
      setZodiacSystem('Tropical');
      setEnneagramType(4);
      setEnneagramWing('4w5');
      setExistingTotems('');
      setExistingSymbols('');
      setPersonalNumbers('');
      setPersonalStory('');
      setTotemAnswers({});
      setPrimaryTotemId(undefined);
      setTotemConfidenceScore(undefined);
      setEnneagramAnswers({});
    }
    setErrorMessage(null);
    setIsSavedFeedback(false);
  }, [initialClient, isOpen]);

  if (!isOpen) return null;

  const buildClientData = (): PersonData | null => {
    if (!name.trim()) {
      setErrorMessage('Lütfen danışanın adını ve soyadını girin.');
      return null;
    }
    if (!birthDate) {
      setErrorMessage('Lütfen doğum tarihini seçin.');
      return null;
    }

    try {
      validateCalendarDate(birthDate);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      return null;
    }

    let resolvedLoc: ResolvedLocation | null = selectedLocation;
    if (birthPlace && birthPlace.trim()) {
      try {
        if (!resolvedLoc) {
          resolvedLoc = resolveCityLocation(birthPlace) as any;
          setSelectedLocation(resolvedLoc);
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
        return null;
      }
    }

    const id = initialClient?.id || `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id,
      name: name.trim(),
      birthDate,
      birthTime: birthTime.trim() || undefined,
      birthPlace: resolvedLoc?.displayName || resolvedLoc?.name || birthPlace.trim() || undefined,
      birthCity: resolvedLoc?.city || undefined,
      birthRegion: resolvedLoc?.region || undefined,
      birthCountry: resolvedLoc?.country || undefined,
      birthCountryCode: resolvedLoc?.countryCode || undefined,
      birthLatitude: resolvedLoc?.lat,
      birthLongitude: resolvedLoc?.lon,
      birthTimezone: resolvedLoc?.timezone,
      birthTimezoneOffset: resolvedLoc?.defaultTz,
      motherName: motherName.trim() || undefined,
      zodiacSystem,
      enneagramType,
      enneagramWing,
      enneagramAnswers: Object.keys(enneagramAnswers).length > 0 ? enneagramAnswers : undefined,
      totemAnswers: Object.keys(totemAnswers).length > 0 ? totemAnswers : undefined,
      primaryTotemId,
      totemConfidenceScore,
      existingTotems: existingTotems.trim() || undefined,
      existingSymbols: existingSymbols.trim() || undefined,
      personalNumbers: personalNumbers.trim() || undefined,
      personalStory: personalStory.trim() || undefined,
      notes: notes.trim() || undefined,
      status: initialClient?.status,
      source: initialClient?.source,
      createdAt: initialClient?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleSave = () => {
    const client = buildClientData();
    if (!client) return;

    onSaveClient(client);
    setIsSavedFeedback(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleSaveAndDesign = () => {
    const client = buildClientData();
    if (!client) return;

    onSaveClient(client);
    if (onSaveAndStartDesign) {
      onSaveAndStartDesign(client);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#16140e] border border-[#c4a47c]/30 text-[#c4a47c]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white text-sm sm:text-base font-bold tracking-tight">
                {initialClient ? 'Danışan Bilgilerini Düzenle' : 'Yeni Danışan Kaydı'}
              </h3>
              <p className="text-[11px] text-[#777] font-mono">
                {initialClient ? `Kayıtlı Kişi ID: ${initialClient.id}` : 'Doğum ve ezoterik harita verilerini kaydedin'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-3.5 text-xs">
          {/* Ad & Soyad */}
          <div>
            <label className="text-[11px] font-medium text-[#ccc] uppercase font-mono block mb-1">
              Ad Soyad <span className="text-[#c4a47c]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#555] absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Örn: Gizem Güneş"
                className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#262626] rounded-xl text-white placeholder-zinc-600 focus:border-[#c4a47c] outline-none"
              />
            </div>
          </div>

          {/* Anne Adı */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-[#ccc] uppercase font-mono">
                Anne Adı <span className="text-[#777] font-normal">(Ebced & Yıldızname)</span>
              </label>
              {name.trim() && motherName.trim() && (
                <span className="text-[10px] font-mono text-amber-300/90">
                  Toplam Ebced: {calculateEbcedAndYildizname(name, motherName).totalEbced}
                </span>
              )}
            </div>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Örn: Sevgi"
              className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-xl text-white placeholder-zinc-600 focus:border-[#c4a47c] outline-none"
            />
          </div>

          {/* Doğum Tarihi & Saati */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#ccc] uppercase font-mono block mb-1">
                Doğum Tarihi <span className="text-[#c4a47c]">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#555] absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#262626] rounded-xl text-white focus:border-[#c4a47c] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#ccc] uppercase font-mono block mb-1">
                Doğum Saati <span className="text-[#777] font-normal">(Opsiyonel)</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#555] absolute left-3 top-2.5" />
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#262626] rounded-xl text-white focus:border-[#c4a47c] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Doğum Yeri & Enneagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#ccc] uppercase font-mono block mb-1">
                Doğum Yeri / Şehir
              </label>
              <LocationAutocompleteInput
                value={birthPlace}
                onChange={(val) => {
                  setBirthPlace(val);
                  setSelectedLocation(null);
                  if (errorMessage) setErrorMessage(null);
                }}
                onLocationSelect={(loc) => {
                  setSelectedLocation(loc);
                  setBirthPlace(loc.displayName || loc.name);
                  if (errorMessage) setErrorMessage(null);
                }}
                selectedLocation={selectedLocation}
                placeholder="Örn: İstanbul, San Francisco, Tokyo, London..."
                showCountryFilter={true}
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#ccc] uppercase font-mono block mb-1">
                Enneagram Tipi
              </label>
              <div className="flex gap-2">
                <select
                  value={enneagramType}
                  onChange={(e) => {
                    const t = Number(e.target.value);
                    setEnneagramType(t);
                    setEnneagramWing(`${t}w${t === 9 ? 1 : t + 1}`);
                  }}
                  className="flex-1 px-3 py-2 bg-[#121212] border border-[#262626] rounded-xl text-white focus:border-[#c4a47c] outline-none"
                >
                  <option value={1}>Tip 1 - Kusursuzluk Arayıcısı</option>
                  <option value={2}>Tip 2 - Yardımsever & Şefkatli</option>
                  <option value={3}>Tip 3 - Başarı Odaklı & Vizyoner</option>
                  <option value={4}>Tip 4 - Bireyci & Özgün Simyacı</option>
                  <option value={5}>Tip 5 - Araştırmacı & Bilge</option>
                  <option value={6}>Tip 6 - Sadık & Tetikte Muhafız</option>
                  <option value={7}>Tip 7 - Maceracı & Hevesli</option>
                  <option value={8}>Tip 8 - Meydan Okuyan & Lider</option>
                  <option value={9}>Tip 9 - Barışçı & Kapsayıcı</option>
                </select>
                <input
                  type="text"
                  value={enneagramWing}
                  onChange={(e) => setEnneagramWing(e.target.value)}
                  placeholder="Kanat (örn: 4w5)"
                  className="w-20 px-2.5 py-2 bg-[#121212] border border-[#262626] rounded-xl text-white text-center font-mono focus:border-[#c4a47c] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Kişisel Arketip & Davranış Testleri */}
          <div className="p-3 rounded-xl bg-[#0e0e14] border border-[#1e1e2c] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#c4a47c] uppercase tracking-wider font-mono font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Kişisel Arketip Testleri</span>
              </span>
              <span className="text-[10px] text-[#666] font-mono">Bağımsız Test Motorları</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowTotemModal(true)}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                  Object.keys(totemAnswers).length > 0
                    ? 'bg-[#14120c] border-[#c4a47c]/60 text-white'
                    : 'bg-[#12121a] hover:bg-[#161622] border-[#222230] text-[#ccc]'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#c4a47c]">
                    <Compass className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Davranışsal Totem Testi</span>
                  </div>
                  <p className="text-[10px] text-[#777] font-mono">
                    {Object.keys(totemAnswers).length > 0
                      ? `✓ 15/15 (${TOTEM_ANIMALS_52.find(a => a.id === primaryTotemId)?.name || 'Totem Belirlendi'})`
                      : '52 Hayvan profiliyle 15 davranışsal soru'}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1c1c28] text-[#c4a47c] border border-[#2e2e40]">
                  {Object.keys(totemAnswers).length > 0 ? 'Yenile' : 'Testi Çöz'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowEnneagramModal(true)}
                className="p-2.5 rounded-lg bg-[#12121a] hover:bg-[#161622] border border-[#222230] text-left flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#c4a47c]">
                    <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Enneagram Kişilik Testi</span>
                  </div>
                  <p className="text-[10px] text-[#777] font-mono">
                    Seçili: Tip {enneagramType} ({enneagramWing})
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1c1c28] text-[#c4a47c] border border-[#2e2e40]">
                  Testi Çöz
                </span>
              </button>
            </div>
          </div>

          {/* Özel Notlar */}
          <div>
            <label className="text-[11px] font-medium text-[#ccc] uppercase font-mono block mb-1">
              Özel Notlar & Beklentiler
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Gölgelerden uyanış, sağ kolda ince çizgi estetik..."
              className="w-full px-3 py-2 bg-[#121212] border border-[#262626] rounded-xl text-white placeholder-zinc-600 focus:border-[#c4a47c] outline-none"
            />
          </div>

          {/* İleri Düzey Ezoterik Alanlar (Accordion) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full py-1.5 px-3 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] text-[#c4a47c] font-mono text-[11px] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>✦ Ek Ezoterik Veriler (Totemler, Semboller, Kişisel Sayılar)</span>
              <span className="text-[#777]">{showAdvanced ? 'Gizle ▲' : 'Genişlet ▼'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-2 p-3 rounded-xl bg-[#0f0f0f] border border-[#222] space-y-2.5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-mono block mb-1">Mevcut Totem Hayvanları:</label>
                    <input
                      type="text"
                      value={existingTotems}
                      onChange={(e) => setExistingTotems(e.target.value)}
                      placeholder="Örn: Kurt, Baykuş"
                      className="w-full px-2.5 py-1.5 bg-black border border-[#262626] rounded-lg text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 font-mono block mb-1">Mevcut Semboller:</label>
                    <input
                      type="text"
                      value={existingSymbols}
                      onChange={(e) => setExistingSymbols(e.target.value)}
                      placeholder="Örn: Hilal, Lotus, Metatron"
                      className="w-full px-2.5 py-1.5 bg-black border border-[#262626] rounded-lg text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-mono block mb-1">Kişisel Sayılar:</label>
                    <input
                      type="text"
                      value={personalNumbers}
                      onChange={(e) => setPersonalNumbers(e.target.value)}
                      placeholder="Örn: 7, 19, 24"
                      className="w-full px-2.5 py-1.5 bg-black border border-[#262626] rounded-lg text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 font-mono block mb-1">Zodyak Sistemi:</label>
                    <select
                      value={zodiacSystem}
                      onChange={(e) => setZodiacSystem(e.target.value as 'Tropical' | 'Sidereal')}
                      className="w-full px-2.5 py-1.5 bg-black border border-[#262626] rounded-lg text-white text-xs outline-none"
                    >
                      <option value="Tropical">Tropikal (Batı)</option>
                      <option value="Sidereal">Sideral (Vedik / Lahiri)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 font-mono block mb-1">Kişisel Hikâye & Yaşam Teması:</label>
                  <input
                    type="text"
                    value={personalStory}
                    onChange={(e) => setPersonalStory(e.target.value)}
                    placeholder="Örn: Sınırlarımı korumak ve gücümü keşfetmek..."
                    className="w-full px-2.5 py-1.5 bg-black border border-[#262626] rounded-lg text-white text-xs outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] text-[#aaa] hover:text-white font-mono text-xs cursor-pointer"
          >
            İptal
          </button>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#18150f] hover:bg-[#252015] border border-[#c4a47c]/60 text-[#c4a47c] font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              {isSavedFeedback ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              <span>{isSavedFeedback ? 'Kaydedildi!' : (initialClient ? 'Değişiklikleri Güncelle' : 'Kişiyi Kaydet')}</span>
            </button>

            {onSaveAndStartDesign && (
              <button
                type="button"
                onClick={handleSaveAndDesign}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#c4a47c]/20"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Kaydet & Dövme Tasarla</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Davranışsal Totem Testi Modalı */}
      {showTotemModal && (
        <TotemQuizModal
          isOpen={showTotemModal}
          clientName={name || 'Danışan'}
          initialAnswers={totemAnswers}
          enneagramType={enneagramType}
          personalContext={birthDate && birthPlace?.trim() ? (() => {
            try {
              return {
                dominantElement: calculateAstrology(birthDate, birthTime, birthPlace).dominantElement,
                lifePathNumber: calculateNumerology(name || 'Danışan', birthDate).lifePathNumber,
                sunSign: calculateAstrology(birthDate, birthTime, birthPlace).sunSign
              };
            } catch {
              return undefined;
            }
          })() : undefined}
          onClose={() => setShowTotemModal(false)}
          onApplyResult={(answers, result) => {
            setTotemAnswers(answers);
            setPrimaryTotemId(result.primaryTotem.id);
            setTotemConfidenceScore(result.confidenceScore);
            setShowTotemModal(false);
          }}
        />
      )}

      {/* Enneagram Testi Modalı */}
      {showEnneagramModal && (
        <EnneagramQuizModal
          isOpen={showEnneagramModal}
          onClose={() => setShowEnneagramModal(false)}
          onApplyResult={(type, wing) => {
            setEnneagramType(type);
            setEnneagramWing(wing);
            setShowEnneagramModal(false);
          }}
        />
      )}
    </div>
  );
};
