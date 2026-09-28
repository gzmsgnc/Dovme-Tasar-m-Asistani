import React, { useState } from 'react';
import { PersonData } from '../../types';
import { calculateNumerology } from '../../utils/numerology';
import { calculateAstrology } from '../../utils/astrology';
import { getEnneagramProfile } from '../../utils/enneagram';
import { calculateTotemAnimal } from '../../utils/totemCalculator';
import { 
  User, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight,
  UserCheck,
  Edit3,
  Compass,
  FileText,
  Share2,
  Layers,
  Heart,
  Phone,
  Mail,
  RefreshCw
} from 'lucide-react';
import { ClientFormModal } from '../modals/ClientFormModal';
import { ClientIntakeLinkModal } from '../modals/ClientIntakeLinkModal';
import { syncClientsWithServer } from '../../utils/storage';

interface ClientsViewProps {
  clients: PersonData[];
  onStartDesignForClient: (client: PersonData) => void;
  onDeleteClient: (id: string) => void;
  onAddNewClientClick: () => void;
  onSaveClient: (client: PersonData) => void;
  onClearAllClients?: () => void;
  onOpenClientForm?: () => void;
  onClientsSynced?: (synced: PersonData[]) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onStartDesignForClient,
  onDeleteClient,
  onAddNewClientClick,
  onSaveClient,
  onClearAllClients,
  onOpenClientForm,
  onClientsSynced
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientDetail, setSelectedClientDetail] = useState<PersonData | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<PersonData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'form_only'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncWithServer = async () => {
    setIsSyncing(true);
    try {
      const synced = await syncClientsWithServer();
      if (onClientsSynced) {
        onClientsSynced(synced);
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const formClientsCount = clients.filter(c => c.source === 'client_form' || c.status === 'new').length;

  const filteredClients = clients.filter(c => {
    if (filterTab === 'form_only' && c.source !== 'client_form' && c.status !== 'new') {
      return false;
    }
    return (
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.birthPlace && c.birthPlace.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header & Actions */}
      <header className="border-b border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 bg-[#080808]/80 backdrop-blur-md p-4 rounded-xl">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-[#c4a47c] font-bold flex items-center gap-2">
            <span>◆</span>
            <span>Kayıtlı Kişiler & Danışanlar ({clients.length})</span>
          </h2>
          <p className="text-[11px] text-[#666] font-mono mt-0.5">
            Doğum haritaları, numerolojik matrisler ve sembolik arketip profilleri.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onClearAllClients && clients.length > 0 && (
            showPurgeConfirm ? (
              <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-700/60 p-1.5 rounded-lg animate-fadeIn">
                <span className="text-[10px] text-rose-300 font-mono px-1">Tüm kayıtlar silinsin mi?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearAllClients();
                    setShowPurgeConfirm(false);
                  }}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded cursor-pointer transition-all"
                >
                  Evet, Sil
                </button>
                <button
                  type="button"
                  onClick={() => setShowPurgeConfirm(false)}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] rounded cursor-pointer transition-all"
                >
                  İptal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPurgeConfirm(true)}
                className="px-3 py-2 rounded bg-[#141414] hover:bg-rose-950/30 border border-[#333] hover:border-rose-700/60 text-[#888] hover:text-rose-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Tüm demo/test kayıtlarını kalıcı olarak temizler"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Kayıtları Temizle</span>
              </button>
            )
          )}

          {/* Danışan Formu Linki Paylaşım Butonu */}
          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="px-3.5 py-2 rounded bg-[#17140e] hover:bg-[#221c13] border border-[#c4a47c]/50 text-[#c4a47c] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Müşteriye tek bir link göndermek için form bağlantısı oluşturur"
          >
            <Share2 className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Danışan Formu Linki</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setClientToEdit(null);
              setIsClientModalOpen(true);
            }}
            className="px-4 py-2 rounded bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#c4a47c]/15 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Danışan Ekle</span>
          </button>
        </div>
      </header>

      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-[#555] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="İsim, doğum yeri veya özel notlarda ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-xs text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0c0c0c] p-1 rounded-lg border border-[#1e1e1e]">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-[#1e1a12] text-[#c4a47c] font-bold border border-[#c4a47c]/40'
                : 'text-[#777] hover:text-[#bbb]'
            }`}
          >
            Tümü ({clients.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('form_only')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'form_only'
                ? 'bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-500/40'
                : 'text-[#777] hover:text-emerald-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Form ile Gelenler ({formClientsCount})</span>
          </button>
        </div>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-16 border border-[#1a1a1a] rounded-xl bg-[#0a0a0a] p-8 space-y-3">
          <User className="w-10 h-10 text-[#444] mx-auto" />
          <p className="text-xs text-[#777] font-mono">Henüz kayıtlı kişi bulunmuyor veya arama kriteriyle eşleşmedi.</p>
          <button
            type="button"
            onClick={onAddNewClientClick}
            className="px-4 py-2 rounded bg-[#151515] border border-[#333] hover:border-[#c4a47c] text-[#c4a47c] text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            Yeni Kişi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => {
            let num: any = null;
            let astro: any = null;
            let totem: any = null;
            let calcError: string | null = null;

            try {
              num = calculateNumerology(client.name, client.birthDate);
              astro = calculateAstrology(client.birthDate, client.birthTime, client.birthPlace);
              totem = calculateTotemAnimal({
                name: client.name,
                birthDate: client.birthDate,
                birthTime: client.birthTime,
                birthPlace: client.birthPlace,
                motherName: client.motherName,
                totemAnswers: client.totemAnswers,
                enneagramType: client.enneagramType,
                lifePathNumber: num.lifePathNumber,
                dominantElement: astro.dominantElement,
                sunSign: astro.sunSign
              });
            } catch (err: unknown) {
              calcError = err instanceof Error ? err.message : String(err);
            }

            const ennea = getEnneagramProfile(client.enneagramType || 4, client.enneagramWing || '4w5');

            return (
              <div
                key={client.id}
                className="border border-[#1a1a1a] hover:border-[#c4a47c]/40 bg-[#0a0a0a] rounded-xl p-5 transition-all space-y-3.5 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif flex-wrap">
                        <span>{client.name}</span>
                        {num?.divineHelp19?.has19 && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#151515] border border-[#c4a47c]/40 text-[#c4a47c]">
                            19 İlahi
                          </span>
                        )}
                        {(client.source === 'client_form' || client.status === 'new') && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>Yeni Danışan Formu</span>
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#666] font-mono mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#555]" />
                          <span>{client.birthDate}</span>
                        </span>
                        {client.birthTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#555]" />
                            <span>{client.birthTime}</span>
                          </span>
                        )}
                        {client.birthPlace && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#555]" />
                            <span>{client.birthPlace}</span>
                          </span>
                        )}
                        {client.motherName && (
                          <span className="flex items-center gap-1 text-[#888]">
                            <Heart className="w-3 h-3 text-[#c4a47c]" />
                            <span>Anne: {client.motherName}</span>
                          </span>
                        )}
                      </div>

                      {(client.enneagramAnswers || client.totemAnswers) && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#888] pt-1">
                          {client.enneagramAnswers && (
                            <span className="px-1.5 py-0.5 rounded bg-[#111] border border-[#222]">
                              Enneagram: {Object.keys(client.enneagramAnswers).length}/5
                            </span>
                          )}
                          {client.totemAnswers && (
                            <span className="px-1.5 py-0.5 rounded bg-[#111] border border-[#222]">
                              Totem Testi: {Object.keys(client.totemAnswers).length}/15
                            </span>
                          )}
                          {client.createdAt && (
                            <span className="text-[#555] ml-auto text-[9px]">
                              {new Date(client.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="Bilgileri Düzenle"
                        onClick={() => {
                          setClientToEdit(client);
                          setIsClientModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-[#111] hover:bg-[#181818] text-[#888] hover:text-[#c4a47c] border border-[#222] text-xs transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Detay Profil"
                        onClick={() => setSelectedClientDetail(client)}
                        className="p-1.5 rounded bg-[#111] hover:bg-[#181818] text-[#888] hover:text-[#e0e0e0] border border-[#222] text-xs transition-all cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirmId === client.id ? (
                        <div className="flex items-center gap-1 animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteClient(client.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-mono font-bold cursor-pointer transition-colors"
                          >
                            Sil
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-1 rounded bg-[#222] hover:bg-[#333] text-zinc-300 text-[10px] font-mono cursor-pointer"
                          >
                            Vazgeç
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          title="Kişiyi Sil"
                          onClick={() => setDeleteConfirmId(client.id)}
                          className="p-1.5 rounded bg-[#111] hover:bg-rose-950/40 text-[#888] hover:text-rose-400 border border-[#222] text-xs transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Esoteric Metrics Row or Validation Notice */}
                  {calcError ? (
                    <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                      ⚠ {calcError}
                    </div>
                  ) : num && astro ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                      <div className="p-2 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                        <span className="text-[9px] text-[#555] block uppercase font-mono">Yaşam Yolu</span>
                        <span className="text-sm font-bold font-mono text-[#c4a47c]">{num.lifePathNumber}</span>
                      </div>

                      <div className="p-2 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                        <span className="text-[9px] text-[#555] block uppercase font-mono">Güneş / Yükselen</span>
                        <span className="text-xs font-bold text-white truncate block">{astro.sunSign} / {astro.ascendantSign}</span>
                      </div>

                      <div className="p-2 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                        <span className="text-[9px] text-[#555] block uppercase font-mono">Enneagram</span>
                        <span className="text-xs font-bold font-mono text-white">{ennea.wing}</span>
                      </div>

                      <div className="p-2 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                        <span className="text-[9px] text-[#555] block uppercase font-mono flex items-center justify-center gap-1">
                          <Compass className="w-2.5 h-2.5 text-[#c4a47c]" />
                          <span>Ruh Totemi</span>
                        </span>
                        <span className="text-xs font-bold text-[#c4a47c] truncate block" title={totem?.primaryTotem?.name || 'Totem'}>
                          {totem?.primaryTotem?.name ? totem.primaryTotem.name.split(' ')[0] : 'Totem'}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {client.notes && (
                    <p className="text-[11px] text-[#777] line-clamp-1 italic bg-[#0d0d0d] p-2 rounded border border-[#1a1a1a]">
                      "{client.notes}"
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onStartDesignForClient(client)}
                  className="w-full py-2 px-3 rounded bg-[#111] hover:bg-[#181818] border border-[#222] hover:border-[#c4a47c] text-[#c4a47c] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Özel Dövme Tasarla</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClientDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl custom-scrollbar">
            {(() => {
              let num = null;
              let astro = null;
              let calcError: string | null = null;

              try {
                num = calculateNumerology(selectedClientDetail.name, selectedClientDetail.birthDate);
                astro = calculateAstrology(selectedClientDetail.birthDate, selectedClientDetail.birthTime, selectedClientDetail.birthPlace);
              } catch (err: unknown) {
                calcError = err instanceof Error ? err.message : String(err);
              }

              const ennea = getEnneagramProfile(selectedClientDetail.enneagramType || 4, selectedClientDetail.enneagramWing || '4w5');

              return (
                <>
                  <div className="flex items-start justify-between border-b border-[#1a1a1a] pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">{selectedClientDetail.name}</h3>
                      <p className="text-xs text-[#666] font-mono mt-0.5">{selectedClientDetail.birthDate} • {selectedClientDetail.birthPlace || 'Belirtilmedi'}</p>
                    </div>
                    <button
                      onClick={() => setSelectedClientDetail(null)}
                      className="text-[#666] hover:text-white text-lg font-bold px-2 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>

                  {calcError ? (
                    <div className="p-3.5 rounded bg-amber-950/20 border border-amber-500/40 text-amber-300 text-xs font-mono space-y-1">
                      <div className="font-bold">⚠ Doğrulama Hatası:</div>
                      <div>{calcError}</div>
                      <div className="text-[11px] text-[#aaa] pt-1">
                        Doğum haritası ve numeroloji hesaplamasının çalışabilmesi için lütfen danışan bilgilerini düzenleyerek geçerli bir takvim tarihi ve desteklenen bir şehir girin.
                      </div>
                    </div>
                  ) : num && astro ? (
                    <>
                      {/* Numerology Summary */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#c4a47c] uppercase tracking-wider font-mono block">
                          ◆ Numeroloji Matrisi
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                            <span className="text-[9px] text-[#555] block font-mono uppercase">Yaşam Yolu: {num.lifePathNumber}</span>
                            <span className="text-white font-medium">{num.lifePathTitle}</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                            <span className="text-[9px] text-[#555] block font-mono uppercase">Ana Kulvar: {num.destinyNumber}</span>
                            <span className="text-white font-medium">{num.destinyTitle}</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                            <span className="text-[9px] text-[#555] block font-mono uppercase">DM Misyonu: {num.dmNumber}</span>
                            <span className="text-white font-medium">{num.dmTitle}</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0d0d0d] border border-[#1a1a1a]">
                            <span className="text-[9px] text-[#555] block font-mono uppercase">19 İlahi Yardım</span>
                            <span className="text-[#c4a47c] font-medium">{num.divineHelp19.level}</span>
                          </div>
                        </div>
                      </div>

                      {/* Astrology & Enneagram */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#c4a47c] uppercase tracking-wider font-mono block">
                          ◆ Astroloji & Enneagram
                        </span>
                        <div className="p-3.5 rounded bg-[#0d0d0d] border border-[#1a1a1a] text-xs space-y-1.5">
                          <div className="text-white">Güneş: <strong>{astro.sunSign} ({astro.sunSignElement})</strong> • Ay: <strong>{astro.moonSign}</strong> • Yükselen: <strong>{astro.ascendantSign}</strong></div>
                          <div className="text-[#aaa]">Enneagram: <strong className="text-white">{ennea.typeName} ({ennea.wing})</strong></div>
                          <div className="text-[11px] text-[#777] leading-relaxed pt-1 border-t border-[#1a1a1a]">{astro.summary}</div>
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="pt-3 border-t border-[#1a1a1a] flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const clientToLoad = selectedClientDetail;
                        setSelectedClientDetail(null);
                        setClientToEdit(clientToLoad);
                        setIsClientModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded bg-[#161616] hover:bg-[#222] border border-[#333] hover:border-[#c4a47c] text-[#c4a47c] font-medium text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Düzenle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClientDetail(null);
                        onStartDesignForClient(selectedClientDetail);
                      }}
                      className="flex-1 py-2.5 rounded bg-[#c4a47c] hover:bg-[#b89569] text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Dövme Tasarla
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedClientDetail(null)}
                      className="px-4 py-2.5 rounded bg-[#111] hover:bg-[#181818] border border-[#222] text-[#888] text-xs uppercase font-mono cursor-pointer"
                    >
                      Kapat
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Danışan Ekle / Düzenle Modal */}
      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
        onSaveClient={onSaveClient}
        onSaveAndStartDesign={(client) => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
          onStartDesignForClient(client);
        }}
        initialClient={clientToEdit}
      />

      {/* Tekil Danışan Bilgi Formu Link Paylaşım Modal */}
      <ClientIntakeLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onOpenFormInApp={onOpenClientForm}
      />
    </div>
  );
};
