import { useEffect, useState } from 'react';
import { Moon, BarChart3, MoonStar, HelpCircle, Menu, Sparkles, Heart, Star, CloudMoon, Baby, TrendingDown, Award } from 'lucide-react';
import type { OnboardingData, WakeupEntry } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InstallPWA } from './InstallPWA';

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
  onUnlockDevMode?: () => void;
  onThemeToggle: () => void;
}

const DAY_MESSAGES: Record<number, { title: string; message: string; tip: string; emoji: string }> = {
  1: {
    title: 'A Semente',
    message: 'Esta é a noite de plantar a semente. Hoje, observas e aprendes.',
    tip: 'Não desistas na primeira dificuldade. Cada despertar é uma oportunidade de praticar. O simples facto de estares aqui já é progresso.',
    emoji: '🌱',
  },
  2: {
    title: 'A Ajustagem',
    message: 'O ambiente está preparado. Agora aplica a sequência pela primeira vez.',
    tip: 'O teu bebé está a aprender algo novo. Paciência e consistência são as tuas armas. Segue os 5 passos em cada despertar.',
    emoji: '🏠',
  },
  3: {
    title: 'O Pico',
    message: 'Hoje é a noite mais difícil — e isso é BOM. Significa que está a funcionar.',
    tip: 'Se o teu bebé chora mais hoje, é o "extinction burst". Ele está a testar limites. Mantém-te firme. Amanhã será mais fácil.',
    emoji: '🔥',
  },
  4: {
    title: 'A Consolidação',
    message: 'O progresso está a consolidar-se. Os despertares começam a reduzir.',
    tip: 'Encurta o tempo da mama (Passo 5). Retira antes de adormecer. Cada despertar é mais fácil que ontem.',
    emoji: '📈',
  },
  5: {
    title: 'O Hábito',
    message: 'O bebé começa a auto-acalmar-se. O novo hábito está a formar-se.',
    tip: 'Presta atenção aos momentos em que ele resmungou mas voltou a adormecer sozinho. Isso é o objectivo — está a acontecer!',
    emoji: '💪',
  },
  6: {
    title: 'A Viragem',
    message: 'Quase uma semana completa. O sono está a mudar para melhor.',
    tip: 'Olha para trás e compara com o Módulo 1. O progresso é real. Estás quase lá — mais uma noite.',
    emoji: '🌅',
  },
  7: {
    title: 'Uma Semana',
    message: 'Uma semana completa. Orgulha-te do que conquistaste.',
    tip: 'Conseguiste! O teu bebé aprendeu a adormecer de nova forma. Tu ensinaste-lhe. Celebra esta vitória.',
    emoji: '🏆',
  },
};

