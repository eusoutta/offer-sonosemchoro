import { useState, useEffect, useCallback } from 'react';
import type { OnboardingData, WakeupEntry, AppState } from '../lib/types';
import * as storage from '../lib/storage';

export function useAppContext() {
  const [state, setState] = useState<AppState>({
    onboarding: null,
    user: null,
    baby: null,
    currentDay: 1,
    contentProgress: {},
    quebrasDoRitmo: [],
    wakeupHistory: [],
    diaryEntries: [],
    achievements: [],
    videoProgress: {},
    planoManutencao: false,
    ritualCompletedToday: false,
    lastRitualDate: null,
    isAuthenticated: false,
    isLoading: false,
    themePreference: 'auto',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [onboarding, wakeups, savedState] = await Promise.all([
          storage.getOnboarding(),
          storage.getWakeups(),
          storage.getState(),
        ]);

        let currentDay = savedState.currentDay ?? 1;
        if (onboarding?.dayStartedAt) {
          currentDay = storage.getCurrentDay(onboarding.dayStartedAt);
        }

        const today = new Date().toDateString();
        const lastRitualDate = savedState.lastRitualDate
          ? new Date(savedState.lastRitualDate).toDateString()
          : null;

        setState((prev) => ({
          ...prev,
          onboarding: onboarding,
          wakeupHistory: wakeups,
          currentDay: currentDay,
          ritualCompletedToday: lastRitualDate === today,
          lastRitualDate: savedState.lastRitualDate ?? null,
          planoManutencao: savedState.planoManutencao ?? false,
          themePreference: savedState.themePreference ?? 'auto',
          diaryEntries: savedState.diaryEntries || [],
          contentProgress: savedState.contentProgress || {},
          quebrasDoRitmo: savedState.quebrasDoRitmo || [],
        }));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const updateOnboarding = useCallback(async (data: OnboardingData) => {
    const dayStartedAt = new Date().toISOString();
    const updatedData = { ...data, dayStartedAt };
    await storage.saveOnboarding(updatedData);
    setState((prev) => ({
      ...prev,
      onboarding: updatedData,
      currentDay: 1,
    }));
  }, []);

  const addWakeup = useCallback(async (wakeup: WakeupEntry) => {
    await storage.saveWakeup(wakeup);
    setState((prev) => ({
      ...prev,
      wakeupHistory: [...prev.wakeupHistory, wakeup],
    }));
  }, []);

  const updateDay = useCallback(async (day: number) => {
    await storage.saveState({ currentDay: day });
    setState((prev) => ({ ...prev, currentDay: day }));
  }, []);

  const completeRitual = useCallback(async () => {
    const date = new Date().toISOString();
    await storage.saveState({ ritualCompletedToday: true, lastRitualDate: date });
    setState((prev) => ({
      ...prev,
      ritualCompletedToday: true,
      lastRitualDate: date,
    }));
  }, []);

  const checkPlanoManutencao = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('manutencao') === 'ativo') {
      localStorage.setItem('state_planoManutencao', 'true');
      setState((prev) => ({ ...prev, planoManutencao: true }));
    }
  }, []);

  const unlockAllDays = useCallback(async () => {
    await storage.saveState({ currentDay: 7 });
    setState((prev) => ({ 
      ...prev, 
      currentDay: 7,
      onboarding: prev.onboarding || { babyName: 'Dev Baby', babyAge: '0-6m', dayStartedAt: new Date().toISOString() }
    }));
  }, []);

  const updateThemePreference = useCallback(async (theme: 'auto' | 'dark' | 'light') => {
    await storage.saveState({ themePreference: theme });
    setState((prev) => ({ ...prev, themePreference: theme }));
  }, []);

  const addDiaryEntry = useCallback(async (entry: import('../lib/types').DiaryEntry) => {
    await storage.saveDiaryEntry(entry);
    setState((prev) => ({
      ...prev,
      diaryEntries: [...prev.diaryEntries, entry],
    }));
  }, []);

  const updateContentProgress = useCallback(async (moduleId: string, progress: import('../lib/types').ModuleProgress) => {
    setState((prev) => {
      const newProgress = { ...prev.contentProgress, [moduleId]: progress };
      storage.saveState({ contentProgress: newProgress });
      return { ...prev, contentProgress: newProgress };
    });
  }, []);

  const registerQuebraDoRitmo = useCallback(async (quebra: import('../lib/types').QuebraDoRitmo) => {
    setState((prev) => {
      const newQuebras = [...prev.quebrasDoRitmo, quebra];
      storage.saveState({ quebrasDoRitmo: newQuebras });
      return { ...prev, quebrasDoRitmo: newQuebras };
    });
  }, []);

  return {
    state,
    isLoading,
    updateOnboarding,
    addWakeup,
    updateDay,
    completeRitual,
    checkPlanoManutencao,
    unlockAllDays,
    updateThemePreference,
    addDiaryEntry,
    updateContentProgress,
    registerQuebraDoRitmo,
  };
}

export type AppContextType = ReturnType<typeof useAppContext>;
