import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { WakeupMode } from './components/WakeupMode';
import { Progress } from './components/Progress';
import { Ritual } from './components/Ritual';
import { FAQ } from './components/FAQ';
import { Menu } from './components/Menu';
import { Paywall } from './components/Paywall';
import { DaySummary } from './components/DaySummary';
import { BottomNav } from './components/BottomNav';
import { TabMetodo } from './components/TabMetodo';
import { TabFerramentas } from './components/TabFerramentas';
import { TabEu } from './components/TabEu';
import { useAppContext } from './hooks/useAppContext';
import { isNightTime, isRitualTime } from './lib/storage';
import type { WakeupEntry, TabId } from './lib/types';

type Screen = 'home' | 'wakeup' | 'progress' | 'ritual' | 'faq' | 'daySummary';

function App() {
  const { state, isLoading, updateOnboarding, addWakeup, completeRitual } = useAppContext();
  const [screen, setScreen] = useState<Screen>('home');
  const [activeTab, setActiveTab] = useState<TabId>('hoje');
  const [isNightMode, setIsNightMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [dayProgress, setDayProgress] = useState<Record<number, { completed: boolean; opened_at: string | null; completed_at: string | null }>>({});

  useEffect(() => {
    setIsNightMode(isNightTime());
    const interval = setInterval(() => setIsNightMode(isNightTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check for plano manutencao URL param
    const params = new URLSearchParams(window.location.search);
    if (params.get('manutencao') === 'ativo') {
      localStorage.setItem('state_planoManutencao', 'true');
    }
  }, []);

  useEffect(() => {
    // Show paywall after day 7 completion
    if (state.currentDay > 7 && !state.planoManutencao) {
      const shownKey = `paywall_shown_after_d7`;
      if (!localStorage.getItem(shownKey) && state.wakeupHistory.length > 0) {
        setPaywallOpen(true);
        localStorage.setItem(shownKey, 'true');
      }
    }
  }, [state.currentDay, state.planoManutencao, state.wakeupHistory.length]);

  const handleOnboardingComplete = async (data: Parameters<typeof updateOnboarding>[0]) => {
    await updateOnboarding(data);
  };

  const handleWakeupComplete = async (wakeup: WakeupEntry) => {
    await addWakeup(wakeup);
    setScreen('home');
  };

  const handleRitualComplete = async () => {
    await completeRitual();
    setScreen('home');
  };

  const handleDayOpen = (day: number) => {
    setDayProgress(prev => ({
      ...prev,
      [day]: { completed: false, opened_at: new Date().toISOString(), completed_at: null },
    }));
  };

  const handleDayComplete = (day: number) => {
    setDayProgress(prev => ({
      ...prev,
      [day]: { ...prev[day], completed: true, completed_at: new Date().toISOString() },
    }));

    // Unlock achievements
    if (day === 1) unlockAchievement('dia-1');
    if (day === 3) unlockAchievement('dia-3');
    if (day === 7) {
      unlockAchievement('dia-7');
      // Show paywall after day 7
      setTimeout(() => setPaywallOpen(true), 500);
    }
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (tab !== 'hoje') {
      setScreen('home');
    }
  };

  const unlockAchievement = (id: string) => {
    const unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    if (!unlocked.includes(id)) {
      unlocked.push(id);
      localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isNightMode ? 'bg-gray-900' : 'bg-cream'}`}>
        <div className="w-20 h-20 bg-coral-400 rounded-full flex items-center justify-center mb-4">
          <MoonStar className="w-10 h-10 text-white" />
        </div>
        <h1 className={`text-xl font-bold mb-2 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
          Sono sem Choro
        </h1>
        <div className="w-8 h-8 border-4 border-coral-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Onboarding if no data
  if (!state.onboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Wakeup mode is fullscreen, no nav
  if (screen === 'wakeup') {
    return (
      <WakeupMode
        babyName={state.onboarding.babyName}
        babyAge={state.onboarding.babyAge}
        currentDay={state.currentDay}
        onComplete={handleWakeupComplete}
        onExit={() => setScreen('home')}
      />
    );
  }

  // Main app with bottom nav
  return (
    <div className="min-h-screen pb-20">
      {/* Tab: Hoje */}
      {activeTab === 'hoje' && (
        <>
          {screen === 'home' && (
            <Home
              onboarding={state.onboarding}
              currentDay={state.currentDay}
              wakeups={state.wakeupHistory}
              onWakeup={() => setScreen('wakeup')}
              onProgress={() => setScreen('progress')}
              onRitual={() => isRitualTime() && setScreen('ritual')}
              onFAQ={() => setScreen('faq')}
              onMenu={() => setMenuOpen(true)}
              isNightMode={isNightMode}
              onDaySummary={() => setScreen('daySummary')}
            />
          )}

          {screen === 'daySummary' && (
            <DaySummary
              onboarding={state.onboarding}
              currentDay={state.currentDay}
              wakeups={state.wakeupHistory}
              onBack={() => setScreen('home')}
              onWakeup={() => setScreen('wakeup')}
              isNightMode={isNightMode}
            />
          )}

          {screen === 'progress' && (
            <Progress
              wakeups={state.wakeupHistory}
              currentDay={state.currentDay}
              onBack={() => setScreen('home')}
              isNightMode={isNightMode}
            />
          )}

          {screen === 'ritual' && (
            <Ritual
              onComplete={handleRitualComplete}
              onBack={() => setScreen('home')}
              isNightMode={isNightMode}
            />
          )}

          {screen === 'faq' && (
            <FAQ
              onBack={() => setScreen('home')}
              isNightMode={isNightMode}
            />
          )}
        </>
      )}

      {/* Tab: Metodo */}
      {activeTab === 'metodo' && (
        <TabMetodo
          isNightMode={isNightMode}
          currentDay={state.currentDay}
          dayProgress={dayProgress}
          onDayOpen={handleDayOpen}
          onDayComplete={handleDayComplete}
        />
      )}

      {/* Tab: Ferramentas */}
      {activeTab === 'ferramentas' && (
        <TabFerramentas
          isNightMode={isNightMode}
          babyAgeRange={state.onboarding.babyAge}
        />
      )}

      {/* Tab: Eu */}
      {activeTab === 'eu' && (
        <TabEu
          isNightMode={isNightMode}
          onToggleNightMode={() => setIsNightMode(!isNightMode)}
          currentDay={state.currentDay}
          wakeupHistory={state.wakeupHistory}
          unlockedAchievements={JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')}
          diaryEntries={[]}
          babyName={state.onboarding.babyName}
          babyAgeRange={state.onboarding.babyAge}
          methodStartDate={state.onboarding.dayStartedAt || null}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isNightMode={isNightMode}
      />

      {/* Menu */}
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        planoManutencao={state.planoManutencao}
        currentDay={state.currentDay}
        isNightMode={isNightMode}
        onPaywall={() => { setMenuOpen(false); setPaywallOpen(true); }}
      />

      {/* Paywall */}
      <Paywall
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        babyName={state.onboarding.babyName}
        currentDay={state.currentDay}
        wakeups={state.wakeupHistory}
      />
    </div>
  );
}

// Missing import
import { MoonStar } from 'lucide-react';

export default App;
