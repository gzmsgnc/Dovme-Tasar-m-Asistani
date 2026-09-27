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
  Compass
} from 'lucide-react';
import { ClientFormModal } from '../modals/ClientFormModal';

interface ClientsViewProps {
  clients: PersonData[];
  onStartDesignForClient: (client: PersonData) => void;
  onDeleteClient: (id: string) => void;
  onAddNewClientClick: () => void;
  onSaveClient: (client: PersonData) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onStartDesignForClient,
  onDeleteClient,
  onAddNewClientClick,
  onSaveClient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientDetail, setSelectedClientDetail] = useState<PersonData | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<PersonData | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.birthPlace && c.birthPlace.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      </header>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-[#555] absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="İsim, doğum yeri veya özel notlarda ara..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-xs text-[#e0e0e0] placeholder-[#555] focus:border-[#c4a47c] focus:outline-none"
        />
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
            const num = calculateNumerology(client.name, client.birthDate);
            const astro = calculateAstrology(client.birthDate, client.birthTime, client.birthPlace);
            const ennea = getEnneagramProfile(client.enneagramType || 4, client.enneagramWing || '4w5');
            const totem = calculateTotemAnimal({
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

            return (
              <div
                key={client.id}
                className="border border-[#1a1a1a] hover:border-[#c4a47c]/40 bg-[#0a0a0a] rounded-xl p-5 transition-all space-y-3.5 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                        <span>{client.name}</span>
                        {num.divineHelp19.has19 && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#151515] border border-[#c4a47c]/40 text-[#c4a47c]">
                            19 İlahi
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
                      </div>
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
                      <button
                        type="button"
                        title="Kişiyi Sil"
                        onClick={() => {
                          if (confirm(`${client.name} kişisini silmek istediğinizden emin misiniz?`)) {
                            onDeleteClient(client.id);
                          }
                        }}
                        className="p-1.5 rounded bg-[#111] hover:bg-rose-950/40 text-[#888] hover:text-rose-400 border border-[#222] text-xs transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Esoteric Metrics Row */}
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
              const num = calculateNumerology(selectedClientDetail.name, selectedClientDetail.birthDate);
              const astro = calculateAstrology(selectedClientDetail.birthDate, selectedClientDetail.birthTime, selectedClientDetail.birthPlace);
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
    </div>
  );
};
