import React, { useState, useEffect } from 'react';
import { 
  PersonData, 
  NumerologyProfile, 
  AstrologyProfile, 
  EnneagramProfile, 
  SymbolismProfile, 
  TattooDesignParameters, 
  TattooRecipe 
} from '../../types';
import { calculateNumerology } from '../../utils/numerology';
import { calculateAstrology, validateCalendarDate, resolveCityLocation, resolveCityLocationAsync } from '../../utils/astrology';
import { LocationAutocompleteInput } from '../common/LocationAutocompleteInput';
import { ResolvedLocation } from '../../utils/locationResolver';
import { ENNEAGRAM_TYPES, getEnneagramProfile } from '../../utils/enneagram';
import { deriveSymbolismProfile } from '../../utils/symbolism';
import { calculateChakraProfile, ChakraProfile } from '../../utils/chakra';
import { TATTOO_STYLES } from '../../utils/styles';
import { generateTattooRecipe } from '../../utils/recipeGenerator';
import { calculateEbcedAndYildizname } from '../../utils/ebced';
import { ShadowAnalysisViewer } from './ShadowAnalysisViewer';
import { SymbolIntegrationViewer } from '../symbols/SymbolIntegrationViewer';
import { downloadRecipeAsJson } from '../../utils/jsonExport';
import { EnneagramQuizModal } from '../modals/EnneagramQuizModal';
import { TotemQuizModal } from '../modals/TotemQuizModal';
import { CalculationDetailModal } from '../modals/CalculationDetailModal';
import { MorseCodeModal } from '../modals/MorseCodeModal';
import { EnneagramShareModal } from '../modals/EnneagramShareModal';
import { ClientIntakeLinkModal } from '../modals/ClientIntakeLinkModal';
import { ClientConsultationDossierModal } from '../modals/ClientConsultationDossierModal';
import { ClientEnneagramQuizView } from '../common/ClientEnneagramQuizView';
import { encodeToMorse } from '../../utils/morseCode';
import { downloadAsPng, downloadAsSvg } from '../../utils/imageExport';
import { 
  User, 
  Sparkles, 
  Check, 
  Copy, 
  Save, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  Eye,
  Download,
  Calculator,
  HelpCircle,
  ShieldCheck,
  FileText,
  Layers,
  Compass,
  Heart,
  Zap,
  Disc,
  Share2,
  PlusCircle,
  Binary,
  MessageSquare,
  Send,
  RotateCcw,
  UserCheck,
  Users,
  Plus,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  ZoomIn
} from 'lucide-react';

interface NewDesignWizardProps {
  initialPerson?: PersonData | null;
  savedClients: PersonData[];
  onSaveRecipe: (recipe: TattooRecipe) => void;
  onSaveClient: (client: PersonData) => void;
  onSelectClient?: (client: PersonData | null) => void;
  onViewArchive: () => void;
  onNavigateToClients?: () => void;
  onStartNewClient?: () => void;
  initialMainSymbol?: string | null;
  initialSelectedStyle?: string | null;
}

