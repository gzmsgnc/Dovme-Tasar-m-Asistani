import assert from 'node:assert/strict';

const source = await import('../src/utils/storage');
const { saveClient, deleteClient, saveRecipe, deleteRecipe, syncClientsWithServer, exportAllDataAsJSON, importDataFromJSON } = source;

const original = globalThis.localStorage;
class MemoryStorage {
  private data = new Map<string,string>();
  getItem(key:string){ return this.data.get(key) ?? null; }
  setItem(key:string,value:string){ this.data.set(key,value); }
  removeItem(key:string){ this.data.delete(key); }
  clear(){ this.data.clear(); }
}
const testStorage = new MemoryStorage();
(globalThis as any).localStorage = testStorage;

localStorage.setItem('tattoo_assistant_clients_v2', JSON.stringify([
  { id:'real_1', name:'Gerçek Danışan' },
  { id:'demo_1', name:'Demo Danışan', source:'demo' },
  { id:'client_real_selin_kaya', name:'Selin Kaya' }
]));
assert.deepEqual(source.getStoredClients().map(c => c.id), ['real_1', 'client_real_selin_kaya']);

localStorage.setItem('tattoo_assistant_recipes_v2', JSON.stringify([
  { id:'recipe_real', clientId:'real_1', clientName:'Gerçek Danışan', title:'Gerçek Reçete' },
  { id:'recipe_demo', clientId:'demo_1', clientName:'Demo Danışan', title:'Demo Reçete' },
  { id:'recipe_selin', clientId:'client_real_selin_kaya', clientName:'Selin Kaya', title:'Demo Reçete 2' }
]));
assert.deepEqual(source.getStoredRecipes().map(r => r.id), ['recipe_real', 'recipe_selin']);

testStorage.clear();
localStorage.setItem('tattoo_assistant_clients_v2', JSON.stringify([{ id: 'owner_1', name: 'Gerçek Sahip' }]));
localStorage.setItem('tattoo_assistant_recipes_v2', JSON.stringify([
  { id: 'owned', clientId: 'owner_1', clientName: 'Gerçek Sahip', title: 'Sahipli Reçete' },
  { id: 'orphan', clientId: 'missing_owner', clientName: 'Gerçek Sahip', title: 'Yetim Reçete' },
  { id: 'wrong_name', clientId: 'owner_1', clientName: 'Başka Kişi', title: 'Yanlış Sahip' }
]));
assert.deepEqual(source.getStoredRecipes().map(r => r.id), ['owned']);
assert.deepEqual(JSON.parse(localStorage.getItem('tattoo_assistant_recipes_v2') || '[]').map((r: any) => r.id), ['owned']);

testStorage.clear();


testStorage.clear();
const clientA: any = { id: 'client_A', name: 'Danışan A', birthDate: '1990-01-01', birthPlace: 'Istanbul', personalStory: 'A hikayesi', existingSymbols: 'A sembolü', updatedAt: '2026-09-30T10:00:00.000Z' };
const clientB: any = { id: 'client_B', name: 'Danışan B', birthDate: '1995-05-05', birthPlace: 'London', personalStory: 'B hikayesi', existingSymbols: 'B sembolü', updatedAt: '2026-09-30T10:01:00.000Z' };
saveClient(clientA); saveClient(clientB);
const isolatedClients = source.getStoredClients();
assert.equal(isolatedClients.length, 2);
assert.equal(isolatedClients.find(c => c.id === 'client_A')?.personalStory, 'A hikayesi');
assert.equal(isolatedClients.find(c => c.id === 'client_B')?.personalStory, 'B hikayesi');
assert.notEqual(isolatedClients.find(c => c.id === 'client_A')?.id, isolatedClients.find(c => c.id === 'client_B')?.id);

saveClient({ ...clientA, personalStory: 'A yeni hikayesi', existingSymbols: 'A yeni sembolü' });
assert.equal(source.getStoredClients().find(c => c.id === 'client_A')?.personalStory, 'A yeni hikayesi');
assert.equal(source.getStoredClients().find(c => c.id === 'client_B')?.personalStory, 'B hikayesi');

