import { PersonData, TattooRecipe } from '../types';

const CLIENTS_STORAGE_KEY = 'tattoo_assistant_clients_v2';
const RECIPES_STORAGE_KEY = 'tattoo_assistant_recipes_v2';
const LEGACY_CLIENTS_KEY = 'tattoo_assistant_clients_v1';
const LEGACY_RECIPES_KEY = 'tattoo_assistant_recipes_v1';
const DELETED_CLIENTS_STORAGE_KEY = 'tattoo_assistant_deleted_clients_v1';

const DEMO_ACCOUNT_IDS = new Set([
  'client_selin_kaya',
  'client_emir_arslan',
  'client_derya_yilmaz'
]);

function isDemoClient(client: any): boolean {
  if (!client || typeof client !== 'object') return true;
  if (client.id && DEMO_ACCOUNT_IDS.has(client.id)) return true;
  const name = String(client.name || '').trim().toLocaleLowerCase('tr-TR');
  const email = String(client.email || '').trim().toLocaleLowerCase('tr-TR');
  const source = String(client.source || '').trim().toLocaleLowerCase('tr-TR');
  const status = String(client.status || '').trim().toLocaleLowerCase('tr-TR');
  const demoNamePatterns = ['selin kaya', 'emir arslan', 'derya yılmaz', 'demo', 'test danışan', 'test musteri', 'test müşteri'];
  return demoNamePatterns.some(pattern => name === pattern || name.includes(pattern)) || email.includes('demo@') || email.includes('test@') || source === 'demo' || source === 'test' || status === 'demo';
}

function isValidImportedClient(client: any): client is PersonData {
  return Boolean(client && typeof client === 'object' && typeof client.id === 'string' && client.id.trim().length > 0 && typeof client.name === 'string' && client.name.trim().length > 0 && !isDemoClient(client));
}

function isValidImportedRecipe(recipe: any, clientsById: Map<string, PersonData>): recipe is TattooRecipe {
  if (!recipe || typeof recipe !== 'object' || typeof recipe.id !== 'string' || recipe.id.trim().length === 0) return false;
  if (typeof recipe.clientId !== 'string' || recipe.clientId.trim().length === 0) return false;
  if (typeof recipe.title !== 'string' || recipe.title.trim().length === 0) return false;
  if (DEMO_ACCOUNT_IDS.has(recipe.clientId)) return false;
  const owner = clientsById.get(recipe.clientId);
  if (!owner || isDemoClient(owner)) return false;
  if (typeof recipe.clientName === 'string' && recipe.clientName.trim().length > 0 && recipe.clientName !== owner.name) return false;
  if (recipe.personData?.id && recipe.personData.id !== owner.id) return false;
  if (recipe.personData?.name && recipe.personData.name !== owner.name) return false;
  return true;
}

export function getStoredClients(): PersonData[] {
  try {
    let raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_CLIENTS_KEY);
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          if (Array.isArray(parsed)) {
            const realOnly = parsed.filter(c => c && c.id && !isDemoClient(c));
            localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(realOnly));
            return realOnly;
          }
        } catch {}
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const realClients = parsed.filter(c => c && c.id && !isDemoClient(c));
    if (realClients.length !== parsed.length) localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(realClients));
    return realClients;
  } catch { return []; }
}

export function saveClient(client: PersonData): PersonData[] {
  const clients = getStoredClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);
  let updated: PersonData[];
  if (existingIndex >= 0) {
    updated = [...clients];
    updated[existingIndex] = { ...client, updatedAt: new Date().toISOString() };
  } else {
    const newClient: PersonData = { ...client, id: client.id || `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, createdAt: client.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
    updated = [newClient, ...clients];
  }
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function postClientIntakeToServer(payload: any): Promise<{ success: boolean; clientId?: string; error?: string }> {
  try {
    const res = await fetch('/api/client-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, error: data.error || 'Sunucu form kaydını kabul etmedi.' };
    if (typeof data.clientId !== 'string' || data.clientId.trim().length === 0) {
      return { success: false, error: 'Sunucu kaydı oluşturdu ancak danışan kimliği dönmedi.' };
    }
    return { success: true, clientId: data.clientId };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Sunucu bağlantı hatası oluştu.' };
  }
}

export async function syncClientsWithServer(): Promise<PersonData[]> {
  try {
    const localClients = getStoredClients();
    const deletedClientIds = getDeletedClientIds();
    const deleted = new Set(deletedClientIds);
    const res = await fetch('/api/clients/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ localClients, deletedClientIds }) });
    if (!res.ok) {
      const getRes = await fetch('/api/clients');
      if (getRes.ok) {
        const getData = await getRes.json();
        if (getData.clients && Array.isArray(getData.clients)) {
          const merged = mergeClientLists(localClients, getData.clients, deletedClientIds);
          localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
      return localClients;
    }
    const data = await res.json();
    if (data.success && Array.isArray(data.clients)) {
      const returnedIds = new Set(data.clients.filter((c: any) => c && typeof c.id === 'string').map((c: any) => c.id));
      const sanitized = data.clients.filter((c: any) => c && c.id && c.name && !isDemoClient(c) && !deleted.has(c.id));
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(sanitized));
      const unresolvedDeletedIds = deletedClientIds.filter(id => returnedIds.has(id));
      if (unresolvedDeletedIds.length === 0) clearDeletedClientIds(deletedClientIds);
      else localStorage.setItem(DELETED_CLIENTS_STORAGE_KEY, JSON.stringify(unresolvedDeletedIds));
      return sanitized;
    }
    return localClients;
  } catch (err) {
    console.warn('Server sync error, using local data:', err);
    return getStoredClients();
  }
}

function getDeletedClientIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_CLIENTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string' && id.trim().length > 0) : [];
  } catch { return []; }
}

function clearDeletedClientIds(ids: string[]): void { if (ids.length > 0) localStorage.removeItem(DELETED_CLIENTS_STORAGE_KEY); }

function mergeClientLists(listA: PersonData[], listB: PersonData[], deletedIds: string[] = []): PersonData[] {
  const deleted = new Set(deletedIds);
  const map = new Map<string, PersonData>();
  listA.forEach(c => { if (c && c.id && !isDemoClient(c) && !deleted.has(c.id)) map.set(c.id, c); });
  listB.forEach(c => {
    if (c && c.id && !isDemoClient(c) && !deleted.has(c.id)) {
      if (!map.has(c.id)) map.set(c.id, c);
      else {
        const existing = map.get(c.id)!;
        const timeExisting = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
        const timeNew = new Date(c.updatedAt || c.createdAt || 0).getTime();
        if (timeNew > timeExisting) map.set(c.id, c);
      }
    }
  });
  return Array.from(map.values()).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export function deleteClient(id: string): PersonData[] {
  const clients = getStoredClients().filter(c => c.id !== id);
  const deletedIds = getDeletedClientIds();
  if (!deletedIds.includes(id)) deletedIds.push(id);
  localStorage.setItem(DELETED_CLIENTS_STORAGE_KEY, JSON.stringify(deletedIds));
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  try { fetch(`/api/clients/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {}); } catch {}
  try { localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(getStoredRecipes().filter(r => r.clientId !== id))); } catch {}
  return clients;
}

