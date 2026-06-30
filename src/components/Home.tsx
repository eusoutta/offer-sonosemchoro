import { useEffect, useState } from 'react';
import { Moon, BarChart3, MoonStar, HelpCircle, Menu, Sparkles, Heart, Star, Zap, Coffee, Sun, CloudMoon, Baby } from 'lucide-react';
import type { OnboardingData, WakeupEntry } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';

interface HomeProps {
  onboarding: OnboardingData;
  currentDay: number;
  wakeups: WakeupEntry[];
  onWakeup: () => void;
  onProgress: () => void;
  onRitual: () => void;
  onFAQ: () => void;
  onMenu: () => void;
  isNightMode: boolean;
  onDaySummary: () => void;
}

const DAY_MESSAGES: Record<number, { title: string; message: string; tip: string; icon: string }> = {
  1: {
    title: 'A Semente',
    message: 'Esta e a noite de plantar a semente.',
    tip: 'Nao desistas na primeira dificuldade. Cada despertar e uma oportunidade de praticar.',
    icon: '1',
  },
  2: {
    title: 'A Ajustagem',
    message: 'Cada passo conta. Continua.',
    tip: 'O teu bebe esta a aprender algo novo. Paciencia e consistencia sao as tuas armas.',
    icon: '2',
  },
  3: {
    title: 'O Pico',
    message: 'Hoje e a noite mais dificil — aguenta.',
    tip: 'Se o teu bebe chora mais hoje, e BOM sinal. Esta a testar limites. Nao cedas.',
    icon: '3',
  },
  4: {
    title: 'A Consolidaçao',
    message: 'O progresso esta a ser consolidado.',
    tip: 'Os despertares comecam a descer. Mantem a sequencia em cada um.',
    icon: '4',
  },
  5: {
    title: 'O Habito',
    message: 'Estas a criar um novo habito.',
    tip: 'O cerebro do teu bebe ja esta a entender. Confia no processo.',
    icon: '5',
  },
  6: {
    title: 'A Viragem',
    message: 'Quase uma semana! O sono esta a mudar.',
    tip: 'Olha para tras e ve o progresso. Estas quase la.',
    icon: '6',
  },
  7: {
    title: 'Uma Semana',
    message: 'Uma semana completa. Orgulha-te.',
    tip: 'Conseguiste! O teu bebe aprendeu a adormecer de nova forma. Celebra.',
    icon: '7',
  },
};

const TIME_BASED_TIPS: Record<number, string> = {
  5: 'Manha cedo: registra os despertares da noite passada no diario.',
  6: 'Manha: como foi a noite? Vai ao Diario ver o teu progresso.',
  7: 'Manha: otima altura para rever o que correu bem ontem.',
  8: 'Manha: se ontem foi dificil, hoje e uma nova chance.',
  9: 'Manha: o teu bebe esta a dormir melhor por causa do teu esforco.',
  10: 'Meia manha: faz o ritual pre-sono hoje a noite?',
  11: 'Meia manha: planear a noite ajuda a manter consistencia.',
  12: 'Meio dia: descansa enquanto o bebe dorme. Tu tambem precisas.',
  13: 'Tarde: o progresso vem da consistencia, nao da perfeicao.',
  14: 'Tarde: lembra-te - cada noite que tentas conta.',
  15: 'Tarde: como esta o teu cansaco? Pede ajuda se precisares.',
  16: 'Tarde: em breve comeca o ritual pre-sono.',
  17: 'Tarde: o Ritual Pre-sono esta disponivel! Prepara o terreno.',
  18: 'Anoitecer: hora de comecar o ritual, preparar o ambiente.',
  19: 'Noite: luzes baixas, ambiente calmo. A noite comeca.',
  20: 'Noite: se o bebe ainda nao dorme, comeca o ritual.',
  21: 'Noite: hora de deitar. Confia no processo.',
  22: 'Noite: se ele acordar, usa o botao "ELE ACORDOU".',
  23: 'Noite profunda: mantem o telemovel por perto para usar o metodo.',
  0: 'Meia-noite: tu consegues. Cada despertar e pratica.',
  1: 'Madrugada: respira. Esta cansada mas esta a funcionar.',
  2: 'Madrugada: o teu sacrificio de hoje sera sono amanha.',
  3: 'Madrugada: quase amanhecer. Aguenta.',
  4: 'Madrugada: amanhece em breve. Forca, mama.',
};

