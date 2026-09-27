import React from 'react';
import { 
  Sparkles, 
  Users, 
  BookOpen, 
  Layers, 
  Compass, 
  Database,
  Moon,
  ChevronRight
} from 'lucide-react';

export type ActiveTab = 'new_design' | 'clients' | 'archive' | 'symbols' | 'styles';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  clientsCount: number;
  recipesCount: number;
  onOpenBackup: () => void;
  activeClientName?: string | null;
  onStartNewClient?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  clientsCount,
  recipesCount,
  onOpenBackup,
  activeClientName,
  onStartNewClient
}) => {
  const navItems = [
    { id: 'new_design' as ActiveTab, label: 'YENİ TASARIM', icon: Sparkles, badge: null },
    { id: 'clients' as ActiveTab, label: 'KAYITLI KİŞİLER', icon: Users, badge: clientsCount > 0 ? clientsCount : null },
    { id: 'archive' as ActiveTab, label: 'TASARIM ARŞİVİ', icon: BookOpen, badge: recipesCount > 0 ? recipesCount : null },
    { id: 'symbols' as ActiveTab, label: 'SEMBOL KÜTÜPHANESİ', icon: Compass, badge: null },
    { id: 'styles' as ActiveTab, label: 'STİL KÜTÜPHANESİ', icon: Layers, badge: null },
  ];

  return (
    <>
      {/* Desktop Sidebar (lg and above) */}
      <aside className="hidden lg:flex w-64 border-r border-[#1a1a1a] bg-[#0a0a0a] flex-col p-6 shrink-0 h-screen sticky top-0">
        <div className="mb-6 cursor-pointer select-none" onClick={() => onStartNewClient ? onStartNewClient() : setActiveTab('new_design')}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#c4a47c]/20 border border-[#c4a47c]/50 flex items-center justify-center text-[#c4a47c]">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-[#c4a47c] font-serif text-xl tracking-widest uppercase font-bold">
              InkScribe
            </h1>
          </div>
          <p className="text-[9px] text-[#666] tracking-[3px] uppercase mt-1.5 font-mono">
            Personal Design Assistant
          </p>
        </div>

        {/* Quick New Client Action */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onStartNewClient ? onStartNewClient() : setActiveTab('new_design')}
            className="w-full py-2.5 px-3 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-[#c4a47c]/40 hover:border-[#c4a47c] text-[#c4a47c] hover:text-white flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer shadow-sm shadow-[#c4a47c]/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>+ YENİ DANIŞAN</span>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#c4a47c] text-black shadow-md shadow-[#c4a47c]/10'
                    : 'text-[#999] hover:bg-[#111] hover:text-[#e0e0e0]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-black' : 'border border-[#444]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black/20 text-black font-bold' : 'bg-[#1a1a1a] text-[#888] border border-[#222]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#1a1a1a] space-y-3">
          <div className="bg-[#111] p-3 rounded-lg border border-[#222]">
            <p className="text-[9px] text-[#666] uppercase tracking-wider font-mono">Aktif Profil</p>
            <p className="text-xs text-[#c4a47c] font-medium truncate mt-0.5">
              {activeClientName || 'Hazır Tasarım'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBackup}
            className="w-full py-2 px-3 rounded-lg bg-[#0d0d0d] hover:bg-[#151515] border border-[#222] hover:border-[#333] text-[11px] text-[#999] hover:text-[#e0e0e0] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Database className="w-3 h-3 text-[#c4a47c]" />
            <span>Veri Yedekleme & Aktar</span>
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Top Header (< lg) */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a] px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div 
            onClick={() => setActiveTab('new_design')} 
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded bg-[#c4a47c]/20 border border-[#c4a47c]/50 flex items-center justify-center text-[#c4a47c]">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <h1 className="font-serif tracking-widest text-sm font-bold text-[#c4a47c] uppercase">
                InkScribe
              </h1>
              <p className="text-[9px] text-[#666] tracking-wider uppercase font-mono">
                Tattoo Alchemy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartNewClient ? onStartNewClient() : setActiveTab('new_design')}
              title="Yeni Danışan & Temiz Tasarım"
              className="px-2.5 py-1.5 rounded-lg bg-[#1a1813] border border-[#c4a47c]/40 text-[#c4a47c] hover:text-white text-xs flex items-center gap-1.5 transition-all font-mono"
            >
              <Sparkles className="w-3 h-3 text-[#c4a47c]" />
              <span className="text-[11px] font-bold">+ Yeni</span>
            </button>
            <button
              onClick={onOpenBackup}
              title="Yedekleme & Dışa Aktar"
              className="px-2.5 py-1.5 rounded-lg bg-[#111] border border-[#222] text-[#999] hover:text-[#e0e0e0] text-xs flex items-center gap-1.5 transition-all"
            >
              <Database className="w-3 h-3 text-[#c4a47c]" />
              <span className="hidden sm:inline text-[11px]">Yedek</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (< lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080808]/95 backdrop-blur-lg border-t border-[#1a1a1a] px-2 py-1.5 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all relative ${
                  isActive
                    ? 'bg-[#c4a47c] text-black font-semibold'
                    : 'text-[#888] hover:text-[#e0e0e0] hover:bg-[#111]'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] tracking-tight uppercase line-clamp-1">{item.label.split(' ')[0]}</span>
                {item.badge !== null && (
                  <span
                    className={`absolute top-0.5 right-1.5 w-3.5 h-3.5 rounded-full text-[8px] font-mono flex items-center justify-center ${
                      isActive ? 'bg-black text-[#c4a47c]' : 'bg-[#222] text-[#c4a47c] border border-[#333]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

