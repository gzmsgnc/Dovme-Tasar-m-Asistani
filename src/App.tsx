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
  const [clientQuizName, setClientQuizName] = useState<string>(() => {
    if (typeof window !== 'undefined') return new URLSearchParams(window.location.search).get('client') || 'Değerli Danışanımız';
    return 'Değerli Danışanımız';
  });

  const loadData = () => {
    setClients(getStoredClients());
    setRecipes(getStoredRecipes());
  };
  useEffect(() => { loadData(); }, []);

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
