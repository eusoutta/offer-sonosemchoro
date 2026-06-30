import { ChevronLeft, Calendar, Play, Heart, Star, TrendingDown, Moon, Baby, ArrowLeft } from 'lucide-react';
import type { WakeupEntry, OnboardingData } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';

interface DaySummaryProps {
  onboarding: OnboardingData;
  currentDay: number;
  wakeups: WakeupEntry[];
  onBack: () => void;
  onWakeup: () => void;
  isNightMode: boolean;
}

const DAY_TITLES: Record<number, string> = {
  1: 'O Comeco',
  2: 'Aprendendo',
  3: 'O Pico',
  4: 'Virando',
  5: 'Consolidando',
  6: 'Quase La',
  7: 'Conquista',
};

const DAY_DETAILED_TIPS: Record<number, { what: string; encouragement: string; action: string }> = {
  1: {
    what: 'Hoje e o primeiro dia de mudanca. O teu bebe vai notar que algo mudou — e VAI reagir. E normal haver mais choro nas primeiras noites.',
    encouragement: 'Nao vais estragar o teu bebe. Esta a ensinar-lhe uma habilidade valiosa. O choro e frustracao, nao dor.',
    action: 'Cada vez que ele acordar, usa o botao "ELE ACORDOU". Deixa o app guiar-te.',
  },
  2: {
    what: 'Módulo 2 e sobre ajustar o processo. O bebe ja reparou que mama nao e mais o "gatilho" automatico para dormir.',
    encouragement: 'O esforco de ontem nao foi em vao. Cada noite cria memoria.',
    action: 'Mantem a sequencia de passos CONSISTENTE com ontem. A consistencia e a chave.',
  },
  3: {
    what: 'E frequente o Módulo 3 ser o mais dificil. Isto chama-se "extincao burst" — o bebe esta a testar se o limite e real.',
    encouragement: 'Se hoje for mais dificil, e BOM SINAL. Significa que o metodo esta a funcionar. NAO CEDAS.',
    action: 'Se o choro for intenso, respira fundo. Pede ajuda se precisares. MAS mantem os limites.',
  },
  4: {
    what: 'Ja passou o pico provavel. Os despertares devem estar a descer.',
    encouragement: 'Agora e sobre CONSOLIDAR o que aprendeu. Nao baixes a guarda.',
    action: 'Continua a usar o app em cada despertar. Mesmo se ele adormecer sozinho, registrou.',
  },
  5: {
    what: 'A segunda metade da semana e sobre criar MEMORIA. O habito esta a formar-se.',
    encouragement: 'O cerebro do bebe aprende por REPETICAO. Cada noite que praticas reforca.',
    action: 'Faz o ritual pre-sono consistentemente. Isto prepara o terreno para a noite.',
  },
  6: {
    what: 'Estas quase! Muitas mae veem uma grande mudanca nesta fase.',
    encouragement: 'Olha para tras e ve quanto ja fizeste. Orgulha-te.',
    action: 'Hoje e um bom dia para revisar o teu progresso no Diario.',
  },
  7: {
    what: 'Uma semana completa! O bebe provavelmente ja consegue adormecer sem a associacao anterior.',
    encouragement: 'CONSEGUISTE! Esta conquista e tua e do teu bebe. Celebra.',
    action: 'Continua a usar o metodo quando necessario. Proximo objetivo: manter o ganho.',
  },
};