export const NewDesignWizard: React.FC<NewDesignWizardProps> = ({
  initialPerson,
  savedClients,
  onSaveRecipe,
  onSaveClient,
  onSelectClient,
  onViewArchive,
  onNavigateToClients,
  onStartNewClient,
  initialMainSymbol,
  initialSelectedStyle
}) => {
  const [step, setStep] = useState<number>(1);

  // Modals state
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showTotemQuizModal, setShowTotemQuizModal] = useState<boolean>(false);
  const [showCalcModal, setShowCalcModal] = useState<boolean>(false);
  const [showIntakeLinkModal, setShowIntakeLinkModal] = useState<boolean>(false);
  const [calcModalTab, setCalcModalTab] = useState<'numerology' | 'astrology'>('numerology');

  // Current client ID tracking (prevents data collision & ensures update-in-place)
  const [currentClientId, setCurrentClientId] = useState<string | null>(initialPerson?.id || null);

  // Form State - Step 1
  const [name, setName] = useState(initialPerson?.name || '');
  const [birthDate, setBirthDate] = useState(initialPerson?.birthDate || '');
  const [birthTime, setBirthTime] = useState(initialPerson?.birthTime || '');
  const [birthPlace, setBirthPlace] = useState(initialPerson?.birthPlace || '');
  const [selectedLocation, setSelectedLocation] = useState<ResolvedLocation | null>(null);
  const [motherName, setMotherName] = useState(initialPerson?.motherName || '');
  const [existingTotems, setExistingTotems] = useState(initialPerson?.existingTotems || '');
  const [existingSymbols, setExistingSymbols] = useState(initialPerson?.existingSymbols || '');
  const [personalNumbers, setPersonalNumbers] = useState(initialPerson?.personalNumbers || '');
  const [personalStory, setPersonalStory] = useState(initialPerson?.personalStory || '');
  const [zodiacSystem, setZodiacSystem] = useState<'Tropical' | 'Sidereal'>(initialPerson?.zodiacSystem || 'Tropical');
  const [notes, setNotes] = useState(initialPerson?.notes || '');
  const [totemAnswers, setTotemAnswers] = useState<Record<number, string>>(initialPerson?.totemAnswers || {});
  const [enneagramAnswers, setEnneagramAnswers] = useState<Record<number, number>>(initialPerson?.enneagramAnswers || {});
  const [showAdvancedEsoteric, setShowAdvancedEsoteric] = useState<boolean>(false);
  const [clientSaveFeedback, setClientSaveFeedback] = useState<string | null>(null);

  // Calculated Profiles - Step 2 & 3
  const [numerology, setNumerology] = useState<NumerologyProfile | null>(null);
  const [astrology, setAstrology] = useState<AstrologyProfile | null>(null);
  const [enneagram, setEnneagram] = useState<EnneagramProfile | null>(null);
  const [symbolism, setSymbolism] = useState<SymbolismProfile | null>(null);
  const [chakra, setChakra] = useState<ChakraProfile | null>(null);

  // Custom Enneagram Selection Override
  const [selectedEnneaType, setSelectedEnneaType] = useState<number>(initialPerson?.enneagramType || 4);
  const [selectedWing, setSelectedWing] = useState<string>(initialPerson?.enneagramWing || '4w5');

  // Tattoo Parameters - Step 4
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Fine Line', 'Geometric']);
  const [composition, setComposition] = useState<string>('Dinamik Asimetrik & Kutsal Odak');
  const [orientation, setOrientation] = useState<'Dikey (Anatomik)' | 'Yatay (Dinamik)' | 'Sarmal (Spiral)' | 'Organik Akış'>('Dikey (Anatomik)');
  const [bodyPlacement, setBodyPlacement] = useState<string>('Önkol İç (Forearm)');
  const [density, setDensity] = useState<'Minimal & Boşluklu (%20)' | 'Hafif & Havadar (%40)' | 'Dengeli & Net (%60)' | 'Yoğun & Detaylı (%80)' | 'Maksimalist & Dolu (%95)'>('Dengeli & Net (%60)');
  const [colorScheme, setColorScheme] = useState<'Saf Monokrom Siyah' | 'Black & Grey (Gri Gölgelendirme)' | 'Tekil Vurgu Rengi (Kırmızı/Altın)' | 'Soğuk Çift Ton (Füme & Buz Mavisi)' | 'Zengin Polikrom Renk'>('Saf Monokrom Siyah');
  const [visualAtmosphere, setVisualAtmosphere] = useState<string>('Mistik & Ezoterik');
  
  // Custom Symbol Overrides
  const [customMainSymbol, setCustomMainSymbol] = useState<string>('');
  const [customSecondarySymbols, setCustomSecondarySymbols] = useState<string[]>([]);
  const [newSecSymbolInput, setNewSecSymbolInput] = useState<string>('');

  // Totem Hayvanı Tasarıma Dahil Edilsin mi? (Ekleme / Çıkarma Tercihi)
  const [includeTotemInDesign, setIncludeTotemInDesign] = useState<boolean>(false);

  // Mors Alfabesi Rakam Şifreleme State (Zorunlu Değildir - İsteğe Bağlı)
  const [useMorseCodeForNumbers, setUseMorseCodeForNumbers] = useState<boolean>(false);
  const [customMorseInput, setCustomMorseInput] = useState<string>('');
  const [showMorseModal, setShowMorseModal] = useState<boolean>(false);

  // Danışana Gönderilecek Özel Konsültasyon & Şifa Dosyası State
  const [showClientDossierModal, setShowClientDossierModal] = useState<boolean>(false);

  // Enneagram Müşteriye Gönderme & Cevap Alma State
  const [showEnneagramShareModal, setShowEnneagramShareModal] = useState<boolean>(false);
  const [showClientQuizView, setShowClientQuizView] = useState<boolean>(false);

  // Generated Recipe - Step 5
  const [generatedRecipe, setGeneratedRecipe] = useState<TattooRecipe | null>(null);
  const [copiedPromptType, setCopiedPromptType] = useState<string | null>(null);
  const [promptViewTab, setPromptViewTab] = useState<'shadow-dossier' | 'client-letter' | 'midjourney' | 'dalle3' | 'flux' | 'stencil' | 'specsheet' | 'explanation' | 'negative'>('shadow-dossier');
  const [step5ViewMode, setStep5ViewMode] = useState<'shadow-report' | 'symbol-integration' | 'studio-grid'>('shadow-report');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Visual Sketch & 03RL Stencil Generation State
  const [isGeneratingSketch, setIsGeneratingSketch] = useState<boolean>(false);
  const [sketchStatus, setSketchStatus] = useState<string>('');
  const [generatedSketchUrl, setGeneratedSketchUrl] = useState<string | null>(null);
  const [generatedSvgUrl, setGeneratedSvgUrl] = useState<string | null>(null);
  const [sketchMode, setSketchMode] = useState<'flash' | 'stencil'>('flash');
  const [sketchSeed, setSketchSeed] = useState<number>(() => Math.floor(100000 + Math.random() * 900000));
  const [sketchVariationIndex, setSketchVariationIndex] = useState<number>(1);
  const [sketchModalOpen, setSketchModalOpen] = useState<boolean>(false);
  const [profileValidationError, setProfileValidationError] = useState<string | null>(null);

  // Library preselection synchronization
  useEffect(() => {
    if (initialMainSymbol) {
      setCustomMainSymbol(initialMainSymbol);
      setStep(4);
    }
  }, [initialMainSymbol]);

  useEffect(() => {
    if (initialSelectedStyle) {
      setSelectedStyles(prev => prev.includes(initialSelectedStyle) ? prev : [...prev, initialSelectedStyle]);
      setStep(4);
    }
  }, [initialSelectedStyle]);

  // Auto-calculate profile whenever person data changes
  useEffect(() => {
    let cancelled = false;

    const calculateProfiles = async () => {
      // Danışan ismi, doğum tarihi veya doğum yeri eksikse hesaplama yapılmaz
      if (!name.trim() || !birthDate || !birthPlace?.trim()) {
        setProfileValidationError(null);
        setNumerology(null);
        setAstrology(null);
        setEnneagram(null);
        setSymbolism(null);
        setChakra(null);
        return;
      }

      try {
        validateCalendarDate(birthDate);

        // Önce seçilmiş/doğrulanmış konumu kullan; yoksa küresel geocoding ile çöz.
        const resolvedLoc = selectedLocation || await resolveCityLocationAsync(birthPlace);
        if (cancelled) return;
        if (!selectedLocation && resolvedLoc) setSelectedLocation(resolvedLoc as any);

        const num = calculateNumerology(name, birthDate);
        const astro = calculateAstrology(birthDate, birthTime, birthPlace, zodiacSystem, resolvedLoc);
        const ennea = getEnneagramProfile(selectedEnneaType, selectedWing);

        const personalInput = {
          name: name.trim(),
          birthDate,
          birthTime: birthTime || '12:00',
          birthPlace: resolvedLoc.displayName || resolvedLoc.name || birthPlace.trim(),
          motherName: motherName || '',
          personalNumbers: personalNumbers || '',
          personalStory: personalStory || '',
          zodiacSystem,
          totemAnswers: Object.keys(totemAnswers).length > 0 ? totemAnswers : undefined,
          enneagramType: selectedEnneaType
        };

        const symb = deriveSymbolismProfile(num, astro, ennea, personalInput);
        const chk = calculateChakraProfile(num, astro);
        if (cancelled) return;

        setNumerology(num);
        setAstrology(astro);
        setEnneagram(ennea);
        setSymbolism(symb);
        setChakra(chk);
        setProfileValidationError(null);

        if (includeTotemInDesign) {
          setCustomMainSymbol(symb.totemAnimal);
        } else if (!customMainSymbol || customMainSymbol === symb.totemAnimal || symb.totemHierarchy?.some(t => t.name === customMainSymbol)) {
          setCustomMainSymbol(symb.sacredObject || symb.geometricSymbol || 'Kutsal Geometri & Yaşam Çiçeği');
        }
        setCustomSecondarySymbols([symb.plantFlora, symb.geometricSymbol, symb.sacredObject]);
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setProfileValidationError(msg);
        setNumerology(null);
        setAstrology(null);
        setEnneagram(null);
        setSymbolism(null);
        setChakra(null);
      }
    };

    void calculateProfiles();
    return () => { cancelled = true; };
}, [name, birthDate, birthTime, birthPlace, selectedLocation, motherName, personalNumbers, personalStory, zodiacSystem, selectedEnneaType, selectedWing, includeTotemInDesign, totemAnswers]);

  // Helper to load full client data into state cleanly
  const handleApplyClientData = (client: PersonData) => {
    setCurrentClientId(client.id);
    setName(client.name || '');
    setBirthDate(client.birthDate || '');
    setBirthTime(client.birthTime || '');
    setBirthPlace(client.birthPlace || '');
    if (client.birthLatitude && client.birthLongitude) {
      setSelectedLocation({
        id: `loc_${client.id}`,
        name: client.birthPlace || '',
        displayName: client.birthPlace || '',
        city: client.birthCity || client.birthPlace || '',
        region: client.birthRegion,
        country: client.birthCountry || '',
        countryCode: client.birthCountryCode || '',
        lat: client.birthLatitude,
        lon: client.birthLongitude,
        timezone: client.birthTimezone || 'Europe/Istanbul',
        defaultTz: client.birthTimezoneOffset
      });
    } else {
      setSelectedLocation(null);
    }
    setMotherName(client.motherName || '');
    setExistingTotems(client.existingTotems || '');
    setExistingSymbols(client.existingSymbols || '');
    setPersonalNumbers(client.personalNumbers || '');
    setPersonalStory(client.personalStory || '');
    setZodiacSystem(client.zodiacSystem || 'Tropical');
    setNotes(client.notes || '');
    setSelectedEnneaType(client.enneagramType || 4);
    setSelectedWing(client.enneagramWing || '4w5');
    setTotemAnswers(client.totemAnswers || {});
    setEnneagramAnswers(client.enneagramAnswers || {});
    setIncludeTotemInDesign(false);
    setCustomMainSymbol('');
    setCustomSecondarySymbols([]);
    setGeneratedRecipe(null);
    setSymbolism(null);
    setNumerology(null);
    setAstrology(null);
    setEnneagram(null);
    setChakra(null);
    setIsSaved(false);
  };

  // Synchronize when initialPerson prop changes from outside (e.g. from ClientsView or Navigation)
  useEffect(() => {
    if (initialPerson) {
      if (initialPerson.id !== currentClientId) {
        handleApplyClientData(initialPerson);
      }
    } else if (initialPerson === null && currentClientId !== null) {
      handleStartFreshDesign(false);
    }
  }, [initialPerson]);

  // Handle Loading a Saved Client from Dropdown
  const handleSelectSavedClient = (client: PersonData) => {
    handleApplyClientData(client);
    if (onSelectClient) {
      onSelectClient(client);
    }
    setClientSaveFeedback(`✓ "${client.name}" seçildi, kayıtlı bilgileri forma yüklendi.`);
    setTimeout(() => setClientSaveFeedback(null), 3500);
  };

  // Yeni Kişi / Yeni Tasarım Başlatma (Her şeyi temiz bir başlangıçla sıfırlar)
  const handleStartFreshDesign = (notifyParent = true) => {
    setCurrentClientId(null);
    setName('');
    setBirthDate('');
    setBirthTime('');
    setBirthPlace('');
    setMotherName('');
    setExistingTotems('');
    setExistingSymbols('');
    setPersonalNumbers('');
    setPersonalStory('');
    setNotes('');
    setTotemAnswers({});
    setEnneagramAnswers({});
    setZodiacSystem('Tropical');
    setSelectedEnneaType(4);
    setSelectedWing('4w5');
    setIncludeTotemInDesign(false);
    setUseMorseCodeForNumbers(false);
    setCustomMorseInput('');
    setShowClientDossierModal(false);
    setCustomMainSymbol('');
    setCustomSecondarySymbols([]);
    setGeneratedRecipe(null);
    setIsSaved(false);
    setNumerology(null);
    setAstrology(null);
    setEnneagram(null);
    setSymbolism(null);
    setChakra(null);
    setStep(1);

    if (notifyParent && onSelectClient) {
      onSelectClient(null);
    }
    if (notifyParent && onStartNewClient) {
      onStartNewClient();
    }

    setClientSaveFeedback('✓ Form tamamen sıfırlandı. Yeni danışan bilgilerini girebilirsiniz.');
    setTimeout(() => setClientSaveFeedback(null), 3000);
  };

  // Step 1 Doğrudan Kişi Kaydetme / Güncelleme
  const handleSaveCurrentClient = (asNew: boolean = false) => {
    if (!name.trim()) {
      setClientSaveFeedback('⚠️ Lütfen danışanın adını girin.');
      setTimeout(() => setClientSaveFeedback(null), 3500);
      return;
    }
    if (!birthDate) {
      setClientSaveFeedback('⚠️ Lütfen doğum tarihini seçin.');
      setTimeout(() => setClientSaveFeedback(null), 3500);
      return;
    }

    const idToUse = (!asNew && currentClientId) ? currentClientId : `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const personToSave: PersonData = {
      id: idToUse,
      name: name.trim(),
      birthDate,
      birthTime: birthTime.trim() || undefined,
      birthPlace: birthPlace.trim() || undefined,
      motherName: motherName.trim() || undefined,
      zodiacSystem,
      enneagramType: selectedEnneaType,
      enneagramWing: selectedWing,
      enneagramAnswers: Object.keys(enneagramAnswers).length > 0 ? enneagramAnswers : undefined,
      totemAnswers: Object.keys(totemAnswers).length > 0 ? totemAnswers : undefined,
      primaryTotemId: symbolism?.totemTestResult?.primaryTotem?.id,
      totemConfidenceScore: symbolism?.totemTestResult?.confidenceScore,
      existingTotems: existingTotems.trim() || undefined,
      existingSymbols: existingSymbols.trim() || undefined,
      personalNumbers: personalNumbers.trim() || undefined,
      personalStory: personalStory.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: (!asNew && currentClientId)
        ? (savedClients.find(c => c.id === currentClientId)?.createdAt || new Date().toISOString())
        : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveClient(personToSave);
    setCurrentClientId(idToUse);
    if (onSelectClient) {
      onSelectClient(personToSave);
    }
    setClientSaveFeedback(`✓ "${personToSave.name}" bilgileri başarıyla ${asNew ? 'yeni kişi olarak' : ''} kaydedildi ve rehberde güncellendi!`);
    setTimeout(() => setClientSaveFeedback(null), 4000);
  };

  // Build the Final Recipe
  const handleGenerateRecipe = () => {
    if (!numerology || !astrology || !enneagram || !symbolism) return;

    const idToUse = currentClientId || initialPerson?.id || `client_${Date.now()}`;
    const person: PersonData = {
      id: idToUse,
      name: name.trim() || 'Misafir',
      birthDate,
      birthTime: birthTime.trim() || undefined,
      birthPlace: birthPlace.trim() || undefined,
      motherName: motherName.trim() || undefined,
      zodiacSystem,
      enneagramType: selectedEnneaType,
      enneagramWing: selectedWing,
      enneagramAnswers: Object.keys(enneagramAnswers).length > 0 ? enneagramAnswers : undefined,
      totemAnswers: Object.keys(totemAnswers).length > 0 ? totemAnswers : undefined,
      primaryTotemId: symbolism?.totemTestResult?.primaryTotem?.id,
      totemConfidenceScore: symbolism?.totemTestResult?.confidenceScore,
      existingTotems: existingTotems.trim() || undefined,
      existingSymbols: existingSymbols.trim() || undefined,
      personalNumbers: personalNumbers.trim() || undefined,
      personalStory: personalStory.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: initialPerson?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!currentClientId) {
      setCurrentClientId(idToUse);
    }

    const isTotemName = customMainSymbol === symbolism.totemAnimal ||
      symbolism.totemHierarchy?.some(t => t.name === customMainSymbol) ||
      symbolism.secondaryAnimals?.includes(customMainSymbol);

    const determinedMainSymbol = includeTotemInDesign
      ? (customMainSymbol || symbolism.totemAnimal)
      : (customMainSymbol && !isTotemName
          ? customMainSymbol
          : (symbolism.sacredObject || symbolism.geometricSymbol || 'Kutsal Geometri'));

    const parameters: TattooDesignParameters = {
      selectedStyles: selectedStyles.length > 0 ? selectedStyles : ['Fine Line', 'Black & Grey'],
      composition,
      orientation,
      bodyPlacement,
      density,
      colorScheme,
      mainSymbol: determinedMainSymbol,
      secondarySymbols: customSecondarySymbols.length > 0 
        ? customSecondarySymbols.filter(s => includeTotemInDesign || (s !== symbolism.totemAnimal && !symbolism.totemHierarchy?.some(t => t.name === s) && !symbolism.secondaryAnimals?.includes(s)))
        : (includeTotemInDesign ? [symbolism.plantFlora, symbolism.geometricSymbol] : [symbolism.plantFlora, symbolism.geometricSymbol, symbolism.sacredObject]),
      visualAtmosphere,
      includeTotemInDesign,
      useMorseCodeForNumbers,
      customMorseInput: customMorseInput.trim() || undefined
    };

    const recipe = generateTattooRecipe(person, numerology, astrology, enneagram, symbolism, parameters);
    setGeneratedRecipe(recipe);
    setStep(5);
    setIsSaved(false);
  };

  // Generate Visual Sketch or Stencil via AI & Vector Engine
  const handleGenerateSketch = async (targetMode?: 'flash' | 'stencil') => {
    if (!generatedRecipe) return;
    const modeToUse = targetMode || sketchMode;
    setSketchMode(modeToUse);
    setIsGeneratingSketch(true);
    setSketchStatus(modeToUse === 'stencil' ? '03RL Vektör & Termal Stencil hazırlanıyor...' : 'Ezoterik Dövme Flaşı çiziliyor...');

    try {
      const promptToUse = modeToUse === 'stencil'
        ? (generatedRecipe.stencilPrompt || generatedRecipe.masterOutlinePrompt || generatedRecipe.masterEnglishPrompt)
        : (generatedRecipe.masterShadedPrompt || generatedRecipe.masterEnglishPrompt);

      const response = await fetch('/api/ai/generate-sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe: generatedRecipe,
          mode: modeToUse,
          seed: sketchSeed,
          variationIndex: sketchVariationIndex,
          prompt: promptToUse
        })
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setGeneratedSketchUrl(data.imageUrl);
        setGeneratedSvgUrl(data.svgUrl || null);
        setGeneratedRecipe(prev => prev ? { ...prev, generatedSketchUrl: data.imageUrl } : null);
        setSketchStatus(`✓ ${modeToUse === 'stencil' ? 'Termal Stencil (03RL)' : 'Dövme Flaşı'} (#${sketchVariationIndex}) başarıyla oluşturuldu!`);
        setSketchVariationIndex(prev => prev + 1);
        setTimeout(() => setSketchStatus(''), 4500);
      } else {
        setSketchStatus('⚠️ Görsel oluşturulamadı.');
        setTimeout(() => setSketchStatus(''), 3500);
      }
    } catch (err) {
      console.error('Sketch generation error:', err);
      setSketchStatus('⚠️ Sunucu bağlantı hatası.');
      setTimeout(() => setSketchStatus(''), 3500);
    } finally {
      setIsGeneratingSketch(false);
    }
  };

  // Toggle Styles
  const toggleStyle = (styleName: string) => {
    if (selectedStyles.includes(styleName)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter(s => s !== styleName));
      }
    } else {
      setSelectedStyles([...selectedStyles, styleName]);
    }
  };

  // Copy Prompt Helper
  const copyPromptToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPromptType(type);
    setTimeout(() => setCopiedPromptType(null), 2500);
  };

  const handleCopyAllPrompts = () => {
    if (!generatedRecipe) return;
    const r = generatedRecipe;
    const text = `=====================================================
DÖVME TASARIM PROMPT DOSYASI & TEKNİK BRİFİ
Danışan: ${r.clientName}
Tasarım: ${r.title}
Tarih: ${new Date(r.createdAt).toLocaleDateString('tr-TR')}
=====================================================

1. MIDJOURNEY v6.1 / NIJI 6 MASTER PROMPT:
${r.midjourneyPrompt || r.masterShadedPrompt || r.masterEnglishPrompt}

2. DALL-E 3 MASTER TATTOO FLASH PROMPT:
${r.dalle3Prompt || r.masterEnglishPrompt}

3. 03RL TERMAL STENCIL / TRANSFER ÇİZİM PROMPTU:
${r.stencilPrompt || r.masterOutlinePrompt || r.masterEnglishPrompt}

4. FLUX.1 PRO / STABLE DIFFUSION XL PROMPT:
[Pozitif]:
${r.fluxPrompt || r.masterEnglishPrompt}

[Negatif]:
${r.negativePrompt}

5. DÖVME SANATÇISI TEKNİK UYGULAMA BRİFİ (SPEC SHEET):
${r.artistSpecSheet || r.needleAndTechniqueGuide}

6. TÜRKÇE VERİ AKIŞ HARİTASI & ANLAM REÇETESİ:
${r.turkishPromptExplanation}
`;
    navigator.clipboard.writeText(text);
    setCopiedPromptType('all');
    setTimeout(() => setCopiedPromptType(null), 2500);
  };

  // Save Recipe & Client
  const handleSaveAll = () => {
    if (!generatedRecipe) return;
    onSaveRecipe(generatedRecipe);
    onSaveClient(generatedRecipe.personData);
    if (onSelectClient) {
      onSelectClient(generatedRecipe.personData);
    }
    setIsSaved(true);
  };

  // Comprehensive Tattoo Recipe JSON Exporter
  const handleDownloadRecipeJson = () => {
    if (!generatedRecipe) return;
    downloadRecipeAsJson(generatedRecipe);
  };

  // Comprehensive Tattoo Recipe & Prompt Document Exporter (.md)
  const handleDownloadFullRecipeMarkdown = () => {
    if (!generatedRecipe) return;

    const r = generatedRecipe;
    const clientSafe = (r.clientName || 'Danisan').replace(/\s+/g, '_');
    const filename = `Dovme_Tasarim_Recetesi_${clientSafe}.md`;

    // Prioritize Full 12-Section Shadow Archetype Dossier if available
    if (r.shadowAnalysis?.fullMarkdownDossier) {
      const blob = new Blob([r.shadowAnalysis.fullMarkdownDossier], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      return;
    }

    const chakraSection = r.chakra ? `
## 3. 7+2 ÇAKRA DİZİLİMİ & ENERJİ FREKANS HARİTASI
- **Genel Çakra Denge Skoru:** ${r.chakra.overallChakraBalanceScore} / 100
- **Birincil Şifa & Dengeleme Yönergesi:** ${r.chakra.primaryHealingDirective}

### Çakra Frekans Dökümü:
${r.chakra.chakras.map(c => `
- **${c.number}. ${c.turkishName} (${c.sanskritName}):**
  * Frekans Adedi: ${c.frequencyCount} | Durum: **${c.status}**
  * Bölge: ${c.location} | Element: ${c.element} | Renk: ${c.color}
  * Kutsal Yantra: ${c.yantraGeometry}
  * Dengeleyici Şifa Sembolleri: ${c.healingSymbols.join(', ')}
  * Dövme Yerleşim Tavsiyesi: ${c.tattooPlacementAdvice}
`).join('')}
` : '';

    const totemSection = r.symbolism?.totemHierarchy && r.symbolism.totemHierarchy.length > 0 ? `
## 4. RUHANİ TOTEM HAYVANI HİYERARŞİSİ
${r.symbolism.totemHierarchy.map((t, idx) => `
### ${idx + 1}. ${t.role}: ${t.name}
- **Hesaplama Kaynağı:** ${t.origin}
- **Ezoterik Anlamı:** ${t.meaning}
- **Arketipik Gücü:** ${t.archetypalPower}
- **Dövmedeki Görsel Rolü:** ${t.visualRoleInTattoo}
`).join('')}
` : '';

    const neededSymbolsSection = r.symbolism?.neededSymbols && r.symbolism.neededSymbols.length > 0 ? `
## 5. KİŞİNİN İHTİYAÇ DUYDUĞU DENGELEYİCİ SEMBOLLER & GEREKÇELERİ
${r.symbolism.neededSymbols.map((s, idx) => `
### ${idx + 1}. ${s.symbolName} (${s.category})
- **Dengelediği Eksiklik:** ${s.targetDeficiency}
- **Ezoterik & Matematiksel Gerekçe:** ${s.esotericRationale}
- **Dövmedeki Kompozisyonel Konumu:** ${s.compositionPlacement}
`).join('')}
` : '';

    const markdownContent = `
# DÖVME TASARIM REÇETESİ & EZOTERİK AI PROMPT DOSYASI
**Danışan:** ${r.clientName}
**Tarih:** ${new Date(r.createdAt).toLocaleDateString('tr-TR')}
**Reçete Başlığı:** ${r.title}

---

## 1. DANIŞAN VE DOĞUM VERİLERİ
- **Doğum Tarihi & Saati:** ${r.personData.birthDate} ${r.personData.birthTime || ''}
- **Doğum Yeri:** ${r.personData.birthPlace || 'Belirtilmedi'}
- **Zodyak Sistemi:** ${r.personData.zodiacSystem || 'Tropical'}
- **Danışan Notları:** ${r.personData.notes || 'Yok'}

---

## 2. NUMEROLOJİ VE ASTROLOJİ ANALİZİ
### Numerolojik Matris:
- **Yaşam Yolu (Life Path):** ${r.numerology.lifePathNumber} - ${r.numerology.lifePathTitle}
- **Ana Kulvar / İfade (Destiny):** ${r.numerology.destinyNumber} - ${r.numerology.destinyTitle}
- **Yan Kulvar / Kalp Arzusu (Soul Urge):** ${r.numerology.soulUrgeNumber} - ${r.numerology.soulUrgeTitle}
- **Dünya Misyonu (DM):** ${r.numerology.dmNumber} - ${r.numerology.dmTitle}
- **19 İlahi Yardım Durumu:** ${r.numerology.divineHelp19.level} (${r.numerology.divineHelp19.reason})
- **Karmik Borç / Eksik Sayılar:** ${r.numerology.missingNumbers.join(', ') || 'Yok (Tüm sayılar mevcut)'}
- **Kişisel Yıl:** ${r.numerology.personalYear} (${r.numerology.personalYearTheme})

### Astroloji Göstergeleri:
- **Güneş Burcu:** ${r.astrology.sunSign} ${r.astrology.sunSignSymbol} (${r.astrology.sunDegreeFormatted})
- **Ay Burcu:** ${r.astrology.moonSign} ${r.astrology.moonSignSymbol} (${r.astrology.moonDegreeFormatted}) ${r.astrology.isMoonNearCusp ? '[Ay 29° Anaretik Cusp]' : ''}
- **Yükselen Burç (ASC):** ${r.astrology.ascendantSign} ${r.astrology.ascendantSignSymbol} (${r.astrology.ascendantDegreeFormatted})
- **Hakim Element:** ${r.astrology.dominantElement}
- **Yönetici Gezegen:** ${r.astrology.rulingPlanet}
- **Enneagram Tipi:** Tip ${r.enneagram.typeName} (${r.enneagram.wing}) - ${r.enneagram.coreMotivation}

${chakraSection}

${totemSection}

${neededSymbolsSection}

---

## 6. DÖVME SANATÇISI TEKNİK UYGULAMA REÇETESİ
- **Seçilen Stiller:** ${r.parameters.selectedStyles.join(' + ')}
- **Hedef Vücut Bölgesi & Yerleşim:** ${r.parameters.bodyPlacement} (${r.parameters.orientation})
- **Kompozisyon Kurgusu:** ${r.parameters.composition}
- **Yoğunluk & Negatif Alan:** ${r.parameters.density} (${r.feasibility.negativeSpaceRatio})
- **Renk ve Tonlama:** ${r.parameters.colorScheme}
- **İğne Seçimi & Çizgi Kalınlığı:** ${r.feasibility.lineWeight}
- **Gölgelendirme Tekniği:** ${r.feasibility.shadingTechnique}
- **Yaşlanma / Blowout Koruması:** ${r.feasibility.agingBlowoutRisk}
- **Önerilen Ölçü:** ${r.feasibility.recommendedSize}
- **Uygulanabilirlik Skoru:** ${r.feasibility.overallFeasibilityScore}/100

---

## 7. AI DÖVME PROMPT SUITE & TEKNİK BRİFİ

### A. Midjourney v6.1 / Niji 6 Master Prompt
\`\`\`
${r.midjourneyPrompt || r.masterShadedPrompt || r.masterEnglishPrompt}
\`\`\`

### B. DALL-E 3 Master Tattoo Flash Plate Prompt
\`\`\`
${r.dalle3Prompt || r.masterEnglishPrompt}
\`\`\`

### C. 03RL / 05RL Thermal Stencil & Pure Contour Prompt (Transfer Çizimi)
\`\`\`
${r.stencilPrompt || r.masterOutlinePrompt || r.masterEnglishPrompt}
\`\`\`

### D. Flux.1 Pro / Stable Diffusion XL Prompt
**Pozitif Prompt:**
\`\`\`
${r.fluxPrompt || r.masterEnglishPrompt}
\`\`\`

**Anti-Slop & Anti-Mockup Negatif Prompt:**
\`\`\`
${r.negativePrompt}
\`\`\`

### E. Dövme Sanatçısı Teknik Uygulama Brifi (Studio Spec Sheet)
\`\`\`
${r.artistSpecSheet || r.needleAndTechniqueGuide}
\`\`\`

### F. Türkçe Veri Akış Haritası & Ezoterik Anlam Reçetesi
${r.turkishPromptExplanation}

---
*Bu dövme reçetesi, kadim ezoterik numeroloji, efemeris astrolojisi, 7+2 çakra sistemi ve profesyonel dövme zanaatı kriterlerine göre tam uyumla oluşturulmuştur.*
    `.trim();

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  // Helper for Element Icons
  const renderElementBadge = (elementName: string) => {
    switch (elementName) {
      case 'Ateş':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs"><Flame className="w-3 h-3" /> Ateş</span>;
      case 'Su':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs"><Droplets className="w-3 h-3" /> Su</span>;
      case 'Hava':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs"><Wind className="w-3 h-3" /> Hava</span>;
      case 'Toprak':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs"><Mountain className="w-3 h-3" /> Toprak</span>;
      default:
        return <span className="text-xs text-zinc-300">{elementName}</span>;
    }
  };

  // Dedicated Client Quiz Mode (in-wizard client experience)
  if (showClientQuizView) {
    return (
      <ClientEnneagramQuizView
        clientName={name || 'Danışan'}
        onReturnToStudio={() => setShowClientQuizView(false)}
        onCompletedAnswers={(type, wing) => {
          setSelectedEnneaType(type);
          setSelectedWing(wing);
          if (enneagram) {
            setEnneagram({
              ...getEnneagramProfile(type, wing),
              isDeterminedByTest: true
            });
          }
          setShowClientQuizView(false);
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-24 space-y-6">
      {/* Immersive Top Bar / Header */}
      <header className="border-b border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 bg-[#080808]/80 backdrop-blur-md p-4 rounded-xl">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[2px] text-[#666] font-mono">
              ADIM {step}/5: <b className="text-white font-sans">{
                step === 1 ? 'Kişi & Doğum Verileri' :
                step === 2 ? 'Ezoterik Matris' :
                step === 3 ? 'Sembolizm & Arketipler' :
                step === 4 ? 'Dövme Parametreleri' : 'Sentez & Master Prompt'
              }</b>
            </span>
          </div>

          <div className="flex space-x-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-6 sm:w-8 h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-[#c4a47c] shadow-[0_0_6px_#c4a47c]' : 'bg-[#222]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-1.5 border border-[#333] hover:border-[#c4a47c] text-[#999] hover:text-[#e0e0e0] text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri</span>
            </button>
          )}

          {step === 5 && (
            <>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaved}
                className={`px-3.5 py-1.5 border text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSaved
                    ? 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20'
                    : 'border-[#333] hover:border-[#c4a47c] text-[#e0e0e0]'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5 text-[#c4a47c]" />}
                <span>{isSaved ? 'Kaydedildi' : 'Arşive Kaydet'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadFullRecipeMarkdown}
                title="Tüm hesaplamaları, çakra haritasını, totemleri ve AI promptlarını Markdown olarak indir"
                className="px-4 py-1.5 bg-[#c4a47c] hover:bg-[#b89569] text-black text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#c4a47c]/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Dövme Dosyasını İndir (.md)</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* STEP 1: Kişi Bilgileri */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#1a1a1a] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold">
                <span className="mr-2">◆</span> Kişi & Doğum Bilgileri
              </h3>
              <span className="text-[10px] text-[#666] font-mono uppercase tracking-wider">Otomatik Profilleme</span>
            </div>

            {/* Feedback Alert Banner */}
            {clientSaveFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg shadow-emerald-950/30 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{clientSaveFeedback}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setClientSaveFeedback(null)}
                  className="text-emerald-400/70 hover:text-emerald-300 text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* KAYITLI DANIŞAN YÖNETİM & SEÇİM PANELİ */}
            <div className={`mb-5 p-4 rounded-xl border transition-all ${
              currentClientId 
                ? 'bg-[#12100a] border-[#c4a47c]/40 shadow-lg shadow-[#c4a47c]/5' 
                : 'bg-[#0d0d0d] border-[#222]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className={`w-4 h-4 ${currentClientId ? 'text-[#c4a47c]' : 'text-[#777]'}`} />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                    {currentClientId ? 'Kayıtlı Danışan Formu' : 'Danışan Seçimi & Kayıt'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {onNavigateToClients && (
                    <button
                      type="button"
                      onClick={onNavigateToClients}
                      className="text-[10px] text-[#888] hover:text-[#c4a47c] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Users className="w-3 h-3" />
                      <span>Tüm Rehber ({savedClients.length})</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowIntakeLinkModal(true)}
                    className="text-[11px] font-mono font-bold text-white px-3 py-1 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#333] hover:border-[#c4a47c] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Müşteriye tek bir danışan bilgi formu linki oluşturur"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Danışan Formu Linki</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartFreshDesign()}
                    className="text-[11px] font-mono font-bold text-[#c4a47c] hover:text-white px-3 py-1 rounded-lg bg-[#1a1710] hover:bg-[#262114] border border-[#c4a47c]/50 hover:border-[#c4a47c] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Formu tamamen temizle ve yeni bir danışan oturumu başlat"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>+ Yeni Kişi Başlat</span>
                  </button>
                </div>
              </div>

              {/* Dropdown Selector */}
              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#777] block mb-1 font-mono">
                    Kayıtlı Kişilerden Seç veya Yeni Başlat:
                  </label>
                  <select
                    value={currentClientId || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (!selectedId) {
                        handleStartFreshDesign();
                      } else {
                        const found = savedClients.find(c => c.id === selectedId);
                        if (found) {
                          handleSelectSavedClient(found);
                        }
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-[#141414] border border-[#2d2d2d] focus:border-[#c4a47c] rounded-lg text-xs text-[#e0e0e0] font-medium outline-none transition-colors"
                  >
                    <option value="">＋ Yeni Danışan Formu (Sıfırdan Tanımla)</option>
                    {savedClients.map(c => (
                      <option key={c.id} value={c.id}>
                        👤 {c.name} ({c.birthDate}{c.birthPlace ? ` • ${c.birthPlace}` : ''})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status & Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1e1e1e]">
                  <div className="text-[11px] font-mono">
                    {currentClientId ? (
                      <span className="text-[#c4a47c] flex items-center gap-1">
                        <span>● Kayıtlı Kişi:</span>
                        <strong className="text-white">{name}</strong>
                      </span>
                    ) : (
                      <span className="text-zinc-500">
                        ○ Yeni Danışan (Kaydetmek için butona basın)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentClientId ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveCurrentClient(false)}
                          className="px-3 py-1.5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          title="Bu danışanın bilgilerindeki değişiklikleri güncelle"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Bilgileri Güncelle</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveCurrentClient(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] hover:border-[#c4a47c] text-[#ccc] hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Mevcut kişiyi değiştirmeden bu verilerle yeni bir danışan kaydı oluştur"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Farklı Kaydet</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSaveCurrentClient(false)}
                        className="px-3 py-1.5 rounded-lg bg-[#1a150e] hover:bg-[#282014] border border-[#c4a47c]/70 text-[#c4a47c] hover:text-[#d8ba92] font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        title="Forma girilen bilgileri rehbere yeni danışan olarak kaydet"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Kişiyi Rehbere Kaydet</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Kişiselleştirilmiş Arketip & Davranış Testleri Paneli */}
            <div className="mb-5 p-3.5 rounded-xl bg-[#0e0e14] border border-[#1e1e2c] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#c4a47c] uppercase tracking-wider font-mono font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Kişisel Arketip Testleri</span>
                </span>
                <span className="text-[10px] text-[#666] font-mono">Doğum Haritası + Davranış Motoru</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowTotemQuizModal(true)}
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
                        ? `✓ 15/15 Yanıtlandı (${symbolism?.totemAnimal || 'Totem Hazır'})` 
                        : '15 Davranışsal senaryo ile 52 hayvan eşleşmesi'}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1c1c28] text-[#c4a47c] border border-[#2e2e40]">
                    {Object.keys(totemAnswers).length > 0 ? 'Yenile' : 'Testi Çöz'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQuizModal(true)}
                  className="p-2.5 rounded-lg bg-[#12121a] hover:bg-[#161622] border border-[#222230] text-left flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#c4a47c]">
                      <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Enneagram Kişilik Testi</span>
                    </div>
                    <p className="text-[10px] text-[#777] font-mono">
                      Seçili: Tip {selectedEnneaType} ({selectedWing})
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1c1c28] text-[#c4a47c] border border-[#2e2e40]">
                    Testi Çöz
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-[#bbb] uppercase tracking-wider block mb-1.5 font-mono">
                  Ad & Soyad <span className="text-[#c4a47c]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#555] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Caner Yıldırım"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#111] border border-[#222] rounded-lg text-sm text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#666] mt-1 font-mono">Pisagor matrisiyle harf-sayı frekans analizi (Yaşam Yolu, Kader, Çakralar) hesaplanır.</p>
              </div>

              {/* Anne Adı & Ebced-Yıldızname Önizleme */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-[#bbb] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span>Anne Adı</span>
                    <span className="text-[10px] text-[#c4a47c] font-sans font-normal">(Ebced & Yıldızname Hesabı)</span>
                  </label>
                  {name.trim() && (
                    <span className="text-[10px] font-mono text-amber-300/90 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/30">
                      Toplam Ebced: {calculateEbcedAndYildizname(name, motherName).totalEbced} | {calculateEbcedAndYildizname(name, motherName).yildiznameBurcName} ({calculateEbcedAndYildizname(name, motherName).yildiznameElement})
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Örn: Sevgi, Fatma, Meryem..."
                  className="w-full px-3 py-2.5 bg-[#111] border border-[#222] rounded-lg text-sm text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
                />
                <p className="text-[10px] text-[#666] mt-1 font-mono">
                  Osmanlı Yıldıznamesinde ve kadim Ebced ilminde kişinin ruhsal fıtratı ve element dengesi anne adıyla mühürlenir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#bbb] uppercase tracking-wider block mb-1.5 font-mono">
                    Doğum Tarihi <span className="text-[#c4a47c]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#555] absolute left-3 top-3" />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#111] border border-[#222] rounded-lg text-sm text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#bbb] uppercase tracking-wider block mb-1.5 font-mono">
                    Doğum Saati <span className="text-[#555]">(Opsiyonel)</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#555] absolute left-3 top-3" />
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#111] border border-[#222] rounded-lg text-sm text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Doğum Yeri & Konum Çözümleme (Dünya Çapında) */}
              <div className="space-y-1.5">
                <LocationAutocompleteInput
                  value={birthPlace}
                  onChange={(val) => {
                    setBirthPlace(val);
                    setSelectedLocation(null);
                  }}
                  onLocationSelect={(loc) => {
                    setSelectedLocation(loc);
                    setBirthPlace(loc.displayName || loc.name);
                  }}
                  selectedLocation={selectedLocation}
                  showCountryFilter={true}
                  placeholder="Örn: İstanbul, San Francisco, Tokyo, London, São Paulo, Heidelberg..."
                />
                <p className="text-[10px] text-[#777] font-mono">
                  Doğum haritası koordinatları ve yerel yıldız zamanı (LST) için dünya çapında geçerli coğrafi konum kullanılır.
                </p>
              </div>

              {/* Özel Anlam & Notlar */}
              <div>
                <label className="text-[11px] font-medium text-[#bbb] uppercase tracking-wider block mb-1.5 font-mono">
                  Özel Anlam & Notlar
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Örn: Dönüşüm, koruyuculuk..."
                  className="w-full px-3 py-2.5 bg-[#111] border border-[#222] rounded-lg text-sm text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
                />
              </div>

              {/* Advanced Esoteric & Personal Data Accordion */}
              <div className="pt-2 border-t border-[#1a1a1a]">
                <button
                  type="button"
                  onClick={() => setShowAdvancedEsoteric(!showAdvancedEsoteric)}
                  className="w-full py-2 px-3 rounded-lg bg-[#0e0e0e] hover:bg-[#141414] border border-[#222] text-xs font-mono text-[#c4a47c] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mevcut Totemler, Semboller & Kişisel Hikâye (Gölge Analizi İçin)</span>
                  </span>
                  <span className="text-[10px] text-[#666]">
                    {showAdvancedEsoteric ? 'Gizle ▲' : 'Genişlet ▼'}
                  </span>
                </button>

                {showAdvancedEsoteric && (
                  <div className="p-3.5 mt-2 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] space-y-3 animate-fadeIn text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-mono text-[#888] block mb-1">
                          Mevcut / Sevilen Totem Hayvanları:
                        </label>
                        <input
                          type="text"
                          value={existingTotems}
                          onChange={(e) => setExistingTotems(e.target.value)}
                          placeholder="Örn: Kurt, Kuzgun, Kartal..."
                          className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono text-[#888] block mb-1">
                          Mevcut / Anlamlı Semboller:
                        </label>
                        <input
                          type="text"
                          value={existingSymbols}
                          onChange={(e) => setExistingSymbols(e.target.value)}
                          placeholder="Örn: Lotus, Hilal, Metatron..."
                          className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-mono text-[#888] block mb-1">
                          Kişisel Olarak Önemli Sayılar:
                        </label>
                        <input
                          type="text"
                          value={personalNumbers}
                          onChange={(e) => setPersonalNumbers(e.target.value)}
                          placeholder="Örn: 7, 19, 24, 33..."
                          className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono text-[#888] block mb-1">
                          Kişisel Hikâye & Yaşam Teması:
                        </label>
                        <input
                          type="text"
                          value={personalStory}
                          onChange={(e) => setPersonalStory(e.target.value)}
                          placeholder="Örn: Sınırlarımı korumak, korkularımı dönüştürmek..."
                          className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Zodiac System Selection */}
              <div className="pt-2 border-t border-[#1a1a1a]">
                <label className="text-[11px] font-medium text-[#bbb] uppercase tracking-wider block mb-2 font-mono flex items-center justify-between">
                  <span>Astrolojik Zodyak Sistemi</span>
                  <span className="text-[10px] text-[#c4a47c] font-sans">Gerçek Efemeris Hesabı</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setZodiacSystem('Tropical')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      zodiacSystem === 'Tropical'
                        ? 'border-[#c4a47c] bg-[#c4a47c]/10 text-white'
                        : 'border-[#1a1a1a] bg-[#0d0d0d] text-[#888] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Batı / Tropikal Zodyak</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${zodiacSystem === 'Tropical' ? 'bg-[#c4a47c] text-black font-bold' : 'bg-[#181818] text-[#666]'}`}>
                        Varsayılan
                      </span>
                    </div>
                    <p className="text-[10px] mt-1 text-[#aaa]">
                      İlkbahar ekinoksuna dayalı standart Batı astrolojisi efemeris koordinatları.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setZodiacSystem('Sidereal')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      zodiacSystem === 'Sidereal'
                        ? 'border-cyan-400 bg-cyan-950/20 text-white'
                        : 'border-[#1a1a1a] bg-[#0d0d0d] text-[#888] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Vedik / Sideral Zodyak</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${zodiacSystem === 'Sidereal' ? 'bg-cyan-400 text-black font-bold' : 'bg-[#181818] text-[#666]'}`}>
                        Lahiri Ayanamsa
                      </span>
                    </div>
                    <p className="text-[10px] mt-1 text-[#aaa]">
                      Sabit yıldızlara dayalı Hint/Vedik sistemi (~23.7° Lahiri ofseti).
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {profileValidationError && (
            <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
              <span className="text-rose-400 font-bold shrink-0">⚠ Hata:</span>
              <span>{profileValidationError}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSaveCurrentClient(false)}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-[#333] hover:border-[#c4a47c] text-[#c4a47c] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#c4a47c]" />
              <span>{currentClientId ? 'Bilgileri Rehbere Güncelle' : 'Kişiyi Rehbere Kaydet'}</span>
            </button>

            <button
              type="button"
              disabled={!name.trim() || !birthDate || !birthPlace?.trim() || Boolean(profileValidationError) || !astrology || !numerology}
              onClick={() => {
                if (profileValidationError || !astrology || !numerology) return;
                setStep(2);
              }}
              className="flex-1 py-3 px-4 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] disabled:opacity-40 text-black font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#c4a47c]/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ezoterik Profili Hesapla & Devam Et</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Numeroloji, Astroloji & Enneagram Profili */}
      {step === 2 && numerology && astrology && enneagram && (
        <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
          {/* Numerology Overview Card */}
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1a1a1a] pb-3 gap-2">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold">
                <span className="mr-2">◆</span> Numeroloji Pisagor Matrisi
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMorseModal(true)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#14120a] border border-[#c4a47c]/40 hover:border-[#c4a47c] text-[#c4a47c] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Binary className="w-3 h-3" />
                  <span>Rakamları Mors Alfabesine Dönüştür</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCalcModalTab('numerology');
                    setShowCalcModal(true);
                  }}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#151515] border border-[#333] hover:border-[#c4a47c] text-[#aaa] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3 h-3" />
                  <span>Hesaplama Detayları</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-[9px] text-[#666] uppercase tracking-wider block font-mono">Yaşam Yolu</span>
                <span className="text-xl font-bold font-mono text-[#c4a47c]">{numerology.lifePathNumber}</span>
                <p className="text-[11px] text-[#aaa] truncate mt-0.5">{numerology.lifePathTitle}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-[9px] text-[#666] uppercase tracking-wider block font-mono">Ana Kulvar (İfade)</span>
                <span className="text-xl font-bold font-mono text-white">{numerology.destinyNumber}</span>
                <p className="text-[11px] text-[#aaa] truncate mt-0.5">{numerology.destinyTitle}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-[9px] text-[#666] uppercase tracking-wider block font-mono">Yan Kulvar (Ruh)</span>
                <span className="text-xl font-bold font-mono text-white">{numerology.soulUrgeNumber}</span>
                <p className="text-[11px] text-[#aaa] truncate mt-0.5">{numerology.soulUrgeTitle}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-[9px] text-[#666] uppercase tracking-wider block font-mono">Dünya Misyonu (DM)</span>
                <span className="text-xl font-bold font-mono text-[#c4a47c]">{numerology.dmNumber}</span>
                <p className="text-[11px] text-[#aaa] truncate mt-0.5">{numerology.dmTitle}</p>
              </div>
            </div>

            {/* Chakra Breakdown & Missing Numbers */}
            <div className="p-4 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c4a47c] flex items-center gap-1.5 font-mono">
                    <Disc className="w-3.5 h-3.5 text-[#c4a47c]" /> 7+2 Çakra Dizilimi & Frekans Analizi
                  </span>
                  <p className="text-[10px] text-[#666] font-mono mt-0.5">
                    İsim harfleri ve doğum verilerinin beden çakraları üzerindeki rezonans dağılımı
                  </p>
                </div>
                {chakra && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#15140e] border border-[#c4a47c]/40 text-[#c4a47c] font-bold">
                    Denge Skoru: {chakra.overallChakraBalanceScore}/100
                  </span>
                )}
              </div>

              {/* 1-9 Grid Badges */}
              <div className="grid grid-cols-9 gap-1 text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                  const count = numerology.chakraCounts[num] || 0;
                  const isMissing = count === 0;
                  return (
                    <div
                      key={num}
                      className={`p-1.5 rounded border text-xs font-mono transition-all ${
                        isMissing
                          ? 'bg-rose-950/30 border-rose-800/60 text-rose-300 ring-1 ring-rose-500/30'
                          : count >= 3
                          ? 'bg-[#c4a47c]/20 border-[#c4a47c]/60 text-[#c4a47c] font-bold'
                          : 'bg-[#111] border-[#222] text-[#aaa]'
                      }`}
                    >
                      <div className="text-[9px] text-[#666]">{num}.Ç</div>
                      <div className="text-xs font-bold">{count}</div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Chakra Alignment Matrix */}
              {chakra && (
                <div className="pt-2 border-t border-[#1a1a1a] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#888] block font-bold">
                    Çakra Durumu & Dövme Şifa Yönergeleri:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {chakra.chakras.slice(0, 7).map((c) => (
                      <div
                        key={c.number}
                        className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 ${
                          c.status === 'Blokajlı / Eksik'
                            ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                            : c.status === 'Aşırı Yoğun'
                            ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                            : 'bg-[#121212] border-[#1e1e1e] text-[#bbb]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5" style={{ color: c.color }}>
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                            {c.number}. {c.turkishName}
                          </span>
                          <span className={`text-[9px] px-1 py-0.2 rounded ${
                            c.status === 'Blokajlı / Eksik' ? 'bg-rose-900/60 text-rose-300 font-bold' :
                            c.status === 'Aşırı Yoğun' ? 'bg-amber-900/60 text-amber-300' :
                            'bg-[#181818] text-[#888]'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#888]">{c.sanskritName} • {c.location}</div>
                        <div className="text-[9px] text-[#aaa] pt-0.5 border-t border-white/5">
                          <strong className="text-zinc-300">Yantra:</strong> {c.yantraGeometry}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded bg-[#14120a] border border-[#c4a47c]/20 text-[10px] text-[#d4c5b3] font-mono leading-relaxed mt-2">
                    ✦ <strong className="text-[#c4a47c]">Kozmik Denge Tavsiyesi:</strong> {chakra.primaryHealingDirective}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-[#1a1a1a] text-[11px]">
                <div className="text-[#888]">
                  <span className="text-rose-400 font-medium">Karmik Eksik Sayılar: </span>
                  {numerology.missingNumbers.length > 0 ? (
                    <span className="text-rose-300 font-mono font-bold">{numerology.missingNumbers.join(', ')}</span>
                  ) : (
                    <span className="text-emerald-400">Tüm çakralarda harf mevcuttur</span>
                  )}
                </div>
                {numerology.masterNumbers.length > 0 && (
                  <div className="text-[#c4a47c] font-mono">
                    Üstat Sayılar: <span className="font-bold underline">{numerology.masterNumbers.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 19 Divine Help & Personal Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-[#bbb]">
                <div className="font-semibold text-[#c4a47c] flex items-center justify-between">
                  <span>19 İlahi Yardım</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#151515] border border-[#222]">{numerology.divineHelp19.level}</span>
                </div>
                <p className="text-[11px] text-[#888] mt-1">{numerology.divineHelp19.reason}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-[#bbb]">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>Kişisel Yıl: {numerology.personalYear}</span>
                  <span className="text-[10px] text-[#666] font-mono">{new Date().getFullYear()}</span>
                </div>
                <p className="text-[11px] text-[#888] mt-1">{numerology.personalYearTheme}</p>
              </div>
            </div>
          </div>

          {/* Astrology Card */}
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-[#1a1a1a] pb-3 gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold">
                  <span className="mr-2">◆</span> Astroloji Göstergeleri (Efemeris)
                </h3>
                {renderElementBadge(astrology.dominantElement)}
              </div>

              <div className="flex items-center gap-2">
                {/* Zodiac System Quick Toggle */}
                <div className="flex rounded bg-[#111] p-0.5 border border-[#222]">
                  <button
                    type="button"
                    onClick={() => setZodiacSystem('Tropical')}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                      zodiacSystem === 'Tropical'
                        ? 'bg-[#c4a47c] text-black font-bold'
                        : 'text-[#888] hover:text-white'
                    }`}
                  >
                    Tropikal (Batı)
                  </button>
                  <button
                    type="button"
                    onClick={() => setZodiacSystem('Sidereal')}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                      zodiacSystem === 'Sidereal'
                        ? 'bg-cyan-400 text-black font-bold'
                        : 'text-[#888] hover:text-white'
                    }`}
                  >
                    Sideral (Vedik)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCalcModalTab('astrology');
                    setShowCalcModal(true);
                  }}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#151515] border border-[#333] hover:border-[#c4a47c] text-[#aaa] hover:text-white transition-colors cursor-pointer"
                >
                  Efemeris Detayı
                </button>
              </div>
            </div>

            {/* Moon Cusp Ingress Alert */}
            {astrology.isMoonNearCusp && astrology.moonCuspMessage && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300 font-mono text-[11px]">
                  <span>⚠️</span>
                  <span>KRİTİK AY GEÇİŞİ: Ay Burç Değişim Sınırında (Cusp / 29°)</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed font-mono">
                  {astrology.moonCuspMessage}
                </p>
              </div>
            )}

            {astrology.ascendantWarning && (
              <div className="p-2.5 rounded bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300 font-mono">
                ⚠️ {astrology.ascendantWarning}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-[9px] text-[#666] uppercase tracking-wider block font-mono">Güneş Burcu</span>
                <span className="text-sm font-bold text-[#c4a47c] flex items-center justify-center gap-1 mt-0.5">
                  <span>{astrology.sunSignSymbol}</span>
                  <span>{astrology.sunSign}</span>
                </span>
                <span className="text-[10px] text-[#c4a47c] font-mono font-semibold block mt-0.5">
                  {astrology.sunDegreeFormatted}
                </span>
                <span className="text-[9px] text-[#666] block font-mono">{astrology.sunSignModality}</span>
              </div>

              <div className={`p-3 rounded-lg bg-[#0d0d0d] border text-center ${astrology.isMoonNearCusp ? 'border-amber-500/50 bg-amber-950/15' : 'border-[#1a1a1a]'}`}>
                <span className="text-[9px] text-[#666] uppercase tracking-wider block font-mono">
                  Ay Burcu {astrology.isMoonNearCusp && <span className="text-amber-400 font-bold">(Cusp)</span>}
                </span>
                <span className="text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <span>{astrology.moonSignSymbol}</span>
                  <span>{astrology.moonSign}</span>
                </span>
                <span className={`text-[10px] font-mono font-bold block mt-0.5 ${astrology.isMoonNearCusp ? 'text-amber-300' : 'text-white'}`}>
                  {astrology.moonDegreeFormatted}
                </span>
                <span className="text-[9px] text-[#666] block font-mono">İçsel Sezgi</span>
              </div>

              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-[9px] text-[#666] uppercase tracking-wider block font-mono">Yükselen Burç</span>
                <span className="text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <span>{astrology.ascendantSignSymbol}</span>
                  <span>{astrology.ascendantSign}</span>
                </span>
                <span className="text-[10px] text-[#aaa] font-mono block mt-0.5">
                  {astrology.ascendantDegreeFormatted}
                </span>
                <span className="text-[9px] text-[#666] block font-mono">Dışsal Aura</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-xs text-[#bbb]">
              <div className="flex items-center justify-between text-[#888] mb-1">
                <span>Arketip: <strong className="text-white">{astrology.archetype}</strong></span>
                <span>Yönetici Gezegen: <strong className="text-white">{astrology.rulingPlanet}</strong></span>
              </div>
              <p className="text-[11px] text-[#777] leading-relaxed">{astrology.summary}</p>
            </div>
          </div>

          {/* Enneagram Selector & Details */}
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1a1a1a] pb-3 gap-2">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold">
                <span className="mr-2">◆</span> Enneagram Kişilik Tipi & Kanat
              </h3>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowIntakeLinkModal(true)}
                  className="text-[10px] font-mono px-3 py-1 rounded bg-[#1c180e] hover:bg-[#282215] border border-[#c4a47c]/50 text-[#c4a47c] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="Danışana tek bir form linki göndererek ad, soyad, doğum ve tüm testleri toplar"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Danışan Bilgi Formu Linki</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuizModal(true)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#181818] hover:bg-[#222] border border-[#333] text-[#ddd] flex items-center gap-1 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Stüdyoda Çöz</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnneagramShareModal(true)}
                  className="text-[10px] font-mono px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-900/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Müşteriye Test Gönder (WhatsApp)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnneagramShareModal(true)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#151d2e] hover:bg-[#1e293b] border border-blue-500/40 text-blue-300 font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Cevapları Al / Yapıştır</span>
                </button>
              </div>
            </div>

            {/* Enneagram Quick Select */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono">Manuel Tip Seçimi (1-9):</label>
                {enneagram.isDeterminedByTest && (
                  <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Test ile Onaylandı
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedEnneaType(t);
                      const defWing = ENNEAGRAM_TYPES[t]?.wings[0] || `${t}w${t === 9 ? 1 : t + 1}`;
                      setSelectedWing(defWing);
                    }}
                    className={`py-2 px-1 rounded border text-xs font-mono transition-all cursor-pointer ${
                      selectedEnneaType === t
                        ? 'bg-[#c4a47c] border-[#c4a47c] text-black font-bold shadow-md shadow-[#c4a47c]/20'
                        : 'bg-[#111] border-[#222] text-[#888] hover:text-[#e0e0e0]'
                    }`}
                  >
                    Tip {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Wings Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888]">Kanat Seçimi:</span>
              <div className="flex gap-2">
                {ENNEAGRAM_TYPES[selectedEnneaType]?.wings.map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWing(w)}
                    className={`px-3 py-1 rounded border text-xs font-mono transition-all cursor-pointer ${
                      selectedWing === w
                        ? 'bg-[#c4a47c]/20 border-[#c4a47c] text-[#c4a47c] font-bold'
                        : 'bg-[#111] border-[#222] text-[#888]'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{enneagram.typeName} ({enneagram.wing})</span>
                <span className="text-[10px] text-[#666] font-mono">Stres: {enneagram.stressPoint} / Büyüme: {enneagram.growthPoint}</span>
              </div>
              <p className="text-[11px] text-[#aaa]">
                <strong className="text-[#666]">Temel Motivasyon:</strong> {enneagram.coreMotivation}
              </p>
              <p className="text-[11px] text-[#bbb]">
                <strong className="text-rose-400">Gölge Yön:</strong> {enneagram.shadowTraits.join(', ')}
              </p>
              <p className="text-[11px] text-[#c4a47c]">
                <strong className="text-[#c4a47c]">Dövme Sembolizmi:</strong> {enneagram.symbolicMeaning}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-lg bg-[#111] border border-[#222] hover:border-[#333] text-xs text-[#aaa] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="py-2.5 px-5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-widest shadow-md shadow-[#c4a47c]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Sembolik Profili İncele</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Sembolizm & Arketipler */}
      {step === 3 && symbolism && (
        <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold">
                <span className="mr-2">◆</span> Kişiselleştirilmiş Sembolik Profil
              </h3>
              <span className="text-[10px] text-[#666] font-mono uppercase">Ezoterik Sentez</span>
            </div>

            {/* Themes banner */}
            <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-xs">
              <div className="text-[#c4a47c] font-semibold mb-1">Ana Tema: {symbolism.mainTheme}</div>
              <div className="text-[#888] text-[11px]">Duygusal Rezonans: {symbolism.emotionalTheme}</div>
            </div>

            {/* 3'lü Ruhani Totem Hayvanı Hiyerarşisi & Tasarıma Dahil Etme Tercihi */}
            {symbolism.totemHierarchy && symbolism.totemHierarchy.length > 0 && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-3 gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c4a47c] flex items-center gap-1.5 font-mono">
                      <Flame className="w-4 h-4 text-[#c4a47c]" /> Kişisel Bilgilerinizden Hesaplanan Ruhani Totem Hayvanı
                    </span>
                    <p className="text-[11px] text-[#777] mt-0.5 font-mono">
                      Girdi: {name || 'Danışan'} • Doğum: {birthDate} {birthTime ? `(${birthTime})` : ''} • Yer: {birthPlace || 'Belirtilmedi'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTotemQuizModal(true)}
                      className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#1e1c14] hover:bg-[#2a271c] border border-[#c4a47c]/50 text-[#c4a47c] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>{Object.keys(totemAnswers).length > 0 ? 'Davranış Testini Güncelle' : 'Davranış Testi ile Belirle (15 Soru)'}</span>
                    </button>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16140e] border border-[#c4a47c]/30 text-[#c4a47c] font-bold">
                      {symbolism.totemAnimal}
                    </span>
                  </div>
                </div>

                {/* EKLEME VEYA ÇIKARMA SEÇENEĞİ KUTULARI (HER YENİ KİŞİ İÇİN SIFIRDAN HESAPLANIR) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#888] uppercase tracking-wider font-bold">
                      Tasarıma Ekleme veya Çıkarma Tercihi:
                    </span>
                    <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                      includeTotemInDesign
                        ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/30'
                        : 'bg-zinc-800 text-amber-300 border border-zinc-700'
                    }`}>
                      {includeTotemInDesign ? '✓ Tasarıma Dahil Edildi (Çizim Odağı)' : '✕ Tasarımdan Çıkarıldı (Yalnızca Ruhani Analiz)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Seçenek 1: Tasarıma Ekle */}
                    <button
                      type="button"
                      onClick={() => {
                        setIncludeTotemInDesign(true);
                        setCustomMainSymbol(symbolism.totemAnimal);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                        includeTotemInDesign
                          ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950/30'
                          : 'bg-[#121212] border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Check className={`w-4 h-4 ${includeTotemInDesign ? 'text-emerald-400' : 'text-zinc-600'}`} />
                          <span>Tasarıma Dahil Et (Totem Figürüyle Çiz)</span>
                        </span>
                        {includeTotemInDesign && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        Hesaplanan <strong>{symbolism.totemAnimal}</strong> figürü dövmenin merkezine ana odak olarak yerleştirilir. Promptlar ve stencil bu totem arketipi üzerine kurgulanır.
                      </p>
                    </button>

                    {/* Seçenek 2: Tasarımdan Çıkar */}
                    <button
                      type="button"
                      onClick={() => {
                        setIncludeTotemInDesign(false);
                        setCustomMainSymbol(symbolism.sacredObject || symbolism.geometricSymbol || 'Kutsal Geometri & Yaşam Çiçeği');
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                        !includeTotemInDesign
                          ? 'bg-amber-950/20 border-amber-600/70 ring-1 ring-amber-500/40 shadow-lg shadow-amber-950/30'
                          : 'bg-[#121212] border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${!includeTotemInDesign ? 'text-amber-400' : 'text-zinc-600'}`}>✕</span>
                          <span>Tasarımdan Çıkar (Yalnızca Ruhani Analizde Tut)</span>
                        </span>
                        {!includeTotemInDesign && (
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Totem hayvanı dövme görseline çizilmez; odağa kutsal geometri ve semboller alınır. Totem hayvanının rehberliği danışanın ruhani dosyasında korunur.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 3'lü Totem Kartları */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {symbolism.totemHierarchy.map((totem, idx) => {
                    const isFocal = includeTotemInDesign && customMainSymbol.includes(totem.name.split(' ')[0]);
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs space-y-2 transition-all ${
                          isFocal
                            ? 'bg-[#18150e] border-[#c4a47c] shadow-md shadow-[#c4a47c]/10'
                            : 'bg-[#121212] border-[#1e1e1e] text-[#aaa]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#c4a47c] font-bold">
                            {totem.role}
                          </span>
                          {isFocal && (
                            <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5 font-bold">
                              <Check className="w-3 h-3" /> Tasarımda
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-white block">{totem.name}</span>
                          <span className="text-[9px] text-[#666] font-mono block mt-0.5">{totem.origin}</span>
                        </div>
                        <p className="text-[10px] text-[#888] leading-relaxed line-clamp-3">
                          {totem.meaning}
                        </p>
                        <div className="pt-1 border-t border-white/5">
                          {isFocal ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIncludeTotemInDesign(false);
                                setCustomMainSymbol(symbolism.sacredObject || symbolism.geometricSymbol || 'Kutsal Geometri');
                              }}
                              className="w-full py-1 px-2 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30"
                            >
                              Tasarımdan Çıkar
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setIncludeTotemInDesign(true);
                                setCustomMainSymbol(totem.name);
                              }}
                              className="w-full py-1 px-2 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer bg-[#1a1a1a] hover:bg-[#252525] text-zinc-300 hover:text-white"
                            >
                              + Tasarıma Dahil Et & Ana Odak Yap
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Kişinin İhtiyaç Duyduğu Dengeleyici Semboller & Nedenleri */}
            {symbolism.neededSymbols && symbolism.neededSymbols.length > 0 && (
              <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c4a47c] flex items-center gap-1.5 font-mono">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" /> İhtiyaç Duyulan Şifa & Dengeleyici Semboller (Nedenleriyle)
                  </span>
                  <span className="text-[10px] text-[#666] font-mono">Çakra & Element Onarımı</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {symbolism.neededSymbols.map((s, idx) => {
                    const isAdded = customSecondarySymbols.includes(s.symbolName);
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#121212] border border-[#1e1e1e] text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{s.symbolName}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/30 border border-cyan-800/40 text-cyan-300">
                            {s.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-amber-300/90 font-mono">
                          ✦ Hedef: {s.targetDeficiency}
                        </div>
                        <p className="text-[10px] text-[#999] leading-relaxed">
                          <strong className="text-[#ccc]">Neden Seçildi:</strong> {s.esotericRationale}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                          <span className="text-[#777] font-mono truncate max-w-[200px]">{s.compositionPlacement}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isAdded) {
                                setCustomSecondarySymbols([...customSecondarySymbols, s.symbolName]);
                              } else {
                                setCustomSecondarySymbols(customSecondarySymbols.filter(sym => sym !== s.symbolName));
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-colors ${
                              isAdded
                                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                                : 'bg-[#181818] border border-[#333] hover:border-[#c4a47c] text-[#bbb]'
                            }`}
                          >
                            {isAdded ? '✓ Tasarımda Var' : '+ Tasarıma Ekle'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Symbols Grid */}
            <div className="space-y-3">
              {/* Ana Odak Sembolü Input */}
              <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#c4a47c]">Seçili Ana Odak Sembolü:</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      includeTotemInDesign
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {includeTotemInDesign ? 'Totem Hayvanı Dahil' : 'Totem Hayvanı Hariç'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#666] font-mono">1. Öncelikli Odak</span>
                </div>
                <input
                  type="text"
                  value={customMainSymbol}
                  onChange={(e) => setCustomMainSymbol(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-sm text-white font-semibold focus:border-[#c4a47c] focus:outline-none"
                />
                <p className="text-[11px] text-[#888] mt-1.5">
                  {includeTotemInDesign
                    ? `Hesaplanan Totem: ${symbolism.totemAnimal} — ${symbolism.totemAnimalMeaning}`
                    : `Kutsal Odak: ${symbolism.sacredObject || symbolism.geometricSymbol} — Totem hayvanı tasarımda yer almaz; dövme kutsal geometri ve semboller üzerinden kurgulanır.`}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] text-[#666] font-mono">Önerilen Alternatifler:</span>
                  {(includeTotemInDesign 
                    ? [symbolism.totemAnimal, ...symbolism.secondaryAnimals, symbolism.sacredObject]
                    : [symbolism.sacredObject, symbolism.geometricSymbol, symbolism.plantFlora]
                  ).filter(Boolean).map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setCustomMainSymbol(a)}
                      className="px-2 py-0.5 rounded bg-[#111] border border-[#222] text-[10px] text-[#aaa] hover:border-[#c4a47c] hover:text-[#c4a47c] cursor-pointer"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plant / Flora */}
              <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-xs font-semibold text-emerald-400 block mb-1">Bitki / Çiçek Sembolü:</span>
                <div className="text-sm font-medium text-[#e0e0e0]">{symbolism.plantFlora}</div>
                <p className="text-[11px] text-[#888] mt-1">{symbolism.plantFloraMeaning}</p>
              </div>

              {/* Geometric Symbol & Element */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                  <span className="text-xs font-semibold text-cyan-400 block mb-1">Kutsal Geometri:</span>
                  <div className="text-xs font-medium text-[#e0e0e0]">{symbolism.geometricSymbol}</div>
                  <p className="text-[10px] text-[#888] mt-1">{symbolism.geometricSymbolMeaning}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                  <span className="text-xs font-semibold text-rose-400 block mb-1">Doğal Taş & Kristal:</span>
                  <div className="text-xs font-medium text-[#e0e0e0]">{symbolism.crystalStone}</div>
                  <p className="text-[10px] text-[#888] mt-1">{symbolism.crystalStoneMeaning}</p>
                </div>
              </div>

              {/* Mythological & Sacred Object */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                  <span className="text-xs font-semibold text-[#c4a47c] block mb-1">Mitolojik Figür:</span>
                  <div className="text-xs font-medium text-[#e0e0e0]">{symbolism.mythologicalFigure}</div>
                  <p className="text-[10px] text-[#888] mt-1">{symbolism.mythologicalFigureMeaning}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                  <span className="text-xs font-semibold text-[#aaa] block mb-1">Kutsal Obje:</span>
                  <div className="text-xs font-medium text-[#e0e0e0]">{symbolism.sacredObject}</div>
                  <p className="text-[10px] text-[#888] mt-1">{symbolism.sacredObjectMeaning}</p>
                </div>
              </div>

              {/* Subtle Details (Gizli & İnce Detaylar) */}
              {symbolism.subtleDetails && symbolism.subtleDetails.length > 0 && (
                <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                  <span className="text-xs font-semibold text-[#c4a47c] block mb-1.5 font-mono">
                    ✦ Tasarıma Gizlenecek Mikro Ezoterik Detaylar (Subtle Details):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {symbolism.subtleDetails.map((det, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#16140e] border border-[#c4a47c]/40 text-xs text-[#e0d6c8] font-mono"
                      >
                        {det}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Symbol Interconnection Guide */}
              {symbolism.symbolInterconnection && (
                <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] text-xs">
                  <span className="text-xs font-semibold text-white block mb-1">
                    Sembollerin Birbirine Bağlanma Mantığı:
                  </span>
                  <p className="text-[11px] text-[#aaa] leading-relaxed">
                    {symbolism.symbolInterconnection}
                  </p>
                </div>
              )}

              {/* Secondary Symbols Tag Manager */}
              <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
                <span className="text-xs font-semibold text-[#bbb] block mb-1.5">Tasarımda Kullanılacak Yardımcı Semboller:</span>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {customSecondarySymbols.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[#111] border border-[#222] text-xs text-white flex items-center gap-1.5 font-mono"
                    >
                      <span>{sym}</span>
                      <button
                        type="button"
                        onClick={() => setCustomSecondarySymbols(customSecondarySymbols.filter((_, i) => i !== idx))}
                        className="text-[#666] hover:text-rose-400 ml-1 text-xs cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSecSymbolInput}
                    onChange={(e) => setNewSecSymbolInput(e.target.value)}
                    placeholder="Örn: Ay Fazları, Hançer, Kum Saati..."
                    className="flex-1 px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSecSymbolInput.trim()) {
                        e.preventDefault();
                        setCustomSecondarySymbols([...customSecondarySymbols, newSecSymbolInput.trim()]);
                        setNewSecSymbolInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSecSymbolInput.trim()) {
                        setCustomSecondarySymbols([...customSecondarySymbols, newSecSymbolInput.trim()]);
                        setNewSecSymbolInput('');
                      }
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#151515] hover:bg-[#222] text-xs text-[#e0e0e0] border border-[#333] cursor-pointer"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-2.5 px-4 rounded-lg bg-[#111] border border-[#222] hover:border-[#333] text-xs text-[#aaa] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="py-2.5 px-5 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-widest shadow-md shadow-[#c4a47c]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Dövme Parametrelerini Seç</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Dövme Tasarım Parametreleri */}
      {step === 4 && (
        <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold">
                <span className="mr-2">◆</span> Dövme Stili & Tasarım Parametreleri
              </h3>
              <span className="text-[10px] text-[#666] font-mono uppercase">Çoklu Stil Desteği</span>
            </div>

            {/* Tattoo Styles Multiple Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#ccc]">
                  Dövme Stili Seçimi <span className="text-[#c4a47c] font-normal">(Çoklu stil kombinasyonu yapılabilir):</span>
                </label>
                <span className="text-[10px] font-mono text-[#c4a47c]">
                  {selectedStyles.length} Seçildi
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {TATTOO_STYLES.map(st => {
                  const isSelected = selectedStyles.includes(st.name);
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => toggleStyle(st.name)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#c4a47c]/20 border-[#c4a47c] text-[#c4a47c] shadow-sm shadow-[#c4a47c]/10 font-medium'
                          : 'bg-[#0d0d0d] border-[#1a1a1a] text-[#888] hover:text-[#e0e0e0] hover:border-[#333]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{st.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#c4a47c]" />}
                      </div>
                      <span className="text-[10px] text-[#666] block mt-0.5 truncate font-mono">{st.visualTag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Composition & Orientation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#888] uppercase tracking-wider block mb-1.5 font-mono">Kompozisyon Düzeni:</label>
                <select
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                >
                  <option value="Dinamik Asimetrik & Kutsal Odak">Dinamik Asimetrik & Kutsal Odak</option>
                  <option value="Merkezi Simetrik (Mandala/Sigil)">Merkezi Simetrik (Mandala/Sigil)</option>
                  <option value="Altın Oran & Fibonacci Spirali">Altın Oran & Fibonacci Spirali</option>
                  <option value="Lineer Dikey Akış (Omurga/Kol Boyu)">Lineer Dikey Akış (Omurga/Kol)</option>
                  <option value="Parçalı & Soyut Sürrealist Dağılım">Parçalı & Soyut Sürrealist Dağılım</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#888] uppercase tracking-wider block mb-1.5 font-mono">Yönelim / Akış:</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                >
                  <option value="Dikey (Anatomik)">Dikey (Anatomik)</option>
                  <option value="Yatay (Dinamik)">Yatay (Dinamik)</option>
                  <option value="Sarmal (Spiral)">Sarmal (Spiral)</option>
                  <option value="Organik Akış">Organik Akış</option>
                </select>
              </div>
            </div>

            {/* Body Placement & Density */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#888] uppercase tracking-wider block mb-1.5 font-mono">Vücut Yerleşim Bölgesi:</label>
                <select
                  value={bodyPlacement}
                  onChange={(e) => setBodyPlacement(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                >
                  <option value="Önkol İç (Forearm Inner)">Önkol İç (Forearm Inner)</option>
                  <option value="Önkol Dış / Kol Kaplama (Sleeve)">Önkol Dış / Kol Kaplama</option>
                  <option value="Pazu / Üst Kol (Bicep/Deltoid)">Pazu / Üst Kol</option>
                  <option value="Sırt (Omurga / Backpiece)">Sırt (Omurga / Backpiece)</option>
                  <option value="Göğüs & Sternum">Göğüs & Sternum</option>
                  <option value="Kaburga / Yan Gövde (Ribs)">Kaburga / Yan Gövde</option>
                  <option value="Bacak / Baldır / Uyluk (Leg/Calf)">Bacak / Baldır / Uyluk</option>
                  <option value="Boyun & Ense">Boyun & Ense</option>
                  <option value="El Bileği / Parmaklar">El Bileği / Parmaklar</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#888] uppercase tracking-wider block mb-1.5 font-mono">Doluluk & Yoğunluk:</label>
                <select
                  value={density}
                  onChange={(e) => setDensity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                >
                  <option value="Minimal & Boşluklu (%20)">Minimal & Boşluklu (%20)</option>
                  <option value="Hafif & Havadar (%40)">Hafif & Havadar (%40)</option>
                  <option value="Dengeli & Net (%60)">Dengeli & Net (%60)</option>
                  <option value="Yoğun & Detaylı (%80)">Yoğun & Detaylı (%80)</option>
                  <option value="Maksimalist & Dolu (%95)">Maksimalist & Dolu (%95)</option>
                </select>
              </div>
            </div>

            {/* Color Scheme & Atmosphere */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#888] uppercase tracking-wider block mb-1.5 font-mono">Renk Paleti / Tonlama:</label>
                <select
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                >
                  <option value="Saf Monokrom Siyah">Saf Monokrom Siyah</option>
                  <option value="Black & Grey (Gri Gölgelendirme)">Black & Grey (Gri Gölgelendirme)</option>
                  <option value="Tekil Vurgu Rengi (Kırmızı/Altın)">Tekil Vurgu Rengi (Kırmızı/Altın)</option>
                  <option value="Soğuk Çift Ton (Füme & Buz Mavisi)">Soğuk Çift Ton (Füme & Buz Mavisi)</option>
                  <option value="Zengin Polikrom Renk">Zengin Polikrom Renk</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#888] uppercase tracking-wider block mb-1.5 font-mono">Görsel Atmosfer:</label>
                <select
                  value={visualAtmosphere}
                  onChange={(e) => setVisualAtmosphere(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#e0e0e0] focus:border-[#c4a47c] focus:outline-none"
                >
                  <option value="Mistik & Ezoterik">Mistik & Ezoterik</option>
                  <option value="Karanlık & Melankolik (Gothic)">Karanlık & Melankolik</option>
                  <option value="Ruhani & Zarafet Dolu (Ethereal)">Ruhani & Zarafet Dolu</option>
                  <option value="Sert, Keskin & Agresif">Sert, Keskin & Agresif</option>
                  <option value="Kozmik & Boyutlararası">Kozmik & Boyutlararası</option>
                  <option value="Kadim & Arkaik">Kadim & Arkaik</option>
                </select>
              </div>
            </div>

            {/* MORS ALFABESİ & KUTSAL RAKAM ŞİFRELEME SEÇENEĞİ (ZORUNLU DEĞİL - EKLEME / ÇIKARMA & YENİDEN BELİRLEME) */}
            <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
              useMorseCodeForNumbers
                ? 'bg-[#0f110f] border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                : 'bg-[#0d0d0d] border-[#222]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${
                    useMorseCodeForNumbers 
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400' 
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                  }`}>
                    <Binary className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Mors Alfabesi ile Rakam & İfade Şifreleme
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        İsteğe Bağlı
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      Mors alfabesini zorunlu tutmadan ekleyebilir, çıkarabilir veya yazılacak ifadeyi tamamen yeniden belirleyebilirsiniz.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMorseModal(true)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#16140e] border border-[#c4a47c]/40 text-[#c4a47c] hover:bg-[#201c10] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Mors Stüdyosu & Sesli Çevirici</span>
                </button>
              </div>

              {/* 2 Seçenekli Ekleme / Çıkarma Segmented Butonları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setUseMorseCodeForNumbers(false)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    !useMorseCodeForNumbers
                      ? 'bg-[#181818] border-zinc-600 ring-1 ring-zinc-500 text-white'
                      : 'bg-[#111] border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <span className={!useMorseCodeForNumbers ? 'text-amber-400 font-bold' : ''}>✕</span>
                      <span>Mors Alfabesini Çıkar (Kullanma)</span>
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      Rakamlar Mors koduna çevrilmez; tasarımda saf kutsal geometri ve semboller kullanılır.
                    </p>
                  </div>
                  {!useMorseCodeForNumbers && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-bold shrink-0 ml-2">
                      Seçildi
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setUseMorseCodeForNumbers(true)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    useMorseCodeForNumbers
                      ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/50 text-emerald-200'
                      : 'bg-[#111] border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <span className={useMorseCodeForNumbers ? 'text-emerald-400 font-bold' : ''}>✓</span>
                      <span>Mors Alfabesini Ekle (Tasarıma Şifrele)</span>
                    </span>
                    <p className="text-[10px] text-emerald-300/80">
                      Rakam veya kelimeler 03RL micro-dotwork noktaları ve ince çizgiler olarak geometriye gizlenir.
                    </p>
                  </div>
                  {useMorseCodeForNumbers && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-bold shrink-0 ml-2">
                      Aktif
                    </span>
                  )}
                </button>
              </div>

              {/* YAZILACAK ŞEYİ YENİDEN BELİRLEME & CANLI ÖNİZLEME (Mors Aktif İse) */}
              {useMorseCodeForNumbers && (
                <div className="mt-3 p-3.5 rounded-xl bg-black/60 border border-emerald-900/40 space-y-3 animate-fadeIn">
                  <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        <span className="text-[#c4a47c]">✦</span>
                        <span>Mors Koduyla Yazılacak Şeyi Yeniden Belirleyin:</span>
                      </label>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        (Tarih, Yaşam Yolu, İsim, Koordinat veya Özel Kelime)
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customMorseInput}
                        onChange={(e) => setCustomMorseInput(e.target.value)}
                        placeholder={personalNumbers || (birthDate ? birthDate.split('-').reverse().join('.') : 'Örn: 23.04.1994, GİZEM veya 19')}
                        className="flex-1 px-3.5 py-2.5 bg-[#0a0a0a] border border-[#333] focus:border-[#c4a47c] rounded-xl text-xs font-mono text-white placeholder-zinc-600 outline-none"
                      />
                      {customMorseInput && (
                        <button
                          type="button"
                          onClick={() => setCustomMorseInput('')}
                          className="px-2.5 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-zinc-400 hover:text-white text-xs font-mono cursor-pointer"
                          title="Sıfırla"
                        >
                          Temizle
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hızlı Önayar Butonları */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono">Hızlı Şablonlar:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {birthDate && (
                        <button
                          type="button"
                          onClick={() => setCustomMorseInput(birthDate.split('-').reverse().join('.'))}
                          className="px-2 py-1 rounded bg-[#161616] hover:bg-[#222] border border-[#333] text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Calendar className="w-3 h-3 text-[#c4a47c]" />
                          <span>Doğum Tarihi ({birthDate.split('-').reverse().join('.')})</span>
                        </button>
                      )}

                      {numerology?.lifePathNumber && (
                        <button
                          type="button"
                          onClick={() => setCustomMorseInput(String(numerology.lifePathNumber))}
                          className="px-2 py-1 rounded bg-[#161616] hover:bg-[#222] border border-[#333] text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Compass className="w-3 h-3 text-cyan-400" />
                          <span>Yaşam Yolu ({numerology.lifePathNumber})</span>
                        </button>
                      )}

                      {personalNumbers && (
                        <button
                          type="button"
                          onClick={() => setCustomMorseInput(personalNumbers)}
                          className="px-2 py-1 rounded bg-[#161616] hover:bg-[#222] border border-[#333] text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Kişisel Sayılar ({personalNumbers})</span>
                        </button>
                      )}

                      {name && (
                        <button
                          type="button"
                          onClick={() => setCustomMorseInput(name.toUpperCase())}
                          className="px-2 py-1 rounded bg-[#161616] hover:bg-[#222] border border-[#333] text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <User className="w-3 h-3 text-emerald-400" />
                          <span>İsim ({name.split(' ')[0]})</span>
                        </button>
                      )}

                      {birthPlace && (
                        <button
                          type="button"
                          onClick={() => setCustomMorseInput(birthPlace.toUpperCase())}
                          className="px-2 py-1 rounded bg-[#161616] hover:bg-[#222] border border-[#333] text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>Şehir ({birthPlace})</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setCustomMorseInput('19')}
                        className="px-2 py-1 rounded bg-[#161616] hover:bg-[#222] border border-[#333] text-[10px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        <span>İlahi 19 Mührü</span>
                      </button>
                    </div>
                  </div>

                  {/* Canlı Mors Kod Çıktısı & İğne Şartnamesi */}
                  {(() => {
                    const textToEncode = customMorseInput.trim() ||
                      personalNumbers?.trim() ||
                      (birthDate ? birthDate.split('-').reverse().join('.') : '') ||
                      '19';
                    const enc = encodeToMorse(textToEncode);
                    return (
                      <div className="p-3 rounded-lg bg-[#0d140e] border border-emerald-900/50 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-zinc-400">
                            Şifrelenen İfade: <strong className="text-white">"{enc.rawInput}"</strong>
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">
                            {enc.totalDots} Nokta • {enc.totalDashes} Çizgi
                          </span>
                        </div>

                        <div className="p-2.5 rounded bg-black/80 border border-emerald-800/40 text-[#c4a47c] font-mono text-center tracking-widest text-base font-bold select-all overflow-x-auto">
                          {enc.morseDisplay}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-zinc-400 border-t border-white/5 pt-1.5">
                          <span>📐 <strong>Stüdyo Uygulaması:</strong> 03RL (0.25mm) micro-dotwork + 1.5mm fine-line</span>
                          <span className="text-emerald-400">✓ Prompta ve Stencile Eklenecek</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* TOTEM HAYVANI DURUM KONTROLÜ (STEP 4 İÇİNDE HIZLI DEĞİŞTİRME) */}
            <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              includeTotemInDesign
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-zinc-950 border-zinc-800'
            }`}>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className={`w-3.5 h-3.5 ${includeTotemInDesign ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span>Totem Hayvanı Durumu:</span>
                  <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                    includeTotemInDesign ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {includeTotemInDesign ? `Tasarıma Dahil (${customMainSymbol || symbolism?.totemAnimal})` : 'Tasarımdan Çıkarıldı'}
                  </span>
                </span>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {includeTotemInDesign
                    ? 'Totem figürü dövme merkezinde odak noktası olarak çizilecektir.'
                    : 'Dövmeye hayvan figürü çizilmeyecek; kutsal geometri ve semboller odak yapılacaktır.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextState = !includeTotemInDesign;
                  setIncludeTotemInDesign(nextState);
                  if (nextState) {
                    setCustomMainSymbol(symbolism?.totemAnimal || '');
                  } else {
                    setCustomMainSymbol(symbolism?.sacredObject || symbolism?.geometricSymbol || 'Kutsal Geometri');
                  }
                }}
                className={`py-1.5 px-3 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer self-start sm:self-auto ${
                  includeTotemInDesign
                    ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {includeTotemInDesign ? '✕ Tasarımdan Çıkar' : '✓ Tasarıma Ekle'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="py-2.5 px-4 rounded-lg bg-[#111] border border-[#222] hover:border-[#333] text-xs text-[#aaa] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateRecipe}
              className="py-3 px-6 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#c4a47c]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Dövme Tasarım Reçetesini Oluştur</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: IMMERSIVE 3-COLUMN SYNTHESIS & 12-SECTION DOSSIER */}
      {step === 5 && generatedRecipe && (
        <div className="space-y-4 animate-fadeIn">
          {/* View Mode Toggle: 12-Section Master Shadow Report vs 3-Column Studio Grid */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0c0c0c] border border-[#222]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep5ViewMode('shadow-report')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  step5ViewMode === 'shadow-report'
                    ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                    : 'text-[#888] hover:text-white bg-[#141414]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🔮 12 Bölümlük Master Gölge & Dövme Raporu</span>
              </button>
              <button
                type="button"
                onClick={() => setStep5ViewMode('symbol-integration')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  step5ViewMode === 'symbol-integration'
                    ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                    : 'text-[#888] hover:text-white bg-[#141414]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>🔯 Sembol Entegrasyon Modeli & Ayrıştırma</span>
              </button>
              <button
                type="button"
                onClick={() => setStep5ViewMode('studio-grid')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  step5ViewMode === 'studio-grid'
                    ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/20'
                    : 'text-[#888] hover:text-white bg-[#141414]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>⚡ 3-Sütunlu Hızlı Stüdyo Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setShowClientDossierModal(true)}
                className="px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-amber-600/30 to-[#c4a47c]/30 hover:from-amber-600/40 hover:to-[#c4a47c]/40 text-[#f5e6cc] border border-[#c4a47c]/70 shadow-lg shadow-[#c4a47c]/20"
                title="Tek sayfalık Kişisel Sembol Reçetesi, Rapor Denetimi ve Prompt brifini aç"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
                <span>📜 Kişisel Sembol Reçetesi (Tek Sayfa Rapor)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadRecipeJson}
                className="px-3 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1f1f24] border border-[#333] hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Tüm reçeteyi ve sembolik entegrasyonu standartlaştırılmış JSON dosyası olarak indir"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>JSON İndir</span>
              </button>
              <button
                type="button"
                onClick={handleStartFreshDesign}
                className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-[#333] hover:border-[#c4a47c] text-[#ccc] hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Tüm form verilerini sıfırlayarak yeni bir kişi ve tasarım başlatır"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#c4a47c]" />
                <span>+ Yeni Kişi / Yeni Tasarım</span>
              </button>
              <button
                type="button"
                onClick={handleCopyAllPrompts}
                className="px-3 py-1.5 rounded-lg bg-[#18150f] border border-[#c4a47c]/40 text-[#c4a47c] text-xs font-mono hover:bg-[#252015] flex items-center gap-1.5 cursor-pointer"
              >
                {copiedPromptType === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromptType === 'all' ? 'TÜMÜ KOPYALANDI' : 'Tüm Dosyayı Kopyala'}</span>
              </button>
            </div>
          </div>

          {step5ViewMode === 'shadow-report' && generatedRecipe.shadowAnalysis ? (
            <ShadowAnalysisViewer
              report={generatedRecipe.shadowAnalysis}
              onDownloadMarkdown={handleDownloadFullRecipeMarkdown}
              onDownloadJson={handleDownloadRecipeJson}
              onOpenClientDossier={() => setShowClientDossierModal(true)}
            />
          ) : step5ViewMode === 'symbol-integration' && generatedRecipe.symbolicIntegration ? (
            <SymbolIntegrationViewer
              integration={generatedRecipe.symbolicIntegration}
              onDownloadJson={handleDownloadRecipeJson}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#1a1a1a]">
          {/* Column 1: Ezoterik Harita & Çakra & Astroloji (4 cols) */}
          <div className="lg:col-span-4 bg-[#0a0a0a] p-5 sm:p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold font-mono">
                <span className="mr-2 text-base">◆</span> 1. Ezoterik Profil & Çakra Haritası
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#16140e] border border-[#c4a47c]/30 text-[#c4a47c]">
                {generatedRecipe.personData.name}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {/* Numerology */}
              <div className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
                  <span className="text-[10px] text-[#888] uppercase font-mono font-bold flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-[#c4a47c]" /> Numeroloji Pisagor Matrisi
                  </span>
                  {generatedRecipe.numerology.divineHelp19.has19 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold">
                      19 İlahi Mühür
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                  <span className="text-[#777]">Yaşam Yolu (Life Path):</span>
                  <span className="text-[#c4a47c] font-bold font-mono">{generatedRecipe.numerology.lifePathNumber} ({generatedRecipe.numerology.lifePathTitle})</span>
                  <span className="text-[#777]">Ana Kulvar / İfade:</span>
                  <span className="text-white font-mono">{generatedRecipe.numerology.destinyNumber} ({generatedRecipe.numerology.destinyTitle})</span>
                  <span className="text-[#777]">Kalp Arzusu / Yan Kulvar:</span>
                  <span className="text-white font-mono">{generatedRecipe.numerology.soulUrgeNumber} ({generatedRecipe.numerology.soulUrgeTitle})</span>
                  <span className="text-[#777]">Dünya Misyonu (DM):</span>
                  <span className="text-[#c4a47c] font-mono font-bold">{generatedRecipe.numerology.dmNumber} ({generatedRecipe.numerology.dmTitle})</span>
                  <span className="text-[#777]">Karmik Eksik Çakralar:</span>
                  <span className="text-rose-400 font-mono font-bold">
                    {generatedRecipe.numerology.missingNumbers.length > 0 ? generatedRecipe.numerology.missingNumbers.join(', ') : 'Tam Denge (Eksik Yok)'}
                  </span>
                  <span className="text-[#777]">Kişisel Yıl Döngüsü:</span>
                  <span className="text-zinc-300 font-mono">{generatedRecipe.numerology.personalYear} ({generatedRecipe.numerology.personalYearTheme})</span>
                </div>
              </div>

              {/* 7+2 Çakra Dizilimi & Frekans Haritası */}
              {generatedRecipe.chakra && (
                <div className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
                    <span className="text-[10px] text-[#888] uppercase font-mono font-bold flex items-center gap-1.5">
                      <Disc className="w-3.5 h-3.5 text-[#c4a47c]" /> 7+2 Çakra Dizilimi & Enerji Rezonansı
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#16140e] border border-[#c4a47c]/40 text-[#c4a47c] font-bold">
                      Denge: {generatedRecipe.chakra.overallChakraBalanceScore}/100
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {generatedRecipe.chakra.chakras.slice(0, 7).map((c) => (
                      <div key={c.number} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-[#111] border border-[#1a1a1a]">
                        <span className="flex items-center gap-1.5 font-medium" style={{ color: c.color }}>
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                          {c.number}. {c.turkishName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-[#666]">{c.frequencyCount} harf</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            c.status === 'Blokajlı / Eksik' ? 'bg-rose-950/50 text-rose-300 border border-rose-800/40' :
                            c.status === 'Aşırı Yoğun' ? 'bg-amber-950/50 text-amber-300 border border-amber-800/40' :
                            'bg-[#181818] text-[#888]'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 rounded bg-[#14120a] border border-[#c4a47c]/20 text-[10px] text-[#d4c5b3] font-mono leading-relaxed">
                    ✦ <strong className="text-[#c4a47c]">Kozmik Şifa Reçetesi:</strong> {generatedRecipe.chakra.primaryHealingDirective}
                  </div>
                </div>
              )}

              {/* Astroloji Efemeris */}
              <div className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
                  <span className="text-[10px] text-[#888] uppercase font-mono font-bold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" /> Astroloji Efemeris Koordinatları
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c]">
                    {generatedRecipe.astrology.zodiacSystem === 'Tropical' ? 'Tropikal' : 'Sideral (Lahiri)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                  <span className="text-[#777]">Güneş Burcu:</span>
                  <span className="text-white font-mono text-[10px]">
                    {generatedRecipe.astrology.sunDegreeFormatted || generatedRecipe.astrology.sunSign} {generatedRecipe.astrology.sunSignSymbol}
                  </span>

                  <span className="text-[#777]">Ay Burcu (Sezgi):</span>
                  <span className={`font-mono text-[10px] ${generatedRecipe.astrology.isMoonNearCusp ? 'text-amber-300 font-bold' : 'text-white'}`}>
                    {generatedRecipe.astrology.moonDegreeFormatted || generatedRecipe.astrology.moonSign} {generatedRecipe.astrology.moonSignSymbol}
                  </span>

                  <span className="text-[#777]">Yükselen (ASC):</span>
                  <span className="text-white font-mono text-[10px]">
                    {generatedRecipe.astrology.ascendantDegreeFormatted || generatedRecipe.astrology.ascendantSign} {generatedRecipe.astrology.ascendantSignSymbol}
                  </span>

                  <span className="text-[#777]">Hakim Element:</span>
                  <span className="text-[#c4a47c] font-bold">{generatedRecipe.astrology.dominantElement}</span>

                  <span className="text-[#777]">Yönetici Gezegen:</span>
                  <span className="text-zinc-300 font-mono">{generatedRecipe.astrology.rulingPlanet}</span>
                </div>

                {generatedRecipe.astrology.isMoonNearCusp && (
                  <div className="p-2 rounded bg-amber-950/20 border border-amber-500/30 text-[10px] text-amber-200 font-mono">
                    ⚠️ Ay 29° İkizler Cusp Eşiğinde (Anaretik Derece Hassasiyeti)
                  </div>
                )}
              </div>

              {/* Enneagram */}
              <div className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
                  <span className="text-[10px] text-[#888] uppercase font-mono font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c4a47c]" /> Enneagram Arketip Haritası
                  </span>
                  {generatedRecipe.enneagram.isDeterminedByTest && (
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Test Onaylı
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                  <span className="text-[#777]">Tip & Kanat:</span>
                  <span className="text-white font-mono font-bold">{generatedRecipe.enneagram.typeName} ({generatedRecipe.enneagram.wing})</span>
                  <span className="text-[#777]">Temel Motivasyon:</span>
                  <span className="text-[#bbb] truncate">{generatedRecipe.enneagram.coreMotivation}</span>
                  <span className="text-[#777]">Stres (Gölge) Noktası:</span>
                  <span className="text-rose-400 font-mono font-bold">Tip {generatedRecipe.enneagram.stressPoint}</span>
                  <span className="text-[#777]">Büyüme (Işık) Noktası:</span>
                  <span className="text-emerald-400 font-mono font-bold">Tip {generatedRecipe.enneagram.growthPoint}</span>
                </div>
                <p className="text-[10px] text-[#888] font-mono leading-tight pt-1 border-t border-white/5">
                  ✦ <strong className="text-[#c4a47c]">Dövme Yansıması:</strong> {generatedRecipe.enneagram.symbolicMeaning}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Totem Hayvanları, İhtiyaç Duyulan Semboller & Kompozisyon (4 cols) */}
          <div className="lg:col-span-4 bg-[#080808] p-5 sm:p-6 lg:border-x border-[#1a1a1a] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold font-mono">
                <span className="mr-2 text-base">◆</span> 2. Totemler & İhtiyaç Duyulan Semboller
              </h3>
              {generatedRecipe.feasibility && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16140e] border border-[#c4a47c]/40 text-[#c4a47c] font-bold">
                  Zanaat Skoru: {generatedRecipe.feasibility.overallFeasibilityScore}/100
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-[#050505] p-4 sm:p-5 rounded-lg border border-[#1a1a1a] text-xs leading-relaxed text-[#bbb] custom-scrollbar space-y-4">
              {/* Summary */}
              <p className="italic font-serif text-xs sm:text-sm text-[#e0e0e0] leading-relaxed border-b border-[#1a1a1a] pb-3">
                {generatedRecipe.summaryRationale}
              </p>

              {/* 3'lü Ruhani Totem Hayvanı Hiyerarşisi */}
              {generatedRecipe.symbolism.totemHierarchy && generatedRecipe.symbolism.totemHierarchy.length > 0 && (
                <div className="p-3.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#c4a47c] font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#c4a47c]" /> Kişinin Muhtemel Totem Hayvanları Hiyerarşisi
                    </span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    {generatedRecipe.symbolism.totemHierarchy.map((totem, i) => (
                      <div key={i} className="p-2 rounded bg-[#121212] border border-[#1a1a1a] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1">
                            <span className="text-[#c4a47c]">✦</span> {totem.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#181818] text-[#c4a47c]">
                            {totem.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#777] font-mono">{totem.origin}</div>
                        <p className="text-[10px] text-[#aaa] leading-relaxed">{totem.meaning}</p>
                        <div className="text-[9px] text-[#c4a47c] font-mono pt-0.5 border-t border-white/5">
                          <strong>Dövmedeki Durumu:</strong>{' '}
                          {generatedRecipe.parameters.includeTotemInDesign
                            ? totem.visualRoleInTattoo
                            : 'Tasarıma dahil edilmedi (Danışan tercihi: Yalnızca ruhani analiz ve kişisel rehber olarak tutuldu)'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kişinin İhtiyaç Duyduğu Dengeleyici Semboller (Nedenleriyle) */}
              {generatedRecipe.symbolism.neededSymbols && generatedRecipe.symbolism.neededSymbols.length > 0 && (
                <div className="p-3.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-1.5">
                    <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" /> Kişinin İhtiyaç Duyduğu Semboller & Gerekçeleri
                    </span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    {generatedRecipe.symbolism.neededSymbols.map((s, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#121212] border border-[#1a1a1a] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{s.symbolName}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40">
                            {s.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-amber-300/90 font-mono">✦ Hedef: {s.targetDeficiency}</div>
                        <p className="text-[10px] text-[#999] leading-relaxed">
                          <strong className="text-[#ccc]">Neden Seçildi:</strong> {s.esotericRationale}
                        </p>
                        <div className="text-[9px] text-[#888] font-mono pt-0.5 border-t border-white/5">
                          <strong>Kompozisyon Konumu:</strong> {s.compositionPlacement}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mors Alfabesi Rakam Şifreleme Kartı */}
              {generatedRecipe.morseCodePattern && (
                <div className="p-3.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg space-y-2">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#c4a47c] font-bold flex items-center gap-1.5">
                      <Binary className="w-3.5 h-3.5 text-[#c4a47c]" /> Mors Alfabesi Kutsal Rakam Şifresi
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMorseModal(true)}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#16140e] border border-[#c4a47c]/40 text-[#c4a47c] hover:bg-[#201c10] cursor-pointer"
                    >
                      Mors Stüdyosu
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#777]">Şifrelenen Sayı/Tarih:</span>
                      <span className="text-white font-bold">{generatedRecipe.morseCodePattern.rawText}</span>
                    </div>
                    <div className="p-2 rounded bg-black/70 border border-white/5 text-[#c4a47c] text-center tracking-widest text-sm font-bold truncate">
                      {generatedRecipe.morseCodePattern.morseDisplay}
                    </div>
                    <p className="text-[10px] text-[#888] leading-relaxed">
                      {generatedRecipe.morseCodePattern.tattooSpecification.split('\n')[0].replace('- ', '')}
                    </p>
                  </div>
                </div>
              )}

              {/* Kompozisyon ve Anatomi Kılavuzu */}
              <div className="p-3.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#c4a47c] font-bold block">
                  ✦ Kompozisyon & Vücut Anatomisi Mimarisi:
                </span>
                <p className="text-[11px] text-[#bbb] leading-relaxed">{generatedRecipe.compositionGuide}</p>
                <div className="p-2 rounded bg-[#121212] border border-[#1a1a1a] text-[10px] text-[#aaa] font-mono">
                  <span className="text-[#666] block uppercase text-[9px] mb-0.5">Yerleşim & Yaşlanma:</span>
                  {generatedRecipe.placementAnatomyNotes}
                </div>
              </div>

              {/* Dövme Uygulanabilirliği (Feasibility) */}
              {generatedRecipe.feasibility && (
                <div className="p-3.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg space-y-2">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#888] font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Dövme Zanaat Kriterleri
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                    <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a]">
                      <span className="text-[#666] block text-[8px] uppercase">İğne:</span>
                      <span className="text-white font-medium">{generatedRecipe.feasibility.lineWeight}</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a]">
                      <span className="text-[#666] block text-[8px] uppercase">Negatif Alan:</span>
                      <span className="text-emerald-400 font-medium">{generatedRecipe.feasibility.negativeSpaceRatio}</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a]">
                      <span className="text-[#666] block text-[8px] uppercase">Blowout Emniyeti:</span>
                      <span className="text-amber-300">{generatedRecipe.feasibility.agingBlowoutRisk}</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#121212] border border-[#1a1a1a]">
                      <span className="text-[#666] block text-[8px] uppercase">Önerilen Ebat:</span>
                      <span className="text-[#c4a47c]">{generatedRecipe.feasibility.recommendedSize}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono">
              <div className="bg-[#111] p-2 rounded border border-[#222]">
                <span className="text-[8px] text-[#666] uppercase block">Seçili Stil</span>
                <span className="text-white truncate block">{generatedRecipe.parameters.selectedStyles.join(' + ')}</span>
              </div>
              <div className="bg-[#111] p-2 rounded border border-[#222]">
                <span className="text-[8px] text-[#666] uppercase block">Bölge & Akış</span>
                <span className="text-[#c4a47c] truncate block">{generatedRecipe.parameters.bodyPlacement}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Dövme Tasarım Prompt Suite & Teknik Brifi (4 cols) */}
          <div className="lg:col-span-4 bg-[#0a0a0a] p-5 sm:p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#c4a47c] text-xs uppercase tracking-widest flex items-center font-bold font-mono">
                <span className="mr-2 text-base">◆</span> 3. Dövme Tasarım Prompt Suite
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold">
                Motorlar Hazır
              </span>
            </div>

            {/* Prompt View Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-[#111] p-1 rounded-lg border border-[#222] text-[9px] font-mono">
              <button
                type="button"
                onClick={() => setPromptViewTab('shadow-dossier')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'shadow-dossier'
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-[#888] hover:text-amber-300'
                }`}
              >
                🔮 12 Bölüm
              </button>
              <button
                type="button"
                onClick={() => setPromptViewTab('client-letter')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'client-letter'
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-[#888] hover:text-emerald-300'
                }`}
              >
                💌 Müşteri Metni
              </button>
              <button
                type="button"
                onClick={() => setPromptViewTab('midjourney')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'midjourney'
                    ? 'bg-[#c4a47c] text-black font-bold shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                Midjourney
              </button>
              <button
                type="button"
                onClick={() => setPromptViewTab('dalle3')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'dalle3'
                    ? 'bg-[#c4a47c] text-black font-bold shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                DALL-E 3
              </button>
              <button
                type="button"
                onClick={() => setPromptViewTab('flux')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'flux'
                    ? 'bg-[#c4a47c] text-black font-bold shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                Flux.1 / SD
              </button>
              <button
                type="button"
                onClick={() => setPromptViewTab('stencil')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'stencil'
                    ? 'bg-[#c4a47c] text-black font-bold shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                03RL Stencil
              </button>
              <button
                type="button"
                onClick={() => setPromptViewTab('specsheet')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'specsheet'
                    ? 'bg-[#1e1c17] text-[#c4a47c] border border-[#c4a47c]/40 font-bold'
                    : 'text-[#888] hover:text-[#c4a47c]'
                }`}
              >
                Dövme Brifi
              </button>
              <button
                type="button"
                onClick={() => setPromptViewTab('explanation')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'explanation'
                    ? 'bg-[#1e1c17] text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-[#888] hover:text-cyan-300'
                }`}
              >
                Veri Haritası
              </button>
              <button
                type="button"
                onClick={() => setPromptViewTab('negative')}
                className={`py-1.5 px-1 rounded font-medium text-center transition-colors cursor-pointer ${
                  promptViewTab === 'negative'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                    : 'text-[#888] hover:text-rose-300'
                }`}
              >
                🚫 Negatif
              </button>
            </div>

            {/* Active Prompt Box */}
            <div className="flex-1 bg-[#0d0d0d] p-4 rounded-xl border border-[#222] relative group shadow-inner flex flex-col min-h-[280px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#1f1f1f]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span className="text-[10px] font-mono uppercase text-[#bbb] font-bold">
                    {promptViewTab === 'shadow-dossier' && '12 Bölümlük Master Gölge & Dövme Raporu'}
                    {promptViewTab === 'client-letter' && 'Müşteriye Özel Sembolizm & Şifa Metni (WhatsApp / E-Posta)'}
                    {promptViewTab === 'midjourney' && 'Midjourney v6.1 / Niji 6 Master Prompt'}
                    {promptViewTab === 'dalle3' && 'DALL-E 3 Studio Flash Plate Prompt'}
                    {promptViewTab === 'flux' && 'Flux.1 Pro / Stable Diffusion XL Prompt'}
                    {promptViewTab === 'stencil' && '03RL / 05RL Termal Stencil Transfer Çizimi'}
                    {promptViewTab === 'specsheet' && 'Dövme Sanatçısı Stüdyo Uygulama Brifi (Spec Sheet)'}
                    {promptViewTab === 'explanation' && '12-Nokta Reçete Görsel Veri Haritası'}
                    {promptViewTab === 'negative' && 'Anti-Mockup & Anti-Slop Negatif Prompt'}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    let textToCopy = '';
                    if (promptViewTab === 'shadow-dossier') textToCopy = generatedRecipe.shadowAnalysis?.fullMarkdownDossier || generatedRecipe.turkishPromptExplanation;
                    else if (promptViewTab === 'client-letter') textToCopy = generatedRecipe.shadowAnalysis?.sectionClientExplanation?.fullClientLetterText || '';
                    else if (promptViewTab === 'midjourney') textToCopy = generatedRecipe.midjourneyPrompt || generatedRecipe.masterShadedPrompt || generatedRecipe.masterEnglishPrompt;
                    else if (promptViewTab === 'dalle3') textToCopy = generatedRecipe.dalle3Prompt || generatedRecipe.masterEnglishPrompt;
                    else if (promptViewTab === 'flux') textToCopy = generatedRecipe.fluxPrompt || generatedRecipe.masterEnglishPrompt;
                    else if (promptViewTab === 'stencil') textToCopy = generatedRecipe.stencilPrompt || generatedRecipe.masterOutlinePrompt || generatedRecipe.masterEnglishPrompt;
                    else if (promptViewTab === 'specsheet') textToCopy = generatedRecipe.artistSpecSheet || generatedRecipe.needleAndTechniqueGuide;
                    else if (promptViewTab === 'negative') textToCopy = generatedRecipe.negativePrompt;
                    else if (promptViewTab === 'explanation') textToCopy = generatedRecipe.turkishPromptExplanation;
                    copyPromptToClipboard(textToCopy, promptViewTab);
                  }}
                  className="px-2.5 py-1 rounded bg-[#18150f] hover:bg-[#252015] border border-[#c4a47c]/40 hover:border-[#c4a47c] text-[#c4a47c] text-[10px] font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {copiedPromptType === promptViewTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className={copiedPromptType === promptViewTab ? 'text-emerald-400 font-bold' : ''}>
                    {copiedPromptType === promptViewTab ? 'KOPYALANDI' : 'KOPYALA'}
                  </span>
                </button>
              </div>

              {promptViewTab === 'shadow-dossier' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    readOnly
                    value={generatedRecipe.shadowAnalysis?.fullMarkdownDossier || generatedRecipe.turkishPromptExplanation}
                    className="w-full flex-1 bg-transparent text-[11px] font-mono leading-relaxed text-[#eee] resize-none outline-none custom-scrollbar select-all"
                    rows={9}
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a] text-[9px] font-mono">
                    <span className="text-amber-300">Tüm 12 Bölüm Dahil</span>
                    <button
                      type="button"
                      onClick={() => setStep5ViewMode('shadow-report')}
                      className="text-[#c4a47c] underline hover:text-white cursor-pointer"
                    >
                      Geniş Ekranda Aç ↗
                    </button>
                  </div>
                </div>
              )}

              {promptViewTab === 'client-letter' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    readOnly
                    value={generatedRecipe.shadowAnalysis?.sectionClientExplanation?.fullClientLetterText || ''}
                    className="w-full flex-1 bg-transparent text-[11px] font-mono leading-relaxed text-emerald-200 resize-none outline-none custom-scrollbar select-all"
                    rows={9}
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a] text-[9px] font-mono">
                    <span className="text-emerald-400">WhatsApp / E-posta İçin Hazır Metin</span>
                    <button
                      type="button"
                      onClick={() => setStep5ViewMode('shadow-report')}
                      className="text-emerald-400 underline hover:text-white cursor-pointer"
                    >
                      Dossier Ekranında Aç ↗
                    </button>
                  </div>
                </div>
              )}

              {promptViewTab === 'midjourney' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    readOnly
                    value={generatedRecipe.midjourneyPrompt || generatedRecipe.masterShadedPrompt || generatedRecipe.masterEnglishPrompt}
                    className="w-full flex-1 bg-transparent text-[11px] font-mono leading-relaxed text-[#ddd] resize-none outline-none custom-scrollbar select-all"
                    rows={9}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-[#888]">
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c]">--ar 2:3</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c]">--v 6.1</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c]">--style raw</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c]">--s 250</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-rose-300/80">--no skin, mockup</span>
                  </div>
                </div>
              )}

              {promptViewTab === 'dalle3' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    readOnly
                    value={generatedRecipe.dalle3Prompt || generatedRecipe.masterEnglishPrompt}
                    className="w-full flex-1 bg-transparent text-[11px] font-mono leading-relaxed text-[#ddd] resize-none outline-none custom-scrollbar select-all"
                    rows={9}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-[#888]">
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-cyan-300">Format: 1024x1792</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-cyan-300">Kalite: HD</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-cyan-300">İzole 2D Flaş</span>
                  </div>
                </div>
              )}

              {promptViewTab === 'flux' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    readOnly
                    value={generatedRecipe.fluxPrompt || generatedRecipe.masterEnglishPrompt}
                    className="w-full flex-1 bg-transparent text-[11px] font-mono leading-relaxed text-[#ddd] resize-none outline-none custom-scrollbar select-all"
                    rows={9}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-[#888]">
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-emerald-400">Sampler: Euler</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-emerald-400">Steps: 28</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-emerald-400">CFG: 3.5</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-emerald-400">832 x 1216</span>
                  </div>
                </div>
              )}

              {promptViewTab === 'stencil' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    readOnly
                    value={generatedRecipe.stencilPrompt || generatedRecipe.masterOutlinePrompt || generatedRecipe.masterEnglishPrompt}
                    className="w-full flex-1 bg-transparent text-[11px] font-mono leading-relaxed text-[#c4a47c] resize-none outline-none custom-scrollbar select-all"
                    rows={9}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-[#888]">
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c]">Saf İkili Siyah Kontur</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c]">Sıfır Gri Ton</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#c4a47c]">Termal Transfer Uyumlu</span>
                  </div>
                </div>
              )}

              {promptViewTab === 'specsheet' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    readOnly
                    value={generatedRecipe.artistSpecSheet || generatedRecipe.needleAndTechniqueGuide}
                    className="w-full flex-1 bg-transparent text-[11px] font-mono leading-relaxed text-amber-200/90 resize-none outline-none custom-scrollbar select-all"
                    rows={9}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-[#888]">
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-amber-300">Stüdyo Masası İçin Hazır</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-amber-300">İğne & Ton Dağılımı</span>
                  </div>
                </div>
              )}

              {promptViewTab === 'explanation' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    readOnly
                    value={generatedRecipe.turkishPromptExplanation}
                    className="w-full flex-1 bg-transparent text-[11px] font-mono leading-relaxed text-cyan-200/90 resize-none outline-none custom-scrollbar select-all"
                    rows={9}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-[#888]">
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-cyan-300">12-Nokta Reçete Görsel Veri Haritası</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161616] text-cyan-300">Sembolik & Anatomik Entegrasyon</span>
                  </div>
                </div>
              )}

              {promptViewTab === 'negative' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <p className="text-[10px] font-mono text-rose-300/90 leading-relaxed select-all flex-1">
                    {generatedRecipe.negativePrompt}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-[#888]">
                    <span className="px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-300">Anti-Mockup Guard</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-300">Anti-Skin / İnsan Bedeni Engeli</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setShowClientDossierModal(true)}
                className="w-full py-3 px-3 rounded-lg bg-gradient-to-r from-amber-600/30 via-[#c4a47c]/30 to-amber-700/30 hover:from-amber-600/40 hover:to-[#c4a47c]/40 border border-[#c4a47c]/70 text-[#f5e6cc] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c4a47c]/10 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#c4a47c]" />
                <span>📜 Kişisel Sembol Reçetesini Aç (Tek Sayfa Rapor & Denetim)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAllPrompts}
                className="w-full py-2.5 px-3 rounded-lg bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c4a47c]/20 transition-all cursor-pointer"
              >
                {copiedPromptType === 'all' ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPromptType === 'all' ? 'TÜM PROMPTLAR KOPYALANDI' : 'Tüm Promptları ve Brifi Kopyala'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadFullRecipeMarkdown}
                  className="py-2 px-3 rounded-lg bg-[#111] hover:bg-[#181818] border border-[#333] hover:border-[#c4a47c] text-xs font-mono text-[#ddd] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Dosyayı İndir (.md)</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaved}
                  className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isSaved
                      ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                      : 'bg-[#111] hover:bg-[#181818] border-[#333] hover:border-[#c4a47c] text-[#ddd]'
                  }`}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5 text-[#c4a47c]" />}
                  <span>{isSaved ? 'Kaydedildi' : 'Arşive Kaydet'}</span>
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleStartFreshDesign}
                  className="flex-1 py-2 rounded bg-[#141414] hover:bg-[#1f1f1f] border border-[#333] hover:border-[#c4a47c] text-[11px] text-white font-mono uppercase cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Yeni Kişi Başlat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-2 rounded bg-[#0d0d0d] hover:bg-[#141414] border border-[#222] text-[11px] text-[#aaa] font-mono uppercase cursor-pointer transition-colors"
                >
                  Parametreleri Düzenle
                </button>
                <button
                  type="button"
                  onClick={onViewArchive}
                  className="flex-1 py-2 rounded bg-[#0d0d0d] hover:bg-[#141414] border border-[#222] hover:border-[#c4a47c] text-[11px] text-[#c4a47c] font-mono uppercase cursor-pointer transition-colors"
                >
                  Arşivi Aç
                </button>
              </div>
            </div>
          </div>
        </div>
          )}
        </div>
      )}

      {/* Enneagram Quiz Modal */}
      <EnneagramQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onApplyResult={(type, wing) => {
          setSelectedEnneaType(type);
          setSelectedWing(wing);
          if (enneagram) {
            setEnneagram({
              ...getEnneagramProfile(type, wing),
              isDeterminedByTest: true
            });
          }
        }}
      />

      {/* Behavioral Totem Quiz Modal */}
      <TotemQuizModal
        isOpen={showTotemQuizModal}
        onClose={() => setShowTotemQuizModal(false)}
        initialAnswers={totemAnswers}
        enneagramType={selectedEnneaType}
        clientName={name}
        personalContext={{
          dominantElement: astrology?.dominantElement,
          lifePathNumber: numerology?.lifePathNumber,
          sunSign: astrology?.sunSign
        }}
        onApplyResult={(newAnswers, result) => {
          setTotemAnswers(newAnswers);
          setClientSaveFeedback(`✓ Davranışsal Totem hesaplandı: "${result.primaryTotem.name}" (%${result.confidenceScore} uyum)!`);
          setTimeout(() => setClientSaveFeedback(null), 4000);
        }}
      />

      {/* Calculation Detail Modal */}
      <CalculationDetailModal
        isOpen={showCalcModal}
        onClose={() => setShowCalcModal(false)}
        numerology={numerology}
        astrology={astrology}
        initialTab={calcModalTab}
      />

      {/* Morse Code Studio Modal */}
      <MorseCodeModal
        isOpen={showMorseModal}
        onClose={() => setShowMorseModal(false)}
        birthDate={birthDate}
        lifePathNumber={numerology?.lifePathNumber}
        personalNumbers={personalNumbers}
        dmNumber={numerology?.dmNumber}
        clientName={name}
        onApplyToDesign={(result) => {
          setUseMorseCodeForNumbers(true);
          setCustomMorseInput(result.rawInput);
        }}
      />

      {/* Enneagram Customer Share & Import Modal */}
      <EnneagramShareModal
        isOpen={showEnneagramShareModal}
        onClose={() => setShowEnneagramShareModal(false)}
        clientName={name || 'Danışan'}
        onApplyImportedResult={(type, wing) => {
          setSelectedEnneaType(type);
          setSelectedWing(wing);
          if (enneagram) {
            setEnneagram({
              ...getEnneagramProfile(type, wing),
              isDeterminedByTest: true
            });
          }
        }}
        onOpenClientView={() => {
          setShowEnneagramShareModal(false);
          setShowClientQuizView(true);
        }}
      />

      {/* Danışan Görüşme & Şifa Dosyası Modal (Ekler Dahil) */}
      {generatedRecipe && (
        <ClientConsultationDossierModal
          isOpen={showClientDossierModal}
          onClose={() => setShowClientDossierModal(false)}
          recipe={generatedRecipe}
        />
      )}

      {/* Tekil Danışan Bilgi Formu Link Modal */}
      <ClientIntakeLinkModal
        isOpen={showIntakeLinkModal}
        onClose={() => setShowIntakeLinkModal(false)}
        onOpenFormInApp={() => {
          if (typeof window !== 'undefined') {
            window.location.search = '?mode=client-form';
          }
        }}
      />
    </div>
  );
};
