import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, CheckCircle2, AlertCircle, Loader2, ChevronDown, X, Compass, ExternalLink } from 'lucide-react';
import { ResolvedLocation, searchLocalLocations, COMMON_WORLD_COUNTRIES } from '../../utils/locationResolver';

interface LocationAutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onLocationSelect?: (loc: ResolvedLocation) => void;
  selectedLocation?: ResolvedLocation | null;
  error?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  showCountryFilter?: boolean;
}

export const LocationAutocompleteInput: React.FC<LocationAutocompleteInputProps> = ({
  value,
  onChange,
  onLocationSelect,
  selectedLocation,
  error,
  placeholder = 'Örn: İstanbul, San Francisco, Tokyo, London, São Paulo, Heidelberg...',
  className = '',
  inputClassName = '',
  showCountryFilter = true
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(selectedLocation?.countryCode || '');
  const [suggestions, setSuggestions] = useState<ResolvedLocation[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ambiguousCandidates, setAmbiguousCandidates] = useState<ResolvedLocation[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Sync country if selectedLocation has one
  useEffect(() => {
    if (selectedLocation?.countryCode && selectedLocation.countryCode !== 'XX') {
      setSelectedCountry(selectedLocation.countryCode);
    }
  }, [selectedLocation]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch suggestions when query or country changes
  useEffect(() => {
    const query = value.trim();
    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      setAmbiguousCandidates([]);
      setSearchError(null);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      // 1. Instant local search first
      const localMatches = searchLocalLocations(query, selectedCountry || undefined);
      if (localMatches.length > 0) {
        setSuggestions(localMatches.slice(0, 8));
        setIsOpen(true);
      }

      // 2. Fetch server API for full worldwide results
      setIsLoading(true);
      setSearchError(null);
      try {
        const countryParam = selectedCountry ? `&country=${encodeURIComponent(selectedCountry)}` : '';
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}${countryParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.locations)) {
            if (data.locations.length > 0) {
              const nextLocations = data.locations.slice(0, 10);
              setSuggestions(nextLocations);
              setIsOpen(true);

              // Şehir + ülke gibi açık bir tam eşleşme varsa otomatik doğrula.
              // Birden fazla aday varsa seçim kullanıcıya bırakılır; rastgele seçim yoktur.
              const normalizedQuery = query
                .toLocaleLowerCase('tr-TR')
                .replace(/[.,]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

              const exactMatches = nextLocations.filter((loc) => {
                const candidates = [
                  loc.displayName,
                  loc.name,
                  loc.city,
                  `${loc.city}, ${loc.country}`
                ].filter(Boolean).map((v) =>
                  String(v).toLocaleLowerCase('tr-TR').replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim()
                );
                return candidates.includes(normalizedQuery);
              });

              if (exactMatches.length === 1 && !selectedLocation) {
                handleSelect(exactMatches[0]);
              }

              // Check if query is ambiguous without state/region (e.g. "Springfield")
              const distinct = new Set(data.locations.map((l: ResolvedLocation) => `${l.city}_${l.region || ''}_${l.country}`));
              if (distinct.size > 1 && !selectedLocation) {
                setAmbiguousCandidates(data.locations.slice(0, 5));
              } else {
                setAmbiguousCandidates([]);
              }
            } else if (localMatches.length === 0) {
              setSuggestions([]);
              setSearchError(`"${query}" konumu bulunamadı. Lütfen şehir ve ülke adını kontrol edin.`);
            }
          }
        }
      } catch {
        // Fallback to local matches
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, selectedCountry]);

  const handleInputChange = (nextValue: string) => {
    onChange(nextValue);
    // Kullanıcı doğrulanmış konum metnini elle değiştirirse eski koordinat/timezone
    // kesinlikle taşınmamalı; yeni konum yeniden seçilmelidir.
    if (selectedLocation) {
      const selectedText = (selectedLocation.displayName || selectedLocation.name || '').trim();
      if (nextValue.trim() !== selectedText) {
        setAmbiguousCandidates([]);
        if (onLocationSelect) onLocationSelect(null as any);
      }
    }
  };

  const handleSelect = (loc: ResolvedLocation) => {
    onChange(loc.displayName || loc.name);
    setIsOpen(false);
    setAmbiguousCandidates([]);
    setSearchError(null);
    if (loc.countryCode && loc.countryCode !== 'XX') {
      setSelectedCountry(loc.countryCode);
    }
    if (onLocationSelect) {
      onLocationSelect(loc);
    }
  };

  const handleClearSelection = () => {
    onChange('');
    setSuggestions([]);
    setAmbiguousCandidates([]);
    setIsOpen(false);
    if (onLocationSelect) {
      onLocationSelect(null as any);
    }
  };

  const selectedCountryObj = COMMON_WORLD_COUNTRIES.find(c => c.code === selectedCountry);

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
      {/* 1. Ülke Seçim Katmanı (Ülke → Şehir / Yerleşim → Seçilen Gerçek Konum) */}
      {showCountryFilter && (
        <div className="bg-[#121212] border border-[#252525] rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono text-[#aaa] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span className="font-semibold text-[#ddd]">1. Ülke Seçimi</span>
              <span className="text-[10px] text-[#666]">(İsteğe Bağlı / Filtreleme)</span>
            </label>
            {selectedCountry && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCountry('');
                  setSuggestions([]);
                }}
                className="text-[10px] font-mono text-[#888] hover:text-[#c4a47c] transition-colors cursor-pointer"
              >
                Tüm Ülkelere Sıfırla
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => {
                const newC = e.target.value;
                setSelectedCountry(newC);
                setIsOpen(false);
                // Ülke filtresi değiştiğinde önceki konum doğrulamasını geçersiz kıl.
                if (selectedLocation && onLocationSelect) onLocationSelect(null as any);
              }}
              className="w-full text-xs font-mono bg-[#161616] text-white border border-[#2e2e2e] rounded-md px-3 py-2 pr-8 focus:outline-none focus:border-[#c4a47c] appearance-none cursor-pointer hover:border-[#3e3e3e] transition-colors"
            >
              <option value="">🌍 Tüm Ülkeler / Global Arama (Seçim Serbest)</option>
              {COMMON_WORLD_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.nameTr} ({c.nameEn})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#888] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 2. Şehir / Yerleşim Arama Girişi */}
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-mono text-[#aaa] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span className="text-[#ddd] font-semibold">2. Şehir / İlçe / Kasaba / Yerleşim</span>
            <span className="text-rose-400">*</span>
          </label>
          {selectedCountryObj && (
            <span className="text-[10px] font-mono text-[#c4a47c] bg-[#c4a47c]/10 px-2 py-0.5 rounded border border-[#c4a47c]/20">
              {selectedCountryObj.flag} {selectedCountryObj.nameTr} içinde aranıyor
            </span>
          )}
        </div>

        <div className="relative">
          <MapPin className="w-4 h-4 text-[#777] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder={
              selectedCountryObj
                ? `Örn: ${selectedCountryObj.nameTr} içindeki şehir, ilçe veya kasaba...`
                : placeholder
            }
            className={`w-full pl-9 pr-20 py-2.5 bg-[#121212] border rounded-lg text-xs text-white placeholder-[#555] focus:outline-none transition-colors ${
              error
                ? 'border-rose-500/80 bg-rose-950/10'
                : selectedLocation
                ? 'border-emerald-500/50 focus:border-emerald-400'
                : 'border-[#262626] focus:border-[#c4a47c]'
            } ${inputClassName}`}
          />

          <div className="absolute right-2.5 top-2 flex items-center gap-1.5">
            {isLoading && (
              <div className="text-[#c4a47c] animate-spin p-1">
                <Loader2 className="w-4 h-4" />
              </div>
            )}

            {value && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-[#666] hover:text-[#bbb] p-1 rounded transition-colors cursor-pointer"
                title="Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {!isLoading && selectedLocation && (
              <div className="text-emerald-400 p-1" title="Konum astronomik olarak doğrulandı">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Autocomplete Dropdown List */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[#141414] border border-[#333] rounded-lg shadow-2xl divide-y divide-[#222]">
              <div className="px-3 py-1.5 bg-[#181818] text-[10px] font-mono text-[#888] flex items-center justify-between">
                <span>Dünya Çapında Eşleşen Konumlar</span>
                <span>{suggestions.length} sonuç</span>
              </div>
              {suggestions.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-3 py-2.5 hover:bg-[#222] transition-colors flex items-start gap-2.5 group cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#c4a47c] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium truncate flex items-center gap-1.5">
                      <span>{loc.displayName || `${loc.name}, ${loc.country}`}</span>
                    </div>
                    <div className="text-[10px] text-[#888] font-mono flex items-center gap-2 mt-0.5">
                      <span className="text-[#bbb]">
                        {loc.lat > 0 ? `${loc.lat.toFixed(2)}° N` : `${Math.abs(loc.lat).toFixed(2)}° S`},{' '}
                        {loc.lon > 0 ? `${loc.lon.toFixed(2)}° E` : `${Math.abs(loc.lon).toFixed(2)}° W`}
                      </span>
                      <span>•</span>
                      <span className="text-[#c4a47c] font-medium">{loc.timezone}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Çoklu Eşleşme (Ambiguous) Seçim Kartları */}
      {ambiguousCandidates.length > 1 && !selectedLocation && (
        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span className="font-semibold">Birden fazla konum bulundu. Lütfen doğru olanı seçiniz:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            {ambiguousCandidates.map((cand) => (
              <button
                key={cand.id}
                type="button"
                onClick={() => handleSelect(cand)}
                className="text-left p-2 rounded bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-[#c4a47c]/60 text-xs transition-all cursor-pointer group"
              >
                <div className="font-medium text-white group-hover:text-[#c4a47c] truncate">
                  {cand.displayName}
                </div>
                <div className="text-[10px] font-mono text-[#888] mt-0.5">
                  {cand.lat.toFixed(2)}°, {cand.lon.toFixed(2)}° • {cand.timezone}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Doğrulanmış Gerçek Konum Rozeti & Detayı */}
      {selectedLocation && (
        <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Coğrafi Konum & Zaman Dilimi Doğrulandı</span>
            </span>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-[10px] text-[#aaa] hover:text-white underline cursor-pointer"
            >
              Değiştir
            </button>
          </div>
          <div className="text-xs text-white font-medium">
            {selectedLocation.displayName || selectedLocation.name}
          </div>
          <div className="text-[10px] font-mono text-[#aaa] flex flex-wrap items-center gap-3 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-300">
              <Compass className="w-3 h-3" />
              <span>
                {selectedLocation.lat > 0 ? `${selectedLocation.lat.toFixed(4)}° Kuzey` : `${Math.abs(selectedLocation.lat).toFixed(4)}° Güney`},{' '}
                {selectedLocation.lon > 0 ? `${selectedLocation.lon.toFixed(4)}° Doğu` : `${Math.abs(selectedLocation.lon).toFixed(4)}° Batı`}
              </span>
            </span>
            <span>•</span>
            <span>Saat Dilimi: <strong className="text-white">{selectedLocation.timezone}</strong></span>
          </div>
        </div>
      )}

      {/* 5. Arama Hatası */}
      {searchError && !selectedLocation && (
        <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/30 text-xs text-rose-300 font-mono flex items-start gap-1.5">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{searchError}</span>
        </div>
      )}

      {/* 6. Form Hatası */}
      {error && (
        <p className="text-[11px] text-rose-400 font-mono leading-tight flex items-start gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
