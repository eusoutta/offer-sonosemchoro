import { useEffect, useState } from 'react';
import {
  User, BarChart3, Award, PenLine, Baby, Settings, Download, Moon,
  Sun, LogOut, TrendingDown, Calendar, Heart, Star, Trophy
} from 'lucide-react';
import { ACHIEVEMENTS, type Achievement } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';
import type { WakeupEntry } from '../lib/types';
import { CustomAudioSetup } from './CustomAudioSetup';

interface TabEuProps {
  isNightMode: boolean;
  themePreference: 'auto' | 'dark' | 'light';
  onToggleNightMode: (theme: 'auto' | 'dark' | 'light') => void;
  currentDay: number;
  wakeupHistory: WakeupEntry[];
  unlockedAchievements: string[];
  diaryEntries: { day: number; question: string; answer: string; date: string }[];
  babyName: string;
  babyAgeRange: string;
  methodStartDate: string | null;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'primeira-noite', title: 'Primeira Noite', description: 'Registaste o primeiro despertar', icon: 'moon', condition: 'first_wakeup' },
  { id: 'dia-1', title: 'Módulo 1', description: 'Concluiste o Módulo 1', icon: '1', condition: 'd1' },
  { id: 'dia-3', title: 'Aplicou a Técnica', description: 'Concluiste o Módulo 3', icon: 'heart', condition: 'd3' },
  { id: 'dia-7', title: 'Conseguiu!', description: 'Completaste os 7 dias', icon: 'trophy', condition: 'd7' },
  { id: 'diario-1', title: 'Primeiro Registo', description: 'Escreveste no diário', icon: 'pen', condition: 'first_diary' },
  { id: 'noite-tranquila', title: 'Noite Tranquila', description: 'Uma noite com ≤2 despertares', icon: 'star', condition: 'quiet' },
  { id: '30-dias', title: '30 Dias', description: 'Usaste o método por 30 dias', icon: 'calendar', condition: '30d' },
];

