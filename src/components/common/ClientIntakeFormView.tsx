import React, { useState } from 'react';
import { 
  ENNEAGRAM_MINI_TEST_QUESTIONS, 
  calculateEnneagramFromAnswers 
} from '../../utils/enneagram';
import { 
  TOTEM_BEHAVIORAL_QUESTIONS, 
  calculateBehavioralTotemResult 
} from '../../utils/behavioralTotemEngine';
import { 
  validateCalendarDate, 
  resolveCityLocation, 
  isCitySupported 
} from '../../utils/astrology';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import { ResolvedLocation } from '../../utils/locationResolver';
import { saveClient, postClientIntakeToServer } from '../../utils/storage';
import { normalizePhoneNumber, isValidEmail } from '../../utils/clientValidation';
import { PersonData } from '../../types';
import { 
  generateWhatsAppShareLink, 
  encodeClientIntakeToken 
} from '../../utils/enneagramSharing';
import { 
  Sparkles, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Compass, 
  AlertCircle,
  RotateCcw,
  Layers,
  FileCheck,
  Phone,
  Mail,
  Send,
  Copy
} from 'lucide-react';

interface ClientIntakeFormViewProps {
  onReturnToStudio?: () => void;
  onFormSubmitted?: (client: PersonData) => void;
}

