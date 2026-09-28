import React, { useState, useEffect } from 'react';
import { Navigation, ActiveTab } from './components/Navigation';
import { NewDesignWizard } from './components/wizard/NewDesignWizard';
import { ClientsView } from './components/clients/ClientsView';
import { ArchiveView } from './components/archive/ArchiveView';
import { SymbolLibraryView } from './components/symbols/SymbolLibraryView';
import { StyleLibraryView } from './components/styles/StyleLibraryView';
import { BackupModal } from './components/common/BackupModal';
import { ClientEnneagramQuizView } from './components/common/ClientEnneagramQuizView';
import { 
  PersonData, 
  TattooRecipe 
} from './types';
import { 
  getStoredClients, 
  saveClient, 
  deleteClient, 
  getStoredRecipes, 
  saveRecipe, 
  deleteRecipe,
  clearAllData
} from './utils/storage';

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
  const [clientQuizName, setClientQuizName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('client') || 'Değerli Danışanımız';
    }
    return 'Değerli Danışanımız';
  });

  // Load initial data
  const loadData = () => {
    setClients(getStoredClients());
    setRecipes(getStoredRecipes());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for storage updates
  const handleSaveClient = (client: PersonData) => {
    const updated = saveClient(client);
    setClients(updated);
    setSelectedPersonForDesign(client);
  };

  const handleDeleteClient = (id: string) => {
    const updated = deleteClient(id);
    setClients(updated);
    if (selectedPersonForDesign && selectedPersonForDesign.id === id) {
      setSelectedPersonForDesign(null);
    }
  };

  const handleSaveRecipe = (recipe: TattooRecipe) => {
    const updated = saveRecipe(recipe);
    setRecipes(updated);
  };

  const handleDeleteRecipe = (id: string) => {
    const updated = deleteRecipe(id);
    setRecipes(updated);
  };

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
    setWizardSessionId(Date.now());
    setActiveTab('new_design');
  };

  // Dedicated Client Quiz Mode (Opened via shareable URL ?mode=enneagram-quiz)
  if (isClientQuizMode) {
    return (
      <ClientEnneagramQuizView
        clientName={clientQuizName}
        onReturnToStudio={() => {
          setIsClientQuizMode(false);
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#c4a47c]/30 selection:text-[#c4a47c] flex flex-col lg:flex-row">
      {/* Navigation (Sidebar on Desktop, Header + Bottom Nav on Mobile) */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        clientsCount={clients.length}
        recipesCount={recipes.length}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        activeClientName={selectedPersonForDesign?.name || 'Yeni Danışan'}
        onStartNewClient={handleAddNewClientClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] min-h-screen">
        <main className="flex-1 transition-opacity duration-200">
          {activeTab === 'new_design' && (
            <NewDesignWizard
              key={wizardSessionId}
              initialPerson={selectedPersonForDesign}
              savedClients={clients}
              onSaveRecipe={handleSaveRecipe}
              onSaveClient={handleSaveClient}
              onSelectClient={(client) => setSelectedPersonForDesign(client)}
              onViewArchive={() => setActiveTab('archive')}
              onNavigateToClients={() => setActiveTab('clients')}
              onStartNewClient={handleAddNewClientClick}
              initialMainSymbol={preselectedSymbol}
              initialSelectedStyle={preselectedStyle}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView
              clients={clients}
              onStartDesignForClient={handleStartDesignForClient}
              onDeleteClient={handleDeleteClient}
              onAddNewClientClick={handleAddNewClientClick}
              onSaveClient={handleSaveClient}
              onClearAllClients={handleClearAllData}
            />
          )}

          {activeTab === 'archive' && (
            <ArchiveView
              recipes={recipes}
              onDeleteRecipe={handleDeleteRecipe}
              onStartNewDesign={() => {
                setSelectedPersonForDesign(null);
                setPreselectedSymbol(null);
                setPreselectedStyle(null);
                setWizardSessionId(Date.now());
                setActiveTab('new_design');
              }}
            />
          )}

          {activeTab === 'symbols' && (
            <SymbolLibraryView
              onSelectSymbolForDesign={(symbolName) => {
                setPreselectedSymbol(symbolName);
                setActiveTab('new_design');
              }}
            />
          )}

          {activeTab === 'styles' && (
            <StyleLibraryView
              onSelectStyleForDesign={(styleName) => {
                setPreselectedStyle(styleName);
                setActiveTab('new_design');
              }}
            />
          )}
        </main>
      </div>

      {/* Backup / Export / Import Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={loadData}
      />
    </div>
  );
}

export default App;