export function Home({
  onboarding,
  currentDay,
  wakeups,
  onWakeup,
  onProgress,
  onRitual,
  onFAQ,
  onMenu,
  isNightMode,
  onDaySummary,
}: HomeProps) {
  const { vibrate } = useVibrate();
  const [isRitualActive, setIsRitualActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsRitualActive(hour >= 17 && hour <= 21);
      setCurrentTime(new Date());
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleWakeup = () => {
    vibrate(100);
    onWakeup();
  };

  const getDayInfo = () => {
    return DAY_MESSAGES[Math.min(currentDay, 7)] || {
      title: 'Continua',
      message: 'Continua assim.',
      tip: 'O progresso mantem-se.',
      icon: '!',
    };
  };

  const getTimeTip = () => {
    const hour = currentTime.getHours();
    return TIME_BASED_TIPS[hour] || 'Confia no processo.';
  };

  const getDisplayDay = (): string => {
    if (currentDay <= 7) {
      return `Dia ${currentDay} de 7`;
    }
    return `Dia ${currentDay}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const todayWakeups = wakeups.filter(w => w.date === today);
  const lastNightWakeups = todayWakeups.length;

  const dayInfo = getDayInfo();

  return (
    <div className={`min-h-screen flex flex-col ${isNightMode ? 'bg-gray-900' : 'bg-cream'}`}>
      {/* Header */}
      <header className={`px-4 py-3 flex items-center justify-between ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center shadow-md">
            <MoonStar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className={`font-bold text-base ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              Sono sem Choro
            </h1>
            <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Metodo da Vaquinha
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastNightWakeups > 0 && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${isNightMode ? 'bg-coral-500/20 text-coral-300' : 'bg-coral-100 text-coral-600'}`}>
              {lastNightWakeups} despertares
            </div>
          )}
          <button
            onClick={() => { vibrate(50); onMenu(); }}
            className={`p-2 rounded-lg ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 py-4 pb-32">
        {/* Day Status Card */}
        <button
          onClick={() => { vibrate(50); onDaySummary(); }}
          className={`rounded-2xl p-5 mb-4 text-left transition-all ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-2 border-coral-100 active:scale-[0.98]`}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">{dayInfo.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  {getDisplayDay()}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isNightMode ? 'bg-coral-500/20 text-coral-300' : 'bg-coral-100 text-coral-600'}`}>
                  {dayInfo.title}
                </span>
              </div>
              <p className={`text-sm mb-2 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {dayInfo.message}
              </p>
              <p className={`text-xs italic ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                "{dayInfo.tip}"
              </p>
            </div>
          </div>
        </button>

        {/* Tip based on time */}
        <div className={`rounded-xl p-3 mb-4 flex items-start gap-3 ${isNightMode ? 'bg-gray-800/50' : 'bg-coral-50'}`}>
          <Sparkles className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
          <p className={`text-xs leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {getTimeTip()}
          </p>
        </div>

        {/* Main Wakeup Button */}
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <button
            onClick={handleWakeup}
            className="w-[75%] aspect-square max-w-[280px] rounded-full flex items-center justify-center shadow-2xl transition-all animate-pulse-soft bg-gradient-to-br from-coral-400 to-coral-500 active:scale-95"
          >
            <div className="text-white text-center">
              <Baby className="w-14 h-14 mx-auto mb-3 opacity-90" />
              <span className="text-3xl font-bold block">ELE</span>
              <span className="text-3xl font-bold block">ACORDOU</span>
              <span className={`text-xs mt-2 block opacity-75 ${isNightMode ? 'text-white' : 'text-white/80'}`}>
                Toca para comecar
              </span>
            </div>
          </button>

          <p className={`mt-6 text-center text-sm max-w-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Quando o bebe acordar, toca aqui.
            <br />
            O app guia-te passo a passo durante a crise.
          </p>
        </div>

        {/* Quick Stats */}
        {wakeups.length > 0 && (
          <div className={`rounded-xl p-3 mb-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className={`text-2xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  {todayWakeups.length}
                </p>
                <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Despertares hoje
                </p>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">
                  {todayWakeups.filter(w => w.resolvedStep <= 3).length}
                </p>
                <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Sem mamar
                </p>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <p className={`text-2xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  {currentDay}
                </p>
                <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Dias
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 px-4 py-3 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-inner border-t ${isNightMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          <button
            onClick={() => { vibrate(50); onDaySummary(); }}
            className={`rounded-xl p-3 flex flex-col items-center gap-1 ${isNightMode ? 'bg-coral-500/20 text-coral-400' : 'bg-coral-50 text-coral-500'}`}
          >
            <Star className="w-5 h-5" />
            <span className="text-xs font-medium">Plano</span>
          </button>

          <button
            onClick={() => { vibrate(50); onProgress(); }}
            className={`rounded-xl p-3 flex flex-col items-center gap-1 ${isNightMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Diario</span>
          </button>

          <button
            onClick={() => { if (isRitualActive) { vibrate(50); onRitual(); }}}
            className={`rounded-xl p-3 flex flex-col items-center gap-1 ${
              isRitualActive
                ? isNightMode
                  ? 'bg-coral-500/20 border border-coral-400 text-coral-400'
                  : 'bg-coral-50 border border-coral-400 text-coral-500'
                : `${isNightMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`
            }`}
          >
            <CloudMoon className="w-5 h-5" />
            <span className="text-xs font-medium">Ritual</span>
          </button>

          <button
            onClick={() => { vibrate(50); onFAQ(); }}
            className={`rounded-xl p-3 flex flex-col items-center gap-1 ${isNightMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Ajuda</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