export function getStoredRecipes(): TattooRecipe[] {
  try {
    let raw = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_RECIPES_KEY);
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          if (Array.isArray(parsed)) {
            const realOnly = parsed.filter(r => r && r.clientId && !DEMO_ACCOUNT_IDS.has(r.clientId) && !isDemoClient({ id: r.clientId, name: r.clientName }));
            localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(realOnly));
            return realOnly;
          }
        } catch {}
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const realRecipes = parsed.filter(r => r && r.clientId && !DEMO_ACCOUNT_IDS.has(r.clientId) && !isDemoClient({ id: r.clientId, name: r.clientName }));
    if (realRecipes.length !== parsed.length) localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(realRecipes));
    return realRecipes;
  } catch { return []; }
}

export function saveRecipe(recipe: TattooRecipe): TattooRecipe[] {
  const owner = getStoredClients().find(client => client.id === recipe.clientId);
  if (!owner) {
    throw new Error('Reçete kaydedilemedi: bağlı danışan kaydı bulunamadı.');
  }
  if (recipe.clientName && recipe.clientName !== owner.name) {
    throw new Error('Reçete kaydedilemedi: danışan adı ile bağlı kayıt eşleşmiyor.');
  }

  const recipes = getStoredRecipes();
  const existingIndex = recipes.findIndex(r => r.id === recipe.id);
  const updated = existingIndex >= 0 ? [...recipes] : [recipe, ...recipes];
  if (existingIndex >= 0) updated[existingIndex] = recipe;
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteRecipe(id: string): TattooRecipe[] {
  const recipes = getStoredRecipes().filter(r => r.id !== id);
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
  return recipes;
}

export function exportAllDataAsJSON(): string {
  return JSON.stringify({ clients: getStoredClients(), recipes: getStoredRecipes(), exportDate: new Date().toISOString(), version: '2.0' }, null, 2);
}

export function importDataFromJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { success: false, message: 'Geçersiz yedek dosyası: kök veri bir nesne olmalı.' };
    if (!Array.isArray(parsed.clients) || !Array.isArray(parsed.recipes)) return { success: false, message: 'Geçersiz yedek dosyası: clients ve recipes dizileri gerekli.' };
    const clients = parsed.clients.filter(isValidImportedClient);
    const clientsById = new Map<string, PersonData>(clients.map((client: PersonData) => [client.id, client]));
    const recipes = parsed.recipes.filter((recipe: any) => isValidImportedRecipe(recipe, clientsById));
    if (parsed.clients.length > 0 && clients.length === 0) return { success: false, message: 'İçe aktarılacak geçerli danışan bulunamadı.' };
    const duplicateClientIds = clients.map(c => c.id).filter((id, index, ids) => ids.indexOf(id) !== index);
    const duplicateRecipeIds = recipes.map(r => r.id).filter((id, index, ids) => ids.indexOf(id) !== index);
    if (duplicateClientIds.length > 0 || duplicateRecipeIds.length > 0) return { success: false, message: 'Yedek dosyasında yinelenen kayıt kimlikleri bulundu.' };
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
    const restoredIds = new Set<string>(clients.map((client: PersonData) => client.id));
    const remainingDeletedIds = getDeletedClientIds().filter(id => !restoredIds.has(id));
    if (remainingDeletedIds.length > 0) localStorage.setItem(DELETED_CLIENTS_STORAGE_KEY, JSON.stringify(remainingDeletedIds));
    else localStorage.removeItem(DELETED_CLIENTS_STORAGE_KEY);
    return { success: true, message: `${clients.length} danışan ve ${recipes.length} reçete başarıyla içe aktarıldı.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Geçersiz JSON formatı';
    return { success: false, message: `İçe aktarma hatası: ${msg}` };
  }
}

export function clearAllData(): void {
  localStorage.removeItem(CLIENTS_STORAGE_KEY);
  localStorage.removeItem(RECIPES_STORAGE_KEY);
  localStorage.removeItem(LEGACY_CLIENTS_KEY);
  localStorage.removeItem(LEGACY_RECIPES_KEY);
  localStorage.removeItem(DELETED_CLIENTS_STORAGE_KEY);
}
