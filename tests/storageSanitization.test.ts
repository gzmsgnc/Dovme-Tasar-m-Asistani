import assert from 'node:assert/strict';

const source = await import('../src/utils/storage');

const original = globalThis.localStorage;
class MemoryStorage {
  private data = new Map<string,string>();
  getItem(key:string){ return this.data.get(key) ?? null; }
  setItem(key:string,value:string){ this.data.set(key,value); }
  removeItem(key:string){ this.data.delete(key); }
  clear(){ this.data.clear(); }
}
(globalThis as any).localStorage = new MemoryStorage();

localStorage.setItem('tattoo_assistant_clients_v2', JSON.stringify([
  { id:'real_1', name:'Gerçek Danışan' },
  { id:'demo_1', name:'Demo Danışan' },
  { id:'client_selin_kaya', name:'Selin Kaya' }
]));
assert.deepEqual(source.getStoredClients().map(c => c.id), ['real_1']);

localStorage.setItem('tattoo_assistant_recipes_v2', JSON.stringify([
  { id:'recipe_real', clientId:'real_1', clientName:'Gerçek Danışan', title:'Gerçek Reçete' },
  { id:'recipe_demo', clientId:'demo_1', clientName:'Demo Danışan', title:'Demo Reçete' },
  { id:'recipe_selin', clientId:'client_selin_kaya', clientName:'Selin Kaya', title:'Demo Reçete 2' }
]));
assert.deepEqual(source.getStoredRecipes().map(r => r.id), ['recipe_real']);

(globalThis as any).localStorage = original;
console.log('Storage sanitization tests passed');