export function DaySummary({
  onboarding,
  currentDay,
  wakeups,
  onBack,
  onWakeup,
  isNightMode,
}: DaySummaryProps) {
  const { vibrate } = useVibrate();

  const displayDay = Math.min(currentDay, 7);
  const dayTitle = DAY_TITLES[displayDay] || 'Continua';
  const dayTips = DAY_DETAILED_TIPS[displayDay] || {
    what: 'Continua a aplicar o metodo.',
    encouragement: 'O progresso continua.',
    action: 'Mantem a consistencia.',
  };

  const today = new Date().toISOString().split('T')[0];
  const todayWakeups = wakeups.filter(w => w.date === today);

  // Calculate improvement if we have data
  const day1Wakeups = wakeups.filter(w => w.day_number === 1).length;
  const latestWakeups = wakeups.filter(w => w.day_number === displayDay).length;
  const improvement = day1Wakeups > 0 && displayDay > 1
    ? Math.round(((day1Wakeups - latestWakeups) / day1Wakeups) * 100)
    : null;

  return (
    <div className={`min-h-screen flex flex-col ${isNightMode ? 'bg-gray-900' : 'bg-cream'}`}>
      <header className={`px-4 py-4 flex items-center gap-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <button
          onClick={() => { vibrate(50); onBack(); }}
          className={`p-2 ${isNightMode ? 'text-white' : 'text-gray-600'}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className={`font-semibold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
            Módulo {displayDay} {displayDay <= 7 ? 'de 7' : ''}
          </h1>
          <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {dayTitle}
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
        {/* Day Hero */}
        <div className={`rounded-2xl p-6 mb-6 text-center ${isNightMode ? 'bg-gradient-to-br from-coral-500/20 to-coral-600/10 border border-coral-500/30' : 'bg-gradient-to-br from-coral-50 to-coral-100 border border-coral-200'}`}>
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-white">{displayDay}</span>
          </div>
          <h2 className={`text-xl font-bold mb-2 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
            {dayTitle}
          </h2>
          <p className={`text-sm ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Módulo {currentDay} de {onboarding.babyName}
          </p>
        </div>

        {/* What to expect */}
        <div className={`rounded-xl p-4 mb-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-2 mb-3">
            <Moon className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
            <h3 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              O que esperar hoje
            </h3>
          </div>
          <p className={`text-sm leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {dayTips.what}
          </p>
        </div>

        {/* Encouragement */}
        <div className={`rounded-xl p-4 mb-4 border-2 ${isNightMode ? 'bg-coral-500/10 border-coral-500/30' : 'bg-coral-50 border-coral-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Heart className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
            <h3 className={`font-semibold ${isNightMode ? 'text-coral-300' : 'text-coral-600'}`}>
              Lembra-te
            </h3>
          </div>
          <p className={`text-sm leading-relaxed ${isNightMode ? 'text-coral-200' : 'text-coral-700'}`}>
            {dayTips.encouragement}
          </p>
        </div>

        {/* Action */}
        <div className={`rounded-xl p-4 mb-6 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-2 mb-3">
            <Star className={`w-5 h-5 ${isNightMode ? 'text-green-400' : 'text-green-500'}`} />
            <h3 className={`font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              A tua acao hoje
            </h3>
          </div>
          <p className={`text-sm leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {dayTips.action}
          </p>
        </div>

        {/* Today's stats if available */}
        {todayWakeups.length > 0 && (
          <div className={`rounded-xl p-4 mb-6 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className={`font-semibold mb-3 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              Estatisticas de hoje
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-coral-500">{todayWakeups.length}</p>
                <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Despertares</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-green-500">
                  {todayWakeups.filter(w => w.resolved_step <= 3).length}
                </p>
                <p className={`text-[10px] font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Sem mama
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-blue-500">
                  {todayWakeups.filter(w => w.resolved_step === 4).length}
                </p>
                <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Com agua</p>
              </div>
            </div>

            {improvement !== null && improvement > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-600 font-medium">
                  {improvement}% menos desde o Módulo 1!
                </p>
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => { vibrate(100); onWakeup(); }}
          className="w-full py-5 rounded-xl font-bold text-lg bg-gradient-to-r from-coral-400 to-coral-500 text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <Baby className="w-6 h-6" />
          ELE ACORDOU
        </button>

        <p className={`text-center mt-4 text-sm ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Quando o {onboarding.babyName} acordar, toca acima
        </p>
      </main>
    </div>
  );
}
