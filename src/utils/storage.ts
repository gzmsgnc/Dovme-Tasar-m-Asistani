import { PersonData, TattooRecipe } from '../types';

const CLIENTS_STORAGE_KEY = 'tattoo_assistant_clients_v2';
const RECIPES_STORAGE_KEY = 'tattoo_assistant_recipes_v2';
const LEGACY_CLIENTS_KEY = 'tattoo_assistant_clients_v1';
const LEGACY_RECIPES_KEY = 'tattoo_assistant_recipes_v1';

// Known hardcoded demo accounts to purge from real user lists
const DEMO_ACCOUNT_IDS = new Set([
  'client_selin_kaya',
  'client_emir_arslan',
  'client_derya_yilmaz'
]);

/**
 * Retrieves all stored real clients.
 * Guarantees zero demo or fake accounts in user view.
 * If empty, returns an empty array [].
 */
export function getStoredClients(): PersonData[] {
  try {
    // Check v2 first
    let raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    
    // If not found in v2, check legacy v1 and migrate only REAL non-demo clients
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_CLIENTS_KEY);
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          if (Array.isArray(parsed)) {
            const realOnly = parsed.filter(c => c && c.id && !DEMO_ACCOUNT_IDS.has(c.id));
            localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(realOnly));
            return realOnly;
          }
        } catch {
          // ignore error
        }
      }
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out any demo accounts that might have been saved
    const realClients = parsed.filter(c => c && c.id && !DEMO_ACCOUNT_IDS.has(c.id));
    if (realClients.length !== parsed.length) {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(realClients));
    }
    return realClients;
  } catch {
    return [];
  }
}

/**
 * Saves or updates a client record with strict data isolation and timestamps.
 */
export function saveClient(client: PersonData): PersonData[] {
  const clients = getStoredClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);
  
  let updated: PersonData[];
  if (existingIndex >= 0) {
    updated = [...clients];
    updated[existingIndex] = { 
      ...client, 
      updatedAt: new Date().toISOString() 
    };
  } else {
    const newClient: PersonData = {
      ...client,
      id: client.id || `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: client.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    updated = [newClient, ...clients];
  }
  
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Deletes a client and removes any associated orphaned recipes.
 */
export function deleteClient(id: string): PersonData[] {
  const clients = getStoredClients().filter(c => c.id !== id);
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  
  // Clean up associated recipes
  try {
    const recipes = getStoredRecipes().filter(r => r.clientId !== id);
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
  } catch {
    // ignore
  }

  return clients;
}

/**
 * Retrieves stored recipes for real clients.
 */
export function getStoredRecipes(): TattooRecipe[] {
  try {
    let raw = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_RECIPES_KEY);
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          if (Array.isArray(parsed)) {
            const realOnly = parsed.filter(r => r && r.clientId && !DEMO_ACCOUNT_IDS.has(r.clientId));
            localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(realOnly));
            return realOnly;
          }
        } catch {
          // ignore
        }
      }
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const realRecipes = parsed.filter(r => r && r.clientId && !DEMO_ACCOUNT_IDS.has(r.clientId));
    return realRecipes;
  } catch {
    return [];
  }
}

/**
 * Saves a recipe.
 */
export function saveRecipe(recipe: TattooRecipe): TattooRecipe[] {
  const recipes = getStoredRecipes();
  const existingIndex = recipes.findIndex(r => r.id === recipe.id);
  
  let updated: TattooRecipe[];
  if (existingIndex >= 0) {
    updated = [...recipes];
    updated[existingIndex] = recipe;
  } else {
    updated = [recipe, ...recipes];
  }
  
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Deletes a recipe by ID.
 */
export function deleteRecipe(id: string): TattooRecipe[] {
  const recipes = getStoredRecipes().filter(r => r.id !== id);
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
  return recipes;
}

/**
 * Exports all real clients and recipes to JSON.
 */
export function exportAllDataAsJSON(): string {
  const payload = {
    clients: getStoredClients(),
    recipes: getStoredRecipes(),
    exportDate: new Date().toISOString(),
    version: '2.0'
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Imports client & recipe data from JSON with safety checks.
 */
export function importDataFromJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.clients && Array.isArray(parsed.clients)) {
      const sanitized = parsed.clients.filter((c: any) => c && c.name && !DEMO_ACCOUNT_IDS.has(c.id));
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(sanitized));
    }
    if (parsed.recipes && Array.isArray(parsed.recipes)) {
      const sanitized = parsed.recipes.filter((r: any) => r && r.title && !DEMO_ACCOUNT_IDS.has(r.clientId));
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(sanitized));
    }
    return { success: true, message: 'Veriler başarıyla içe aktarıldı!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Geçersiz JSON formatı';
    return { success: false, message: `İçe aktarma hatası: ${msg}` };
  }
}