export function TabEu({
  isNightMode,
  themePreference,
  onToggleNightMode,
  currentDay,
  wakeupHistory,
  unlockedAchievements,
  diaryEntries,
  babyName,
  babyAgeRange,
  methodStartDate,
}: TabEuProps) {
  const { vibrate } = useVibrate();
  const [activeSection, setActiveSection] = useState<'stats' | 'achievements' | 'diary' | 'settings'>('stats');

  // Calculate statistics
  const totalWakeups = wakeupHistory.length;
  const resolvedWithoutMama = wakeupHistory.filter(w => w.resolved_step <= 3).length;
  const successRate = totalWakeups > 0 ? Math.round((resolvedWithoutMama / totalWakeups) * 100) : 0;

  // Get stats by day
  const getWakeupsByDay = () => {
    const byDay: Record<number, number> = {};
    for (let i = 1; i <= 7; i++) {
      byDay[i] = wakeupHistory.filter(w => w.day_number === i).length;
    }
    return byDay;
  };

  const byDay = getWakeupsByDay();
  const maxWakeups = Math.max(...Object.values(byDay), 1);

  // Calculate improvement
  const day1Wakeups = byDay[1] || 0;
  const latestDay = Math.min(currentDay, 7);
  const latestWakeups = byDay[latestDay] || 0;
  const improvement = day1Wakeups > 0 && latestDay > 1
    ? Math.round(((day1Wakeups - latestWakeups) / day1Wakeups) * 100)
    : 0;

  // Night streak (quiet nights)
  const calculateStreak = () => {
    let streak = 0;
    for (let i = currentDay; i >= 1; i--) {
      if (byDay[i] <= 2) streak++;
      else break;
    }
    return streak;
  };
  const streak = calculateStreak();

  const exportData = () => {
    vibrate(50);
    const data = {
      babyName,
      babyAgeRange,
      currentDay,
      wakeupHistory,
      unlockedAchievements,
      diaryEntries,
      methodStartDate,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sono-sem-choro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getIcon = (iconId: string) => {
    switch (iconId) {
      case 'moon': return <Moon className="w-6 h-6" />;
      case 'heart': return <Heart className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'pen': return <PenLine className="w-6 h-6" />;
      case 'calendar': return <Calendar className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className={`min-h-screen ${isNightMode ? 'bg-gray-900' : 'bg-cream'} pb-24`}>
      <header className={`px-4 py-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              O Teu Perfil
            </h1>
            <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Módulo {currentDay} • {babyName}
            </p>
          </div>
        </div>
      </header>

      {/* Section Tabs */}
      <div className={`px-4 py-3 flex gap-2 overflow-x-auto ${isNightMode ? 'bg-gray-800/50' : 'bg-gray-100'}`} style={{ scrollbarWidth: 'none' }}>
        {[
          { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
          { id: 'achievements', label: 'Conquistas', icon: Award },
          { id: 'diary', label: 'Diário', icon: PenLine },
          { id: 'settings', label: 'Definições', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { vibrate(30); setActiveSection(tab.id as typeof activeSection); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-coral-400 text-white'
                : isNightMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-white text-gray-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="px-4 py-4">
        {/* Stats Section */}
        {activeSection === 'stats' && (
          <div className="space-y-4">
            {/* Streak Card */}
            {streak > 0 && (
              <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gradient-to-r from-green-600/30 to-green-500/10' : 'bg-gradient-to-r from-green-50 to-green-100'} border-2 border-green-500/30`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isNightMode ? 'text-green-400' : 'text-green-600'}`}>
                      {streak} noite{streak > 1 ? 's' : ''}
                    </p>
                    <p className={`text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      tranquila{streak > 1 ? 's' : ''} seguida{streak > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Stats */}
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`font-bold mb-4 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                Resumo Geral
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                    {totalWakeups}
                  </p>
                  <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Despertares
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">
                    {resolvedWithoutMama}
                  </p>
                  <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Sem mamar
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-3xl font-bold ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`}>
                    {successRate}%
                  </p>
                  <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Taxa sucesso
                  </p>
                </div>
              </div>
            </div>

            {/* 7-Day Chart */}
            {currentDay > 1 && (
              <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                    Últimos {Math.min(currentDay, 7)} Módulos
                  </h3>
                  {improvement > 0 && (
                    <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                      <TrendingDown className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium text-green-600">-{improvement}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between gap-2 h-24">
                  {[1, 2, 3, 4, 5, 6, 7].slice(0, Math.min(currentDay, 7)).map(d => {
                    const count = byDay[d] || 0;
                    const pct = maxWakeups > 0 ? (count / maxWakeups) * 100 : 0;
                    return (
                      <div key={d} className="flex-1 flex flex-col items-center">
                        <div className="w-full relative h-16">
                          <div
                            className={`absolute bottom-0 w-full rounded-t ${d === currentDay ? 'bg-coral-400' : 'bg-coral-200'}`}
                            style={{ height: `${Math.max(pct, count > 0 ? 15 : 5)}%` }}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>D{d}</p>
                        <p className={`text-sm font-semibold ${isNightMode ? 'text-white' : 'text-gray-700'}`}>{count}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Baby Info */}
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-3 mb-4">
                <Baby className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                <h3 className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Dados de {babyName}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Idade</p>
                  <p className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                    {babyAgeRange === '0-6m' ? '0 a 6 meses' :
                     babyAgeRange === '7-12m' ? '7 a 12 meses' :
                     babyAgeRange === '13-24m' ? '13 a 24 meses' : 'Mais de 2 anos'}
                  </p>
                </div>
                {methodStartDate && (
                  <div>
                    <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Início do método</p>
                    <p className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                      {new Date(methodStartDate).toLocaleDateString('pt-MZ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {activeSection === 'achievements' && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-3 mb-4">
                <Award className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                <h3 className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Conquistas ({unlockedAchievements.length}/{ALL_ACHIEVEMENTS.length})
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ALL_ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl text-center ${
                        isUnlocked
                          ? isNightMode
                            ? 'bg-coral-500/20 border-2 border-coral-500'
                            : 'bg-coral-50 border-2 border-coral-200'
                          : isNightMode
                            ? 'bg-gray-700 opacity-50'
                            : 'bg-gray-100 opacity-50'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-coral-400 text-white'
                          : isNightMode
                            ? 'bg-gray-600 text-gray-400'
                            : 'bg-gray-200 text-gray-400'
                      }`}>
                        {getIcon(achievement.icon)}
                      </div>
                      <p className={`text-sm font-medium mt-2 ${isUnlocked ? (isNightMode ? 'text-white' : 'text-gray-800') : isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {achievement.title}
                      </p>
                      <p className={`text-xs mt-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Diary Section */}
        {activeSection === 'diary' && (
          <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <PenLine className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
              <h3 className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                O Meu Diário
              </h3>
            </div>
            {diaryEntries.length === 0 ? (
              <div className={`text-center py-8 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <PenLine className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Ainda não escreveste nenhuma reflexão.</p>
                <p className="text-xs mt-1">As entradas aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diaryEntries.map((entry, index) => (
                  <div key={index} className={`p-4 rounded-xl ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`}>
                        Módulo {entry.day_number}
                      </span>
                      <span className={`text-xs ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(entry.date).toLocaleDateString('pt-MZ')}
                      </span>
                    </div>
                    <p className={`text-xs italic mb-2 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      "{entry.question}"
                    </p>
                    <p className={`text-sm ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {entry.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <p className={`text-center text-xs mt-4 ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Este é o teu histórico. Guarda-o.
            </p>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="space-y-4">
            <CustomAudioSetup isNightMode={isNightMode} />

            <div className={`rounded-2xl overflow-hidden ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="p-5">
                <h3 className={`font-bold mb-4 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Definições
                </h3>
              </div>

            <button
              onClick={() => {
                vibrate(30);
                const nextTheme = themePreference === 'auto' ? 'dark' : themePreference === 'dark' ? 'light' : 'auto';
                onToggleNightMode(nextTheme);
              }}
              className={`w-full p-4 flex items-center justify-between border-t ${
                isNightMode ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {themePreference === 'auto' ? <Settings className="w-5 h-5 text-gray-500" /> : themePreference === 'dark' ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <span className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Tema do App
                </span>
              </div>
              <div className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {themePreference === 'auto' ? 'Automático' : themePreference === 'dark' ? 'Noite' : 'Dia'}
              </div>
            </button>

            <button
              onClick={exportData}
              className={`w-full p-4 flex items-center gap-3 border-t ${
                isNightMode ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <Download className={`w-5 h-5 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                Exportar dados
              </span>
            </button>

            <div className={`p-4 border-t ${isNightMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <p className={`text-xs ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Sono sem Choro v1.0 — Método da Vaquinha
              </p>
              <p className={`text-xs mt-1 ${isNightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                Feito para màes moçambicanas 💙
              </p>
            </div>
          </div>
          </div>
        )}
      </main>
    </div>
  );
}
