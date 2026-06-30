import { useState, useEffect, useCallback } from 'react';
import type { OnboardingData, WakeupEntry, AppState } from '../lib/types';
import * as storage from '../lib/storage';

export function useAppContext() {
  const [state, setState] = useState<AppState>({
    onboarding: null,
    wakeupHistory: [],
    currentDay: 1,
    ritualCompletedToday: false,
    lastRitualDate: null,
    planoManutencao: false,
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

        setState({
          onboarding: onboarding,
          wakeupHistory: wakeups,
          currentDay: currentDay,
          ritualCompletedToday: lastRitualDate === today,
          lastRitualDate: savedState.lastRitualDate ?? null,
          planoManutencao: savedState.planoManutencao ?? false,
        });
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

  return {
    state,
    isLoading,
    updateOnboarding,
    addWakeup,
    updateDay,
    completeRitual,
    checkPlanoManutencao,
  };
}

export type AppContextType = ReturnType<typeof useAppContext>;