const recipeA: any = { id: 'recipe_A', clientId: 'client_A', clientName: 'Danışan A', personData: clientA, title: 'A Reçetesi', parameters: { selectedStyles: [], mainSymbol: '', bodyPlacement: '' } };
const recipeA2: any = { id: 'recipe_A2', clientId: 'client_A', clientName: 'Danışan A', personData: clientA, title: 'A İkinci Reçetesi', parameters: { selectedStyles: [], mainSymbol: '', bodyPlacement: '' } };
const recipeB: any = { id: 'recipe_B', clientId: 'client_B', clientName: 'Danışan B', personData: clientB, title: 'B Reçetesi', parameters: { selectedStyles: [], mainSymbol: '', bodyPlacement: '' } };
saveRecipe(recipeA); saveRecipe(recipeA2); saveRecipe(recipeB);
assert.deepEqual(source.getStoredRecipes().map(r => r.id), ['recipe_B', 'recipe_A2', 'recipe_A']);

assert.throws(
  () => saveRecipe({ ...recipeA, id: 'orphan_recipe', clientId: 'missing_client', clientName: 'Danışan A' }),
  /bağlı danışan kaydı bulunamadı/
);
assert.throws(
  () => saveRecipe({ ...recipeA, id: 'mismatched_recipe', clientId: 'client_A', clientName: 'Danışan B' }),
  /danışan adı ile bağlı kayıt eşleşmiyor/
);
assert.throws(
  () => saveRecipe({ ...recipeA, id: 'wrong_person_data', clientId: 'client_A', clientName: 'Danışan A', personData: clientB }),
  /reçete kişi verisi bağlı danışanla eşleşmiyor/
);
saveRecipe({ ...recipeA, id: 'legacy_recipe_without_person_data', personData: undefined });
assert.equal(source.getStoredRecipes().some(r => r.id === 'legacy_recipe_without_person_data'), true);
assert.equal(source.getStoredRecipes().filter(r => r.clientId === 'client_A').length, 3);
assert.equal(source.getStoredRecipes().filter(r => r.clientId === 'client_B').length, 1);

deleteClient('client_A');
assert.deepEqual(source.getStoredClients().map(c => c.id), ['client_B']);
assert.deepEqual(source.getStoredRecipes().map(r => r.id), ['recipe_B']);

const originalFetch = globalThis.fetch;
(globalThis as any).fetch = async () => ({ ok: true, json: async () => ({ success: true, clients: [clientA, clientB] }) });
await syncClientsWithServer();
assert.deepEqual(source.getStoredClients().map(c => c.id), ['client_B']);
(globalThis as any).fetch = originalFetch;

saveRecipe(recipeB); deleteRecipe('recipe_B');
assert.deepEqual(source.getStoredRecipes().map(r => r.id), []);

// Restoring a valid backup must also clear the restored client's tombstone.
testStorage.clear();
saveClient(clientA);
saveRecipe(recipeA);
deleteClient('client_A');
const backup = JSON.stringify({ clients: [clientA], recipes: [recipeA], version: '2.0' });
const restoreResult = importDataFromJSON(backup);
assert.equal(restoreResult.success, true);
assert.deepEqual(source.getStoredClients().map(c => c.id), ['client_A']);
assert.deepEqual(source.getStoredRecipes().map(r => r.id), ['recipe_A']);
(globalThis as any).fetch = async () => ({ ok: true, json: async () => ({ success: true, clients: [clientA] }) });
await syncClientsWithServer();
assert.deepEqual(source.getStoredClients().map(c => c.id), ['client_A']);
(globalThis as any).fetch = originalFetch;

// Invalid backup must not destroy existing data.
testStorage.clear();
saveClient(clientB);
const beforeInvalidImportClients = source.getStoredClients();
assert.equal(importDataFromJSON(JSON.stringify({ clients: [{ name: 'ID yok' }], recipes: [] })).success, false);
assert.deepEqual(source.getStoredClients(), beforeInvalidImportClients);
assert.equal(importDataFromJSON(JSON.stringify({ clients: [clientB], recipes: [{ id: 'orphan', clientId: 'missing', title: 'Yetim Reçete' }] })).success, true);
assert.deepEqual(source.getStoredRecipes(), []);

(globalThis as any).localStorage = original;
console.log('Storage sanitization tests passed');
