const DB_NAME = 'sono-sem-choro-audio';
const DB_VERSION = 1;
const STORE_NAME = 'custom_audio';
const AUDIO_KEY = 'user_guide_audio';

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => resolve(null);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveCustomAudio(blob: Blob): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(blob, AUDIO_KEY);

    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
  });
}

export async function getCustomAudio(): Promise<Blob | null> {
  const db = await openDB();
  if (!db) return null;

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(AUDIO_KEY);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
}

export async function deleteCustomAudio(): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(AUDIO_KEY);

    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
  });
}
