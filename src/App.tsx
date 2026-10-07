import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Navigation, ActiveTab } from './components/Navigation';
import { NewDesignWizard } from './components/wizard/NewDesignWizard';
import { BackupModal } from './components/common/BackupModal';
import { ClientEnneagramQuizView } from './components/common/ClientEnneagramQuizView';
import { ClientIntakeFormView } from './components/common/ClientIntakeFormView';
import { PersonData, TattooRecipe } from './types';
import { getStoredClients, saveClient, deleteClient, getStoredRecipes, saveRecipe, deleteRecipe, clearAllData } from './utils/storage';

const ClientsView = lazy(() => import('./components/clients/ClientsView').then(m => ({ default: m.ClientsView })));
const ArchiveView = lazy(() => import('./components/archive/ArchiveView').then(m => ({ default: m.ArchiveView })));
const SymbolLibraryView = lazy(() => import('./components/symbols/SymbolLibraryView').then(m => ({ default: m.SymbolLibraryView })));
const StyleLibraryView = lazy(() => import('./components/styles/StyleLibraryView').then(m => ({ default: m.StyleLibraryView })));

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('new_design');
  const [clients, setClients] = useState<PersonData[]>([]);
  const [recipes, setRecipes] = useState<TattooRecipe[]>([]);
  const [selectedPersonForDesign, setSelectedPersonForDesign] = useState<PersonData | null>(null);
  const [preselectedSymbol, setPreselectedSymbol] = useState<string | null>(null);
  const [preselectedStyle, setPreselectedStyle] = useState<string | null>(null);
  const [wizardSessionId, setWizardSessionId] = useState<number>(Date.now());
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isClientQuizMode, setIsClientQuizMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'enneagram-quiz' || params.get('mode') === 'enneagram-test';
    }
    return false;
  });
  const [isClientFormMode, setIsClientFormMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const mode = new URLSearchParams(window.location.search).get('mode');
      return mode === 'client-form' || mode === 'danisan-formu' || mode === 'client' || mode === 'form';
    }
    return false;
  });
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean | null>(null);
  const [adminConfigured, setAdminConfigured] = useState<boolean>(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginBusy, setAdminLoginBusy] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'email' | 'code'>('email');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryBusy, setRecoveryBusy] = useState(false);

  const [clientQuizName, setClientQuizName] = useState<string>(() => {
    if (typeof window !== 'undefined') return new URLSearchParams(window.location.search).get('client') || 'Değerli Danışanımız';
    return 'Değerli Danışanımız';
  });

  const loadData = () => {
    setClients(getStoredClients());
    setRecipes(getStoredRecipes());
  };
  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (isClientQuizMode || isClientFormMode) return;
    fetch('/api/auth/session')
      .then(async res => {
        const data = await res.json();
        setAdminAuthenticated(Boolean(data.authenticated));
        setAdminConfigured(Boolean(data.configured));
      })
      .catch(() => {
        setAdminAuthenticated(false);
        setAdminConfigured(false);
      });
  }, [isClientQuizMode, isClientFormMode]);

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAdminLoginBusy(true);
    setAdminLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAdminLoginError(data.error || 'Yönetici girişi başarısız.');
        return;
      }
      setAdminPassword('');
      setAdminAuthenticated(true);
      loadData();
    } catch {
      setAdminLoginError('Sunucuya bağlanılamadı.');
    } finally {
      setAdminLoginBusy(false);
    }
  };

  const handleRequestPasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setRecoveryBusy(true);
    setRecoveryMessage('');
    setRecoveryError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim().toLowerCase() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRecoveryError(data.detail ? `${data.error || 'Kurtarma kodu gönderilemedi.'} (${data.detail})` : (data.error || 'Kurtarma kodu gönderilemedi.'));
        return;
      }
      setRecoveryMessage(data.message || 'Doğrulama kodu e-posta adresinize gönderildi.');
      setRecoveryStep('code');
    } catch {
      setRecoveryError('Sunucuya bağlanılamadı. Lütfen ağ bağlantınızı kontrol edin.');
    } finally {
      setRecoveryBusy(false);
    }
  };

  const handleResetAdminPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setRecoveryBusy(true);
    setRecoveryMessage('');
    setRecoveryError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recoveryEmail.trim().toLowerCase(),
          code: recoveryCode.trim(),
          newPassword: newAdminPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRecoveryError(data.error || 'Şifre yenilenemedi.');
        return;
      }
      setRecoveryMessage(data.message || 'Şifreniz yenilendi. Yeni şifrenizle giriş yapabilirsiniz.');
      setShowPasswordRecovery(false);
      setRecoveryStep('email');
      setRecoveryEmail('');
      setRecoveryCode('');
      setNewAdminPassword('');
      setAdminPassword('');
      setAdminLoginError('');
    } catch {
      setRecoveryError('Sunucuya bağlanılamadı.');
    } finally {
      setRecoveryBusy(false);
    }
  };

  const handleSaveClient = (client: PersonData) => {
    setClients(saveClient(client));
    setSelectedPersonForDesign(client);
  };
  const handleDeleteClient = (id: string) => {
    setClients(deleteClient(id));
    if (selectedPersonForDesign?.id === id) setSelectedPersonForDesign(null);
  };
  const handleSaveRecipe = (recipe: TattooRecipe) => setRecipes(saveRecipe(recipe));
  const handleDeleteRecipe = (id: string) => setRecipes(deleteRecipe(id));
  const handleClearAllData = () => {
    clearAllData();
    setClients([]);
    setRecipes([]);
    setSelectedPersonForDesign(null);
  };
  const handleStartDesignForClient = (client: PersonData) => {
    setSelectedPersonForDesign(client);
    setWizardSessionId(Date.now());
    setActiveTab('new_design');
  };
  const handleAddNewClientClick = () => {
    setSelectedPersonForDesign(null);
    setPreselectedSymbol(null);
    setPreselectedStyle(null);
    setWizardSessionId(Date.now());
    setActiveTab('new_design');
  };

  if (isClientQuizMode) {
    return <ClientEnneagramQuizView clientName={clientQuizName} onReturnToStudio={() => {
      setIsClientQuizMode(false);
      if (typeof window !== 'undefined') window.history.replaceState({}, '', window.location.pathname);
    }} />;
  }
  if (isClientFormMode) {
    return <ClientIntakeFormView onReturnToStudio={() => {
      setIsClientFormMode(false);
      loadData();
      if (typeof window !== 'undefined') window.history.replaceState({}, '', window.location.pathname);
    }} onFormSubmitted={loadData} />;
  }


  if (adminAuthenticated === null) {
    return <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex items-center justify-center">Oturum kontrol ediliyor…</div>;
  }

  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex items-center justify-center p-6">
        {!showPasswordRecovery ? (
          <form onSubmit={handleAdminLogin} className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#0b0b0b] p-8 shadow-2xl">
            <h1 className="text-2xl font-semibold text-[#c4a47c]">Stüdyo Yönetici Girişi</h1>
            <p className="mt-2 text-sm text-[#999]">Danışan kayıtları ve tasarım arşivi yalnızca yetkili stüdyo oturumunda kullanılabilir.</p>
            {!adminConfigured && <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-300">Sunucuda yönetici erişimi yapılandırılmamış.</p>}
            {adminConfigured && (
              <>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Yönetici şifresi"
                  className="mt-6 w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#c4a47c]"
                  minLength={12}
                  required
                />
                {adminLoginError && <p className="mt-3 text-sm text-red-300">{adminLoginError}</p>}
                <button type="submit" disabled={adminLoginBusy} className="mt-5 w-full rounded-lg bg-[#c4a47c] px-4 py-3 font-semibold text-black disabled:opacity-50">
                  {adminLoginBusy ? 'Giriş yapılıyor…' : 'Stüdyoya Gir'}
                </button>
                <button type="button" onClick={() => { setShowPasswordRecovery(true); setRecoveryMessage(''); setRecoveryError(''); }} className="mt-4 w-full text-sm text-[#c4a47c] hover:underline">
                  Şifremi Unuttum
                </button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={recoveryStep === 'email' ? handleRequestPasswordReset : handleResetAdminPassword} className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#0b0b0b] p-8 shadow-2xl">
            <h1 className="text-2xl font-semibold text-[#c4a47c]">Yönetici Şifre Kurtarma</h1>
            <p className="mt-2 text-sm text-[#999]">Kayıtlı kurtarma e-posta adresinle doğrulama kodu al ve yeni şifreni belirle.</p>

            {recoveryStep === 'email' ? (
              <>
                <input
                  type="email"
                  autoComplete="email"
                  value={recoveryEmail}
                  onChange={e => { setRecoveryEmail(e.target.value); setRecoveryError(''); }}
                  placeholder="Kurtarma e-posta adresi (örn. gzm.s.gnc@gmail.com)"
                  className="mt-6 w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#c4a47c]"
                  required
                />
                <button type="submit" disabled={recoveryBusy} className="mt-5 w-full rounded-lg bg-[#c4a47c] px-4 py-3 font-semibold text-black disabled:opacity-50">
                  {recoveryBusy ? 'Kod gönderiliyor…' : 'Doğrulama Kodu Gönder'}
                </button>
              </>
            ) : (
              <>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={recoveryCode}
                  onChange={e => { setRecoveryCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setRecoveryError(''); }}
                  placeholder="6 haneli doğrulama kodu"
                  className="mt-6 w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#c4a47c]"
                  maxLength={6}
                  required
                />
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newAdminPassword}
                  onChange={e => { setNewAdminPassword(e.target.value); setRecoveryError(''); }}
                  placeholder="Yeni yönetici şifresi (en az 12 karakter)"
                  className="mt-4 w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#c4a47c]"
                  minLength={12}
                  required
                />
                <button type="submit" disabled={recoveryBusy} className="mt-5 w-full rounded-lg bg-[#c4a47c] px-4 py-3 font-semibold text-black disabled:opacity-50">
                  {recoveryBusy ? 'Şifre yenileniyor…' : 'Şifreyi Yenile'}
                </button>
                <button type="button" onClick={() => { setRecoveryStep('email'); setRecoveryError(''); }} className="mt-3 w-full text-sm text-[#999] hover:text-[#c4a47c]">
                  Yeni kod iste
                </button>
              </>
            )}
            {recoveryError && (
              <div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/40 p-3 text-sm text-red-300">
                {recoveryError}
              </div>
            )}
            {recoveryMessage && (
              <div className="mt-4 rounded-lg border border-[#c4a47c]/40 bg-[#c4a47c]/10 p-3 text-sm text-[#c4a47c]">
                {recoveryMessage}
              </div>
            )}
            <button type="button" onClick={() => { setShowPasswordRecovery(false); setRecoveryStep('email'); setRecoveryMessage(''); setRecoveryError(''); }} className="mt-5 w-full text-sm text-[#999] hover:text-white">
              Giriş ekranına dön
            </button>
          </form>
        )}
      </div>
    );
  }

  const lazyFallback = <div className="min-h-[40vh] flex items-center justify-center text-[#c4a47c]">Yükleniyor…</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#c4a47c]/30 selection:text-[#c4a47c] flex flex-col lg:flex-row">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} clientsCount={clients.length} recipesCount={recipes.length} onOpenBackup={() => setIsBackupModalOpen(true)} activeClientName={selectedPersonForDesign?.name || 'Yeni Danışan'} onStartNewClient={handleAddNewClientClick} />
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] min-h-screen">
        <main className="flex-1 transition-opacity duration-200">
          <Suspense fallback={lazyFallback}>
            {activeTab === 'new_design' && <NewDesignWizard key={wizardSessionId} initialPerson={selectedPersonForDesign} savedClients={clients} onSaveRecipe={handleSaveRecipe} onSaveClient={handleSaveClient} onSelectClient={setSelectedPersonForDesign} onViewArchive={() => setActiveTab('archive')} onNavigateToClients={() => setActiveTab('clients')} onStartNewClient={handleAddNewClientClick} initialMainSymbol={preselectedSymbol} initialSelectedStyle={preselectedStyle} />}
            {activeTab === 'clients' && <ClientsView clients={clients} onStartDesignForClient={handleStartDesignForClient} onDeleteClient={handleDeleteClient} onAddNewClientClick={handleAddNewClientClick} onSaveClient={handleSaveClient} onClearAllClients={handleClearAllData} onOpenClientForm={() => setIsClientFormMode(true)} onClientsSynced={setClients} />}
            {activeTab === 'archive' && <ArchiveView recipes={recipes} onDeleteRecipe={handleDeleteRecipe} onStartNewDesign={() => { setSelectedPersonForDesign(null); setPreselectedSymbol(null); setPreselectedStyle(null); setWizardSessionId(Date.now()); setActiveTab('new_design'); }} />}
            {activeTab === 'symbols' && <SymbolLibraryView onSelectSymbolForDesign={(symbolName) => { setPreselectedSymbol(symbolName); setActiveTab('new_design'); }} />}
            {activeTab === 'styles' && <StyleLibraryView onSelectStyleForDesign={(styleName) => { setPreselectedStyle(styleName); setActiveTab('new_design'); }} />}
          </Suspense>
        </main>
      </div>
      <BackupModal isOpen={isBackupModalOpen} onClose={() => setIsBackupModalOpen(false)} onDataRestored={loadData} />
    </div>
  );
}

export default App;
