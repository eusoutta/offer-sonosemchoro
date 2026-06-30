import { ArrowLeft, TrendingDown, Calendar, Moon, Clock, Target, Award, BarChart3 } from 'lucide-react';
import type { WakeupEntry } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';

interface ProgressProps {
  wakeups: WakeupEntry[];
  currentDay: number;
  onBack: () => void;
  isNightMode: boolean;
}

export function Progress({ wakeups, currentDay, onBack, isNightMode }: ProgressProps) {
  const { vibrate } = useVibrate();

  const today = new Date().toISOString().split('T')[0];
  const todayWakeups = wakeups.filter(w => w.date === today);
  const resolvedWithoutMama = todayWakeups.filter(w => w.resolved_step <= 3).length;
  const totalToday = todayWakeups.length;

  // Calculate stats for last 7 days
  const daysWithData = [...new Set(wakeups.map(w => w.day_number))].sort((a, b) => a - b);
  const days = [1, 2, 3, 4, 5, 6, 7].slice(0, Math.min(currentDay, 7));
  const wakeupsByDay: Record<number, number[]> = {};
  const resolvedByStep: Record<number, Record<number, number>> = {};
  
  daysWithData.forEach(d => {
    const dayWakeups = wakeups.filter(w => w.day_number === d);
    wakeupsByDay[d] = dayWakeups.map(w => w.duration_seconds);

    if (!resolvedByStep[d]) {
        resolvedByStep[d] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
    dayWakeups.forEach(w => {
      resolvedByStep[d][w.resolved_step]++;
    });
  });

  const totalWakeupsByDay: Record<number, number> = {};
  days.forEach(d => {
    totalWakeupsByDay[d] = wakeups.filter(w => w.day_number === d).length;
  });

  const day1Wakeups = totalWakeupsByDay[1] || 0;
  const latestDay = Math.min(currentDay, 7);
  const latestWakeups = totalWakeupsByDay[latestDay] || 0;
  const improvement = day1Wakeups > 0
    ? Math.round(((day1Wakeups - latestWakeups) / day1Wakeups) * 100)
    : 0;

  const maxWakeups = Math.max(...Object.values(totalWakeupsByDay), 1);
  const totalAllDays = wakeups.length;
  const totalResolvedWithoutMama = wakeups.filter(w => w.resolved_step <= 3).length;

  // Average duration
  const avgDuration = wakeupsByDay[latestDay]
    ? Math.round(wakeupsByDay[latestDay].reduce((a, b) => a + b, 0) / wakeupsByDay[latestDay].length)
    : 0;

  // Best night
  const bestNight = days.reduce((best, d) => {
    const count = totalWakeupsByDay[d] || 0;
    const bestCount = totalWakeupsByDay[best] || Infinity;
    return count < bestCount ? d : best;
  }, 1);

  // Streak
  const quietNights = () => {
    let count = 0;
    for (let i = currentDay; i >= 1; i--) {
      if ((totalWakeupsByDay[i] || 0) <= 2) {
        count++;
      } else {
        break;
      }
    }
    return count;
  };

  const streak = quietNights();

  return (
    <div className={`min-h-screen flex flex-col ${isNightMode ? 'bg-gray-900' : 'bg-cream'}`}>
      <header className={`px-4 py-4 flex items-center gap-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <button onClick={() => { vibrate(50); onBack(); }} className={`p-2 ${isNightMode ? 'text-white' : 'text-gray-600'}`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className={`font-semibold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
            O Meu Diario
          </h1>
          <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {totalAllDays} noite{totalAllDays !== 1 ? 's' : ''} registada{totalAllDays !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {/* Today's Summary */}
        <div className={`rounded-2xl p-5 mb-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isNightMode ? 'bg-coral-500/20' : 'bg-coral-100'}`}>
              <Calendar className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
            </div>
            <div>
              <p className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                Módulo {currentDay} {currentDay <= 7 ? 'de 7' : ''}
              </p>
              <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date().toLocaleDateString('pt-MZ', { weekday: 'long' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className={`text-center p-3 rounded-xl ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-3xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                {totalToday}
              </p>
              <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Despertares
              </p>
            </div>
            <div className={`text-center p-3 rounded-xl bg-green-500/10`}>
              <p className="text-3xl font-bold text-green-500">{resolvedWithoutMama}</p>
              <p className={`text-xs text-green-600`}>
                Sem mamar
              </p>
            </div>
            <div className={`text-center p-3 rounded-xl ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-3xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                {avgDuration}s
              </p>
              <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Tempo med.
              </p>
            </div>
          </div>

          {totalToday > 0 && (
            <div className="space-y-2">
              <p className={`text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Detalhes dos despertares de hoje:
              </p>
              <div className="flex flex-wrap gap-2">
                {todayWakeups.map((w, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                      w.resolved_step <= 3
                        ? 'bg-green-500/20 text-green-600'
                        : w.resolved_step === 4
                          ? 'bg-yellow-500/20 text-yellow-600'
                          : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    <span className="font-bold text-lg">{w.resolved_step}</span>
                    <span className="text-xs">
                      {new Date(w.timestamp).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
              <p className={`text-xs ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Verde = Passos 1-3 (sem mama) | Amarelo = Passo 4 (agua) | Vermelho = Passo 5 (mama)
              </p>
            </div>
          )}
        </div>

        {/* Streak/Award Card */}
        {streak > 0 && (
          <div className={`rounded-xl p-4 mb-4 flex items-center gap-4 ${isNightMode ? 'bg-gradient-to-r from-green-600/20 to-green-500/10 border border-green-500/30' : 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isNightMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <Award className={`w-6 h-6 text-green-500`} />
            </div>
            <div>
              <p className={`font-bold ${isNightMode ? 'text-green-400' : 'text-green-600'}`}>
                {streak} noite{streak > 1 ? 's' : ''} tranquila{streak > 1 ? 's' : ''}!
              </p>
              <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {streak} dias com 2 ou menos despertares
              </p>
            </div>
          </div>
        )}

        {/* 7 Day Chart */}
        {currentDay > 1 && (
          <div className={`rounded-2xl p-5 mb-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                <h2 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Ultimos {Math.min(currentDay, 7)} Módulos
                </h2>
              </div>
              {improvement > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-green-600">-{improvement}%</span>
                </div>
              )}
            </div>

            <div className="flex items-end justify-between gap-2 h-36 mb-4">
              {days.map(d => {
                const count = totalWakeupsByDay[d] || 0;
                const heightPct = maxWakeups > 0 ? (count / maxWakeups) * 100 : 0;
                const isToday = d === currentDay;
                const isBest = d === bestNight && count > 0;

                return (
                  <div key={d} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full flex flex-col items-center justify-end h-28">
                      <span className={`text-xs font-bold mb-1 ${isNightMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {count > 0 ? count : '-'}
                      </span>
                      <div
                        className={`w-full rounded-t transition-all ${
                          isToday
                            ? 'bg-coral-400'
                            : isBest
                              ? 'bg-green-400'
                              : 'bg-coral-200'
                        }`}
                        style={{
                          height: `${Math.max(heightPct, count > 0 ? 8 : 4)}%`,
                          minHeight: count > 0 ? '12px' : '4px',
                        }}
                      />
                      {isBest && count > 0 && (
                        <div className="absolute -top-5">
                          <Award className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      D{d}
                    </p>
                  </div>
                );
              })}
            </div>

            {improvement > 0 && (
              <div className="text-center p-3 rounded-lg bg-green-500/10">
                <p className="text-sm text-green-600 font-medium">
                  {improvement}% menos despertares desde o Módulo 1
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className={`rounded-xl p-4 mb-6 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <h3 className={`font-semibold mb-4 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
            Resumo Geral
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${isNightMode ? 'bg-gray-700' : 'bg-coral-50'}`}>
              <p className={`text-2xl font-bold ${isNightMode ? 'text-white' : 'text-coral-600'}`}>
                {totalAllDays}
              </p>
              <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Noites registadas
              </p>
            </div>
            <div className={`p-3 rounded-lg bg-green-500/10`}>
              <p className="text-2xl font-bold text-green-500">
                {totalResolvedWithoutMama}
              </p>
              <p className={`text-xs text-green-600`}>
                Resolvidos sem mama
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isNightMode ? 'bg-gray-700' : 'bg-coral-50'}`}>
              <p className={`text-2xl font-bold ${isNightMode ? 'text-white' : 'text-coral-600'}`}>
                {bestNight > 0 ? `Módulo ${bestNight}` : '-'}
              </p>
              <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Melhor noite
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isNightMode ? 'bg-gray-700' : 'bg-coral-50'}`}>
              <p className={`text-2xl font-bold ${isNightMode ? 'text-white' : 'text-coral-600'}`}>
                {Math.round((totalResolvedWithoutMama / Math.max(totalAllDays, 1)) * 100)}%
              </p>
              <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Taxa de sucesso
              </p>
            </div>
          </div>
        </div>

        {/* Loss Aversion Footer */}
        <div className={`rounded-xl p-4 ${isNightMode ? 'bg-gray-800' : 'bg-coral-50'}`}>
          <p className={`text-center text-sm ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Tens {totalAllDays} noite{totalAllDays !== 1 ? 's' : ''} registada{totalAllDays !== 1 ? 's' : ''}.
          </p>
          <p className={`text-center text-xs mt-1 ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Este e o teu historico — continua a construir.
          </p>
        </div>
      </main>
    </div>
  );
}
