import type { OnboardingData, WakeupEntry, AppState } from './types';

const DB_NAME = 'sono-sem-choro';
const DB_VERSION = 1;
const STORES = {
  ONBOARDING: 'onboarding',
  WAKEUPS: 'wakeups',
  STATE: 'state',
};

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => resolve(null);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.ONBOARDING)) {
        db.createObjectStore(STORES.ONBOARDING, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.WAKEUPS)) {
        const store = db.createObjectStore(STORES.WAKEUPS, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('day', 'day', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.STATE)) {
        db.createObjectStore(STORES.STATE, { keyPath: 'key' });
      }
    };
  });
}

export async function saveOnboarding(data: OnboardingData): Promise<void> {
  const db = await openDB();
  if (db) {
    const tx = db.transaction(STORES.ONBOARDING, 'readwrite');
    tx.objectStore(STORES.ONBOARDING).put({ id: 'user', ...data });
  }
  localStorage.setItem('onboarding', JSON.stringify(data));
}

export async function getOnboarding(): Promise<OnboardingData | null> {
  const db = await openDB();
  if (db) {
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.ONBOARDING, 'readonly');
      const request = tx.objectStore(STORES.ONBOARDING).get('user');
      request.onsuccess = () => {
        if (request.result) {
          const { id, ...data } = request.result;
          resolve(data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }
  const local = localStorage.getItem('onboarding');
  return local ? JSON.parse(local) : null;
}

export async function saveWakeup(wakeup: WakeupEntry): Promise<void> {
  const db = await openDB();
  if (db) {
    const tx = db.transaction(STORES.WAKEUPS, 'readwrite');
    tx.objectStore(STORES.WAKEUPS).put(wakeup);
  }
  const existing = JSON.parse(localStorage.getItem('wakeups') || '[]');
  existing.push(wakeup);
  localStorage.setItem('wakeups', JSON.stringify(existing));
}

export async function getWakeups(): Promise<WakeupEntry[]> {
  const db = await openDB();
  if (db) {
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.WAKEUPS, 'readonly');
      const request = tx.objectStore(STORES.WAKEUPS).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }
  return JSON.parse(localStorage.getItem('wakeups') || '[]');
}

export async function saveState(state: Partial<AppState>): Promise<void> {
  const db = await openDB();
  if (db) {
    const tx = db.transaction(STORES.STATE, 'readwrite');
    const store = tx.objectStore(STORES.STATE);
    Object.entries(state).forEach(([key, value]) => {
      store.put({ key, value });
    });
  }
  Object.entries(state).forEach(([key, value]) => {
    localStorage.setItem(`state_${key}`, JSON.stringify(value));
  });
}

export async function getState(): Promise<Partial<AppState>> {
  const state: Partial<AppState> = {};

  const currentDay = localStorage.getItem('state_currentDay');
  const ritualCompletedToday = localStorage.getItem('state_ritualCompletedToday');
  const lastRitualDate = localStorage.getItem('state_lastRitualDate');
  const planoManutencao = localStorage.getItem('state_planoManutencao');

  state.currentDay = currentDay ? JSON.parse(currentDay) : 1;
  state.ritualCompletedToday = ritualCompletedToday ? JSON.parse(ritualCompletedToday) : false;
  state.lastRitualDate = lastRitualDate || null;
  state.planoManutencao = planoManutencao ? JSON.parse(planoManutencao) : false;

  if (new URLSearchParams(window.location.search).get('manutencao') === 'ativo') {
    localStorage.setItem('state_planoManutencao', 'true');
    state.planoManutencao = true;
  }

  return state;
}

export function getCurrentDay(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7;
}

export function isRitualTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 17 && hour <= 21;
}