const TIME_BASED_TIPS: Record<number, string> = {
  5: '☀️ Manhã cedo — regista os despertares da noite no app.',
  6: '☀️ Como foi a noite? Vai ao progresso ver os teus números.',
  7: '☀️ Óptima altura para rever o que correu bem ontem.',
  8: '☀️ Se ontem foi difícil, hoje é uma nova chance. Cada noite conta.',
  9: '☀️ O teu bebé está a dormir melhor por causa do teu esforço.',
  10: '🌤️ Planeia a noite: vais fazer o ritual pré-sono?',
  11: '🌤️ Planear a noite ajuda a manter a consistência.',
  12: '🌞 Descansa enquanto o bebé dorme. Tu também precisas.',
  13: '🌞 O progresso vem da consistência, não da perfeição.',
  14: '🌞 Lembra-te: cada noite que tentas, conta.',
  15: '🌤️ Como está o teu cansaço? Pede ajuda se precisares.',
  16: '🌤️ Em breve começa o ritual pré-sono. Prepara-te.',
  17: '🌅 O ritual pré-sono está disponível! Começa a preparar o ambiente.',
  18: '🌙 Hora de começar o ritual: banho, pijama, luz baixa.',
  19: '🌙 Luzes baixas, ambiente calmo. A noite começa.',
  20: '🌙 Se o bebé ainda não dorme, começa o ritual agora.',
  21: '🌙 Hora de deitar. Confia no processo — tu sabes o que fazer.',
  22: '🌑 Se ele acordar, usa o botão "ELE ACORDOU" e segue os passos.',
  23: '🌑 Mantém o telemóvel por perto. O app guia-te.',
  0: '🌑 Tu consegues. Cada despertar é prática.',
  1: '🌑 Respira. Estás cansada mas estás a fazer o certo.',
  2: '🌑 O teu sacrifício de agora será sono amanhã.',
  3: '🌑 Quase amanhecer. Aguenta firme.',
  4: '🌑 Amanhece em breve. Força, mãe. 💛',
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
  onUnlockDevMode,
  onThemeToggle,
}: HomeProps) {
  const { vibrate } = useVibrate();
  const [isRitualActive, setIsRitualActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clickCount, setClickCount] = useState(0);

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
      message: 'Mantém a rotina. O hábito está consolidado.',
      tip: 'Se houve regressão, volta aos 5 passos. O bebé recupera rápido.',
      emoji: '✨',
    };
  };

  const getTimeTip = () => {
    const hour = currentTime.getHours();
    return TIME_BASED_TIPS[hour] || '💛 Confia no processo — estás a fazer bem.';
  };

  const getDisplayDay = (): string => {
    if (currentDay <= 7) return `Módulo ${currentDay} de 7`;
    return `Módulo ${currentDay}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const todayWakeups = wakeups.filter(w => w.date === today);
  const lastNightWakeups = todayWakeups.length;

  // Calculate improvement
  const day1Wakeups = wakeups.filter(w => w.day_number === 1).length;
  const improvement = day1Wakeups > 0 && currentDay > 1
    ? Math.round(((day1Wakeups - lastNightWakeups) / day1Wakeups) * 100)
    : 0;

  const dayInfo = getDayInfo();

  return (
    <div className={`min-h-screen flex flex-col ${isNightMode ? 'bg-gradient-night' : 'bg-gradient-warm'}`}>
      {/* Header */}
      <header className={`px-5 py-3 flex items-center justify-between ${isNightMode ? 'glass-dark border-b border-white/5' : 'glass border-b border-coral-100/50'}`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const newCount = clickCount + 1;
              setClickCount(newCount);
              if (newCount === 5) {
                vibrate(200);
                onUnlockDevMode?.();
                setClickCount(0);
              }
            }}
            className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-xl flex items-center justify-center shadow-md active:scale-95"
          >
            <MoonStar className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className={`font-extrabold text-base tracking-tight ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
              Sono sem Choro
            </h1>
            <p className={`text-[10px] font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              O teu guia noturno
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { vibrate(30); onThemeToggle(); }}
            className={`p-2 rounded-xl ${isNightMode ? 'bg-gray-800/80 text-coral-400 border border-gray-700' : 'bg-coral-50 text-coral-500 border border-coral-100'}`}
          >
            <MoonStar className="w-5 h-5" />
          </button>
          <button
            onClick={() => { vibrate(50); onMenu(); }}
            className={`p-2 rounded-xl ${isNightMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 py-4 pb-32">
        <InstallPWA isNightMode={isNightMode} />
        
        {/* Day Status Card */}
        <button
          onClick={() => { vibrate(50); onDaySummary(); }}
          className={`rounded-2xl p-5 mb-3 text-left transition-all active:scale-[0.98] ${
            isNightMode
              ? 'bg-gray-800/60 border border-gray-700/30 shadow-premium-dark'
              : 'bg-white/90 border border-coral-100/50 shadow-premium'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-2xl">{dayInfo.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`font-extrabold text-lg tracking-tight ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  {getDisplayDay()}
                </p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isNightMode ? 'bg-coral-500/20 text-coral-300' : 'bg-coral-100 text-coral-600'}`}>
                  {dayInfo.title}
                </span>
              </div>
              <p className={`text-sm mb-2 leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {dayInfo.message}
              </p>
              <p className={`text-xs italic leading-relaxed ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                💬 "{dayInfo.tip}"
              </p>
            </div>
          </div>
        </button>

        {/* Value Recap — shows improvement */}
        {currentDay > 1 && wakeups.length > 0 && improvement > 0 && (
          <div className={`rounded-xl p-3 mb-3 flex items-center gap-3 ${isNightMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200/50'}`}>
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex-1">
              <p className={`text-xs font-semibold ${isNightMode ? 'text-green-400' : 'text-green-600'}`}>
                📉 {improvement}% menos despertares que o Módulo 1
              </p>
              <p className={`text-[10px] ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                O método está a funcionar. Continua assim!
              </p>
            </div>
          </div>
        )}

        {/* Time-based Tip */}
        <div className={`rounded-xl p-3 mb-3 flex items-start gap-3 ${isNightMode ? 'bg-gray-800/40 border border-gray-700/20' : 'bg-coral-50/80 border border-coral-100/30'}`}>
          <Sparkles className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
          <p className={`text-xs leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {getTimeTip()}
          </p>
        </div>

        {/* Main Wakeup Button */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 px-2">
          <Card className="w-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Baby className="w-12 h-12 mb-4 text-primary opacity-90" />
              <Button 
                size="lg" 
                className="w-full h-16 text-lg font-bold shadow-lg bg-coral-500 hover:bg-coral-600 text-white border-none"
                onClick={handleWakeup}
              >
                ELE ACORDOU
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Toca no botão quando o bebé acordar para iniciar o método.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        {wakeups.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4 flex items-center justify-around">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-foreground">
                  {todayWakeups.length}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  Hoje
                </p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-green-500">
                  {todayWakeups.filter(w => w.resolved_step <= 3).length}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  Sem mama
                </p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-primary">
                  {currentDay}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  Módulo
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions Grid (Replaces old fixed nav) */}
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => { vibrate(50); onDaySummary(); }}
            className={`rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 bg-secondary hover:bg-secondary/80 text-secondary-foreground`}
          >
            <Star className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-semibold">Plano</span>
          </button>

          <button
            onClick={() => { vibrate(50); onProgress(); }}
            className={`rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 bg-secondary hover:bg-secondary/80 text-secondary-foreground`}
          >
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-semibold">Diário</span>
          </button>

          <button
            onClick={() => { 
              if (isRitualActive) { 
                vibrate(50); onRitual(); 
              } else {
                vibrate([30, 50, 30]);
                alert("O ritual pré-sono só está disponível entre as 17h e as 21h.");
              }
            }}
            className={`rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
              isRitualActive
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground opacity-50'
            }`}
          >
            <CloudMoon className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-semibold">Ritual</span>
          </button>

          <button
            onClick={() => { vibrate(50); onFAQ(); }}
            className={`rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 bg-secondary hover:bg-secondary/80 text-secondary-foreground`}
          >
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-semibold">Ajuda</span>
          </button>
        </div>
      </main>
    </div>
  );
}