export const ClientIntakeFormView: React.FC<ClientIntakeFormViewProps> = ({
  onReturnToStudio,
  onFormSubmitted
}) => {
  // Current wizard step: 1: İletişim & Kişisel, 2: Doğum & Aile, 3: Enneagram, 4: Totem
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [motherName, setMotherName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [birthPlace, setBirthPlace] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<ResolvedLocation | null>(null);
  const [personalStory, setPersonalStory] = useState<string>('');

  // Test Answers (HAM CEVAPLAR)
  const [enneagramAnswers, setEnneagramAnswers] = useState<Record<number, number>>({});
  const [totemAnswers, setTotemAnswers] = useState<Record<number, string>>({});

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedClientData, setSubmittedClientData] = useState<PersonData | null>(null);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Helper validation functions
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) {
      errs.firstName = 'Lütfen adınızı giriniz.';
    }
    if (!lastName.trim()) {
      errs.lastName = 'Lütfen soyadınızı giriniz.';
    }
    
    // Telefon Numarası Kontrolü (Zorunlu)
    if (!phone.trim()) {
      errs.phone = 'Lütfen telefon numaranızı giriniz.';
    } else {
      const pVal = normalizePhoneNumber(phone);
      if (!pVal.valid) {
        errs.phone = pVal.error || 'Geçersiz telefon numarası.';
      }
    }

    // E-posta Adresi Kontrolü (Zorunlu)
    if (!email.trim()) {
      errs.email = 'Lütfen e-posta adresinizi giriniz.';
    } else if (!isValidEmail(email)) {
      errs.email = 'Geçersiz e-posta formatı. Lütfen geçerli bir e-posta giriniz (Örn: isim@domain.com).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    
    // Doğum Tarihi Kontrolü
    if (!birthDate.trim()) {
      errs.birthDate = 'Lütfen doğum tarihinizi giriniz.';
    } else {
      try {
        validateCalendarDate(birthDate);
      } catch (err: unknown) {
        errs.birthDate = err instanceof Error ? err.message : 'Geçersiz doğum tarihi.';
      }
    }

    // Doğum Saati Kontrolü
    if (!birthTime.trim()) {
      errs.birthTime = 'Lütfen doğum saatinizi giriniz (Yükselen burç için gereklidir).';
    }

    // Doğum Yeri Kontrolü (İstanbul fallback'i KESİNLİKLE kaldırılmıştır)
    if (!birthPlace.trim()) {
      errs.birthPlace = 'Lütfen doğum yerinizi giriniz.';
    } else {
      try {
        const resolved = selectedLocation || resolveCityLocation(birthPlace);
        if (!selectedLocation && resolved) {
          setSelectedLocation(resolved as any);
        }
      } catch (err: unknown) {
        errs.birthPlace = err instanceof Error ? err.message : 'Doğum yeri tanınamadı. Lütfen geçerli bir şehir ve ülke adı giriniz.';
      }
    }

    // Anne Adı Kontrolü (Ebced & soy arketipi için)
    if (!motherName.trim()) {
      errs.motherName = 'Lütfen anne adınızı giriniz (Ebced ve soy kökü arketipi için gereklidir).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const totalEnneagram = ENNEAGRAM_MINI_TEST_QUESTIONS.length;
    const answered = Object.keys(enneagramAnswers).length;
    if (answered < totalEnneagram) {
      setGeneralError(`Enneagram testinde henüz cevaplanmamış sorular var (${answered}/${totalEnneagram}). Lütfen tüm soruları işaretleyiniz.`);
      return false;
    }
    setGeneralError(null);
    return true;
  };

  const validateStep4 = (): boolean => {
    const totalTotem = TOTEM_BEHAVIORAL_QUESTIONS.length;
    const answered = Object.keys(totemAnswers).length;
    if (answered < totalTotem) {
      setGeneralError(`Totem hayvanı testinde henüz cevaplanmamış sorular var (${answered}/${totalTotem}). Lütfen 15 sorunun tamamını işaretleyiniz.`);
      return false;
    }
    setGeneralError(null);
    return true;
  };

  // Full validation before final submit
  const validateAll = (): boolean => {
    setGeneralError(null);
    if (!validateStep1()) {
      setCurrentStep(1);
      setGeneralError('Lütfen 1. Adımdaki iletişim ve kişisel bilgileri eksiksiz doldurunuz.');
      return false;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      setGeneralError('Lütfen 2. Adımdaki doğum tarihi, saati, konumu ve anne adı bilgilerini kontrol ediniz.');
      return false;
    }
    if (!validateStep3()) {
      setCurrentStep(3);
      return false;
    }
    if (!validateStep4()) {
      setCurrentStep(4);
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    setGeneralError(null);
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedLocation && birthPlace.trim()) {
        try {
          const res = await fetch('/api/locations/resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: birthPlace.trim() })
          });
          const data = await res.json();
          if (data && data.success && data.location) {
            setSelectedLocation(data.location);
            setBirthPlace(data.location.displayName || data.location.name);
          }
        } catch {
          // fallback to standard validation
        }
      }
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    setGeneralError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final Submission to Server (/api/client-intake)
  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      // 1. Doğrulama kontrolleri
      validateCalendarDate(birthDate);

      let resolvedLoc = selectedLocation;
      if (!resolvedLoc && birthPlace.trim()) {
        try {
          const res = await fetch('/api/locations/resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: birthPlace.trim() })
          });
          const data = await res.json();
          if (data && data.success && data.location) {
            resolvedLoc = data.location;
            setSelectedLocation(data.location);
          }
        } catch {
          // ignore
        }
      }

      if (!resolvedLoc) {
        resolvedLoc = resolveCityLocation(birthPlace) as any;
      }

      const phoneNorm = normalizePhoneNumber(phone);
      if (!phoneNorm.valid) {
        throw new Error(phoneNorm.error || 'Geçersiz telefon numarası.');
      }
      if (!isValidEmail(email)) {
        throw new Error('Geçersiz e-posta adresi.');
      }

      // 2. Ham cevaplardan arka planda Enneagram ve Totem tespiti
      const enneaResult = calculateEnneagramFromAnswers(enneagramAnswers);
      const totemResult = calculateBehavioralTotemResult(totemAnswers, enneaResult.type);

      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const nowIso = new Date().toISOString();

      const clientPayload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName,
        phone: phoneNorm.normalized,
        email: email.trim().toLowerCase(),
        birthDate: birthDate.trim(),
        birthTime: birthTime.trim(),
        birthPlace: resolvedLoc.displayName || resolvedLoc.name || birthPlace.trim(),
        birthCity: resolvedLoc.city || resolvedLoc.name,
        birthRegion: resolvedLoc.region,
        birthCountry: resolvedLoc.country,
        birthCountryCode: resolvedLoc.countryCode,
        birthLatitude: resolvedLoc.lat,
        birthLongitude: resolvedLoc.lon,
        birthTimezone: resolvedLoc.timezone,
        birthTimezoneOffset: resolvedLoc.defaultTz,
        motherName: motherName.trim(),
        personalStory: personalStory.trim() || undefined,
        notes: personalStory.trim() ? `Danışan Formu Notu: ${personalStory.trim()}` : undefined,
        enneagramAnswers: { ...enneagramAnswers },
        totemAnswers: { ...totemAnswers },
        source: 'client_form',
        status: 'new',
        createdAt: nowIso,
        updatedAt: nowIso
      };

      // 3. Sunucuya Gönder (Express POST /api/client-intake)
      const serverRes = await postClientIntakeToServer(clientPayload);
      if (!serverRes.success) {
        throw new Error(serverRes.error || 'Sunucu form kaydını kabul etmedi.');
      }

      const savedRecord = ({
        ...clientPayload,
        id: serverRes.clientId!,
        zodiacSystem: 'Tropical',
        enneagramType: enneaResult.type,
        enneagramWing: enneaResult.wing,
        primaryTotemId: totemResult.primaryTotem?.id,
        secondaryTotemId: totemResult.secondaryTotem?.id,
        shadowTotemId: totemResult.shadowTotem?.id,
        totemConfidenceScore: totemResult.confidenceScore
      } as PersonData);

      // Local storage yedekleme de yap
      saveClient(savedRecord);

      // Sekmeler ve pencereler arası güncelleme yayını
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tattoo_assistant_data_updated', { 
          detail: { type: 'client_intake', client: savedRecord } 
        }));
      }

      // 4. State güncelle ve başarı ekranına geç
      setSubmittedClientData(savedRecord);
      setIsSubmitted(true);

      if (onFormSubmitted) {
        onFormSubmitted(savedRecord);
      }
    } catch (err: unknown) {
      setGeneralError(err instanceof Error ? err.message : 'Form gönderimi sırasında bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setMotherName('');
    setBirthDate('');
    setBirthTime('');
    setBirthPlace('');
    setSelectedLocation(null);
    setPersonalStory('');
    setEnneagramAnswers({});
    setTotemAnswers({});
    setErrors({});
    setGeneralError(null);
    setCurrentStep(1);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setSubmittedClientData(null);
  };

  // SUCCESS SCREEN (Sonuçlar Müşteriye Gösterilmez, Yalnızca Güven Verici Onay)
  if (isSubmitted && submittedClientData) {
    return (
      <div className="min-h-screen bg-[#060606] text-[#e0e0e0] font-sans selection:bg-[#c4a47c]/30 selection:text-[#c4a47c] p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full space-y-6 animate-fadeIn text-center">
          {/* Top Bar with Return button */}
          {onReturnToStudio && (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={onReturnToStudio}
                className="py-1.5 px-3 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] text-xs text-[#aaa] hover:text-white flex items-center gap-1.5 font-mono cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Stüdyo Ekranına Dön</span>
              </button>
            </div>
          )}

          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#11100b] via-[#0d0d0d] to-[#070707] border border-[#c4a47c]/40 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#1b1710] border border-[#c4a47c]/50 flex items-center justify-center mx-auto text-[#c4a47c] shadow-lg shadow-[#c4a47c]/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c180f] border border-[#c4a47c]/30 text-[#c4a47c] text-xs font-mono">
                <Sparkles className="w-3 h-3" />
                <span>Form Başarıyla Teslim Alındı</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Teşekkür Ederiz, {submittedClientData.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#999] max-w-md mx-auto leading-relaxed">
                Size özel sembol haritanızın ve kişisel dövme kompozisyonunuzun oluşturulabilmesi için gerekli tüm bilgiler ve test yanıtlarınız stüdyomuza güvenle iletilmiştir.
              </p>
            </div>

            {/* Masked / Professional Receipt Card */}
            <div className="p-5 rounded-xl bg-[#090909] border border-[#1f1f1f] text-left space-y-3 font-mono text-xs">
              <div className="text-[11px] uppercase tracking-wider text-[#c4a47c] font-bold pb-2 border-b border-[#181818] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  <span>Kayıt Özeti</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px]">
                  ✓ Kaydedildi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#bbb]">
                <div>
                  <span className="text-[10px] text-[#666] block uppercase">Danışan:</span>
                  <span className="text-white font-medium">{submittedClientData.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] block uppercase">İletişim:</span>
                  <span className="text-white font-medium">{submittedClientData.phone} • {submittedClientData.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] block uppercase">Doğum Tarihi & Yeri:</span>
                  <span className="text-white font-medium">{submittedClientData.birthDate} • {submittedClientData.birthPlace}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] block uppercase">Doğum Saati & Anne Adı:</span>
                  <span className="text-white font-medium">{submittedClientData.birthTime} • Anne: {submittedClientData.motherName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] block uppercase">Enneagram Testi:</span>
                  <span className="text-emerald-400 font-medium">5/5 Soru Tamamlandı</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] block uppercase">Davranışsal Totem Testi:</span>
                  <span className="text-emerald-400 font-medium">15/15 Soru Tamamlandı</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#181818] text-[11px] text-[#888] italic">
                * Ezoterik güvenlik gereği kişisel harita hesaplamalarınız doğrudan dövme sanatçınızın tasarım konsoluna iletilmiştir.
              </div>
            </div>

            {/* WhatsApp ile Stüdyoya Geri İletim Kartı */}
            {(() => {
              const intakeToken = encodeClientIntakeToken(submittedClientData);
              const returnMsg = `✨ Merhaba! Danışan Formumu tamamladım:\n\n👤 *Danışan:* ${submittedClientData.name}\n📞 *İletişim:* ${submittedClientData.phone} • ${submittedClientData.email}\n📍 *Doğum:* ${submittedClientData.birthDate} ${submittedClientData.birthTime} (${submittedClientData.birthPlace})\n\n📋 *Stüdyo Aktarım Kodu:*\n${intakeToken}\n\nTüm test ve doğum bilgilerim sisteme kaydedilmiştir! ✨🖋️`;
              
              const handleSendWhatsAppReturn = () => {
                const link = generateWhatsAppShareLink('', returnMsg);
                const a = document.createElement('a');
                a.href = link;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              };

              const handleCopyIntakeToken = () => {
                if (intakeToken) {
                  navigator.clipboard.writeText(intakeToken);
                  setCopiedToken(true);
                  setTimeout(() => setCopiedToken(false), 2000);
                }
              };

              const handleCopySummary = () => {
                navigator.clipboard.writeText(returnMsg);
                setCopiedSummary(true);
                setTimeout(() => setCopiedSummary(false), 2000);
              };

              return (
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-b from-[#14120c] to-[#0c0c0c] border border-emerald-500/40 text-left space-y-3 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-[#222]">
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp ile Dövme Sanatçısına Bildir</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Önerilen
                    </span>
                  </div>
                  
                  <p className="text-xs text-[#aaa] font-mono leading-relaxed">
                    Formunuz stüdyo sunucusuna kaydedildi. Dövme sanatçınızla WhatsApp üzerinden yazışıyorsanız, aşağıdaki butona tıklayarak formu doldurduğunuzu sanatçınıza tek tıkla iletebilirsiniz:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSendWhatsAppReturn}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>WhatsApp'tan Sanatçıma Gönder</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyIntakeToken}
                      className="py-3 px-4 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] hover:border-[#c4a47c] text-xs text-white font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Aktarım kodunu panoya kopyalar"
                    >
                      {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedToken ? 'Kod Kopyalandı!' : 'Aktarım Kodunu Kopyala'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#666] font-mono pt-1 border-t border-[#1a1a1a]">
                    <span>* WhatsApp sohbetinize döndüğünüzde mesaj otomatik doldurulacaktır.</span>
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="text-[#888] hover:text-[#c4a47c] transition-colors cursor-pointer"
                    >
                      {copiedSummary ? '✓ Özet Kopyalandı' : 'Tüm Özeti Kopyala'}
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onReturnToStudio && (
                <button
                  type="button"
                  onClick={onReturnToStudio}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#c4a47c]/20"
                >
                  Stüdyo Paneline Git
                </button>
              )}
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2b2b2b] text-[#888] hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yeni Bir Form Doldur</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#555] font-mono">
            Tattoo Design Assistant • Kişiye Özel Ezoterik Sembol Haritası ve Dövme Tasarım Konsolu
          </div>
        </div>
      </div>
    );
  }

  // Progress metrics
  const enneagramAnswered = Object.keys(enneagramAnswers).length;
  const totemAnswered = Object.keys(totemAnswers).length;

  return (
    <div className="min-h-screen bg-[#060606] text-[#e0e0e0] font-sans selection:bg-[#c4a47c]/30 selection:text-[#c4a47c] p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-6">
        
        {/* Top Bar with Return button & Portal label */}
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
          <div className="text-[10px] font-mono text-[#c4a47c] uppercase tracking-widest ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4a47c] animate-pulse"></span>
            <span>Danışan Kabul Portalı</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#13110a] via-[#0d0d0d] to-[#070707] border border-[#c4a47c]/30 shadow-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c180e] border border-[#c4a47c]/40 text-[#c4a47c] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kişiye Özel Sembol Haritası</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            DANIŞAN BİLGİ FORMU
          </h1>
          <p className="text-xs sm:text-sm text-[#aaa] max-w-lg mx-auto leading-relaxed">
            Size özel sembol haritanızın oluşturulabilmesi için aşağıdaki bilgileri eksiksiz doldurun.
          </p>

          {/* Stepper Tabs */}
          <div className="pt-4 grid grid-cols-4 gap-2 max-w-xl mx-auto">
            {[
              { num: 1, label: 'İletişim', detail: 'Ad, Tel & E-posta' },
              { num: 2, label: 'Doğum & Aile', detail: 'Tarih, Konum & Anne' },
              { num: 3, label: 'Enneagram', detail: `${enneagramAnswered}/5 Yanıt` },
              { num: 4, label: 'Totem', detail: `${totemAnswered}/15 Yanıt` }
            ].map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    // Quick navigation allowed
                    if (s.num === 1) setCurrentStep(1);
                    else if (s.num === 2 && validateStep1()) setCurrentStep(2);
                    else if (s.num === 3 && validateStep1() && validateStep2()) setCurrentStep(3);
                    else if (s.num === 4 && validateStep1() && validateStep2() && validateStep3()) setCurrentStep(4);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isActive
                      ? 'bg-[#1e1a10] border-[#c4a47c] text-white shadow-lg shadow-[#c4a47c]/10'
                      : isPast
                      ? 'bg-[#0f0f0f] border-[#2a2a2a] text-[#aaa] hover:border-[#444]'
                      : 'bg-[#0a0a0a] border-[#181818] text-[#555]'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-[#c4a47c] text-black' : isPast ? 'bg-[#222] text-[#c4a47c]' : 'bg-[#161616] text-[#555]'
                  }`}>
                    {s.num} / 4
                  </span>
                  <span className="text-xs font-semibold block">{s.label}</span>
                  <span className="text-[9px] font-mono text-[#888] hidden sm:block">{s.detail}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong className="block font-bold">Lütfen Dikkat:</strong>
              <span>{generalError}</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: İLETİŞİM VE KİŞİSEL BİLGİLER */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0a0a0a] border border-[#1c1c1c] space-y-6 shadow-xl animate-fadeIn">
            <div className="border-b border-[#181818] pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-[#c4a47c]">
                <User className="w-4 h-4 text-[#c4a47c]" />
                <span>1. BÖLÜM: İLETİŞİM VE KİŞİSEL BİLGİLER</span>
              </h2>
              <p className="text-xs text-[#777] font-mono mt-0.5">
                Randevu koordinasyonu, tasarım taslağı teslimi ve Pisagor numeroloji matrisi için temel kimlik ve iletişim bilgileriniz.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ad */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#aaa] flex items-center gap-1">
                  <span>Adınız</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                  }}
                  placeholder="Örn: Selin"
                  className={`w-full px-3.5 py-2.5 bg-[#121212] border rounded-lg text-xs text-white placeholder-[#555] focus:outline-none transition-colors ${
                    errors.firstName ? 'border-rose-500/80 bg-rose-950/10' : 'border-[#222] focus:border-[#c4a47c]'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-[11px] text-rose-400 font-mono">{errors.firstName}</p>
                )}
              </div>

              {/* Soyad */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#aaa] flex items-center gap-1">
                  <span>Soyadınız</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  placeholder="Örn: Kaya"
                  className={`w-full px-3.5 py-2.5 bg-[#121212] border rounded-lg text-xs text-white placeholder-[#555] focus:outline-none transition-colors ${
                    errors.lastName ? 'border-rose-500/80 bg-rose-950/10' : 'border-[#222] focus:border-[#c4a47c]'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-[11px] text-rose-400 font-mono">{errors.lastName}</p>
                )}
              </div>

              {/* Telefon Numarası */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#aaa] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Telefon Numarası</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#777]">TR Cep Formatı</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  placeholder="05XX XXX XX XX veya +90 5XX..."
                  className={`w-full px-3.5 py-2.5 bg-[#121212] border rounded-lg text-xs text-white placeholder-[#555] focus:outline-none transition-colors font-mono ${
                    errors.phone ? 'border-rose-500/80 bg-rose-950/10' : 'border-[#222] focus:border-[#c4a47c]'
                  }`}
                />
                {errors.phone ? (
                  <p className="text-[11px] text-rose-400 font-mono">{errors.phone}</p>
                ) : (
                  <p className="text-[10px] text-[#666] font-mono">Örn: 0532 123 45 67 veya +90 532 123 45 67</p>
                )}
              </div>

              {/* E-posta Adresi */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#aaa] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>E-posta Adresi</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#777]">Tasarım & Randevu Detayları</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="danisan@example.com"
                  className={`w-full px-3.5 py-2.5 bg-[#121212] border rounded-lg text-xs text-white placeholder-[#555] focus:outline-none transition-colors font-mono ${
                    errors.email ? 'border-rose-500/80 bg-rose-950/10' : 'border-[#222] focus:border-[#c4a47c]'
                  }`}
                />
                {errors.email ? (
                  <p className="text-[11px] text-rose-400 font-mono">{errors.email}</p>
                ) : (
                  <p className="text-[10px] text-[#666] font-mono">Örn: selin.kaya@gmail.com</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#181818]">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-[#c4a47c]/15"
              >
                <span>İlerle: Doğum & Aile Bilgileri</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: DOĞUM & AİLE BİLGİLERİ */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0a0a0a] border border-[#1c1c1c] space-y-6 shadow-xl animate-fadeIn">
            <div className="border-b border-[#181818] pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-[#c4a47c]">
                <Calendar className="w-4 h-4 text-[#c4a47c]" />
                <span>2. BÖLÜM: DOĞUM VE AİLE BİLGİLERİ</span>
              </h2>
              <p className="text-xs text-[#777] font-mono mt-0.5">
                Güneş, Ay, Yükselen burç (ASC), astronomik gezegen koordinatları ve kadim Ebced/Yıldızname soy kökü için kesin veriler.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Doğum Tarihi */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#aaa] flex items-center gap-1">
                  <span>Doğum Tarihi</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-[#121212] border rounded-lg text-xs text-white placeholder-[#555] focus:outline-none transition-colors ${
                    errors.birthDate ? 'border-rose-500/80 bg-rose-950/10' : 'border-[#222] focus:border-[#c4a47c]'
                  }`}
                />
                <span className="text-[10px] text-[#666] font-mono block">Format: YYYY-AA-GG</span>
                {errors.birthDate && (
                  <p className="text-[11px] text-rose-400 font-mono leading-tight">{errors.birthDate}</p>
                )}
              </div>

              {/* Doğum Saati */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#aaa] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#c4a47c]" />
                  <span>Doğum Saati</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => {
                    setBirthTime(e.target.value);
                    if (errors.birthTime) setErrors(prev => ({ ...prev, birthTime: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-[#121212] border rounded-lg text-xs text-white placeholder-[#555] focus:outline-none transition-colors ${
                    errors.birthTime ? 'border-rose-500/80 bg-rose-950/10' : 'border-[#222] focus:border-[#c4a47c]'
                  }`}
                />
                <span className="text-[10px] text-[#666] font-mono block">Örn: 14:30 (Bilinmiyorsa 12:00)</span>
                {errors.birthTime && (
                  <p className="text-[11px] text-rose-400 font-mono leading-tight">{errors.birthTime}</p>
                )}
              </div>

              {/* Doğum Yeri */}
              <div className="sm:col-span-3 space-y-1.5 pt-1">
                <LocationAutocompleteInput
                  value={birthPlace}
                  onChange={(val) => {
                    setBirthPlace(val);
                    setSelectedLocation(null);
                    if (errors.birthPlace) setErrors(prev => ({ ...prev, birthPlace: '' }));
                  }}
                  onLocationSelect={(loc) => {
                    setSelectedLocation(loc);
                    if (loc) setBirthPlace(loc.displayName || loc.name);
                    if (errors.birthPlace) setErrors(prev => ({ ...prev, birthPlace: '' }));
                  }}
                  selectedLocation={selectedLocation}
                  error={errors.birthPlace}
                  showCountryFilter={true}
                  placeholder="Örn: İstanbul, San Francisco, Tokyo, London, São Paulo, Heidelberg..."
                />
              </div>

              {/* Anne Adı */}
              <div className="sm:col-span-3 space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#aaa] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Anne Adı (Aile Bilgisi)</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#777]">Ebced & Yıldızname Soy Hesabı</span>
                </div>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => {
                    setMotherName(e.target.value);
                    if (errors.motherName) setErrors(prev => ({ ...prev, motherName: '' }));
                  }}
                  placeholder="Örn: Emine (Soy kökü ve kadim koruma arketipi için)"
                  className={`w-full px-3.5 py-2.5 bg-[#121212] border rounded-lg text-xs text-white placeholder-[#555] focus:outline-none transition-colors ${
                    errors.motherName ? 'border-rose-500/80 bg-rose-950/10' : 'border-[#222] focus:border-[#c4a47c]'
                  }`}
                />
                {errors.motherName && (
                  <p className="text-[11px] text-rose-400 font-mono">{errors.motherName}</p>
                )}
              </div>

              {/* Kişisel Not / Hikaye (İsteğe Bağlı) */}
              <div className="sm:col-span-3 space-y-1.5 pt-2">
                <label className="text-xs font-mono text-[#aaa] block">
                  Dövmenize Dahil Etmek İstediğiniz Özel Hikâye, Önemli Sayılar veya Anlamlar (İsteğe Bağlı)
                </label>
                <textarea
                  rows={2}
                  value={personalStory}
                  onChange={(e) => setPersonalStory(e.target.value)}
                  placeholder="Hayatınızdaki önemli bir dönüm noktası, uğurlu sayınız veya dövmenizde hissettirmek istediğiniz duygu..."
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#222] focus:border-[#c4a47c] rounded-lg text-xs text-white placeholder-[#555] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#181818]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Geri: Kişisel Bilgiler</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-[#c4a47c]/15"
              >
                <span>İlerle: Enneagram Testi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: ENNEAGRAM TESTİ (5 Soru) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0a0a0a] border border-[#1c1c1c] space-y-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#181818] pb-3 gap-2">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-[#c4a47c]">
                  <Layers className="w-4 h-4 text-[#c4a47c]" />
                  <span>3. BÖLÜM: ENNEAGRAM KİŞİLİK DİNAMİKLERİ TESTİ</span>
                </h2>
                <p className="text-xs text-[#777] font-mono mt-0.5">
                  Dövmenizdeki psikolojik gölge arketipi ve temel içsel motivasyonunuzu belirlemek için 5 soruyu yanıtlayınız.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#c4a47c] px-2.5 py-1 rounded bg-[#1a1710] border border-[#c4a47c]/30">
                  {enneagramAnswered} / {ENNEAGRAM_MINI_TEST_QUESTIONS.length} Yanıtlandı
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {ENNEAGRAM_MINI_TEST_QUESTIONS.map((q, qIdx) => {
                const selected = enneagramAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-xl bg-[#0e0e0e] border border-[#1c1c1c] space-y-3 shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-[#c4a47c] bg-[#1a1710] px-2 py-0.5 rounded border border-[#c4a47c]/30 shrink-0">
                        Soru {qIdx + 1}
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selected === opt.type;
                        const letter = String.fromCharCode(65 + optIdx);
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              setEnneagramAnswers(prev => ({ ...prev, [q.id]: opt.type }));
                            }}
                            className={`text-left p-3 rounded-lg text-xs transition-all border cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#1e1a10] border-[#c4a47c] text-white shadow-sm'
                                : 'bg-[#121212] border-[#222] text-[#bbb] hover:border-[#383838] hover:text-white'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                                isSelected ? 'bg-[#c4a47c] text-black font-bold' : 'bg-[#1c1c1c] text-[#777]'
                              }`}>
                                {letter}
                              </span>
                              <span className="leading-relaxed">{opt.text}</span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#c4a47c] shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#181818]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Geri: Doğum Bilgileri</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-[#c4a47c]/15"
              >
                <span>İlerle: Totem Hayvanı Testi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: DAVRANIŞSAL TOTEM HAYVANI TESTİ (15 Soru) & GÖNDER */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0a0a0a] border border-[#1c1c1c] space-y-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#181818] pb-3 gap-2">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-[#c4a47c]">
                  <Compass className="w-4 h-4 text-[#c4a47c]" />
                  <span>4. BÖLÜM: DAVRANIŞSAL TOTEM HAYVANI TESTİ</span>
                </h2>
                <p className="text-xs text-[#777] font-mono mt-0.5">
                  Kriz reflekslerinizi ve doğayla ruhsal bağınızı haritalamak için 15 soruyu yanıtlayınız.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#c4a47c] px-2.5 py-1 rounded bg-[#1a1710] border border-[#c4a47c]/30">
                  {totemAnswered} / {TOTEM_BEHAVIORAL_QUESTIONS.length} Yanıtlandı
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {TOTEM_BEHAVIORAL_QUESTIONS.map((q, qIdx) => {
                const selected = totemAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-xl bg-[#0e0e0e] border border-[#1c1c1c] space-y-3 shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-[#c4a47c] bg-[#1a1710] px-2 py-0.5 rounded border border-[#c4a47c]/30 shrink-0">
                        Soru {qIdx + 1}
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                          {q.question}
                        </h3>
                        <span className="text-[10px] text-[#666] font-mono block mt-0.5">
                          Kategori: {q.category}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selected === opt.id;
                        const letter = String.fromCharCode(65 + optIdx);
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              setTotemAnswers(prev => ({ ...prev, [q.id]: opt.id }));
                            }}
                            className={`text-left p-3 rounded-lg text-xs transition-all border cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#1e1a10] border-[#c4a47c] text-white shadow-sm'
                                : 'bg-[#121212] border-[#222] text-[#bbb] hover:border-[#383838] hover:text-white'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                                isSelected ? 'bg-[#c4a47c] text-black font-bold' : 'bg-[#1c1c1c] text-[#777]'
                              }`}>
                                {letter}
                              </span>
                              <span className="leading-relaxed">{opt.text}</span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#c4a47c] shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission Summary & Final Button */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#14120a] to-[#0c0c0c] border border-[#c4a47c]/40 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c4a47c] uppercase tracking-wider font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Form Tamamlama ve Gönderim Doğrulaması</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-[#090909] border border-[#222]">
                  <span className="text-[10px] text-[#666] block">Danışan:</span>
                  <span className="text-white truncate block">{firstName || '-'} {lastName || ''}</span>
                </div>
                <div className="p-2 rounded bg-[#090909] border border-[#222]">
                  <span className="text-[10px] text-[#666] block">Telefon & E-posta:</span>
                  <span className="text-white truncate block">{phone || '-'}</span>
                  <span className="text-[#888] text-[10px] truncate block">{email || '-'}</span>
                </div>
                <div className="p-2 rounded bg-[#090909] border border-[#222]">
                  <span className="text-[10px] text-[#666] block">Doğum & Anne:</span>
                  <span className="text-white truncate block">{birthDate || '-'} ({birthPlace || '-'})</span>
                  <span className="text-[#888] text-[10px] truncate block">Anne: {motherName || '-'}</span>
                </div>
                <div className="p-2 rounded bg-[#090909] border border-[#222]">
                  <span className="text-[10px] text-[#666] block">Enneagram:</span>
                  <span className={enneagramAnswered === 5 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {enneagramAnswered} / 5 Yanıtlandı
                  </span>
                </div>
                <div className="p-2 rounded bg-[#090909] border border-[#222]">
                  <span className="text-[10px] text-[#666] block">Totem Testi:</span>
                  <span className={totemAnswered === 15 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {totemAnswered} / 15 Yanıtlandı
                  </span>
                </div>
                <div className="p-2 rounded bg-[#090909] border border-[#222]">
                  <span className="text-[10px] text-[#666] block">Kayıt Kanalı:</span>
                  <span className="text-emerald-400 block flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Stüdyo Sunucusu</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Geri: Enneagram</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitForm}
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#b89569] via-[#c4a47c] to-[#d4b58c] hover:from-[#c4a47c] hover:to-[#e0c29b] text-black font-extrabold text-sm font-mono uppercase tracking-wider flex items-center gap-2.5 cursor-pointer transition-all shadow-xl shadow-[#c4a47c]/25 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>SUNUCUYA İLETİLİYOR...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>FORMU TAMAMLA VE GÖNDER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
