import { useState, useEffect, useRef } from 'react';
import { Moon, Play, Pause, Volume2, X, Check, ArrowRight } from 'lucide-react';
import type { WakeupEntry, ResolvedStep, BabyAge } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';
import { useTimer, formatTime } from '../hooks/useTimer';
import { generateId } from '../lib/storage';

interface WakeupModeProps {
  babyName: string;
  babyAge: BabyAge;
  currentDay: number;
  onComplete: (wakeup: WakeupEntry) => void;
  onExit: () => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export function WakeupMode({
  babyName,
  babyAge,
  currentDay,
  onComplete,
  onExit,
}: WakeupModeProps) {
  const [step, setStep] = useState<Step>(0);
  const { vibrate } = useVibrate();
  const [startTime] = useState(Date.now());
  const { seconds, isRunning, start, pause, reset, setCountdown, setStopwatch } = useTimer(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  useEffect(() => { vibrate(50); }, [step, vibrate]);

  const handleStartWakeup = () => {
    vibrate(100);
    setStep(1);
    setCountdown(30);
    start();
  };

  const handleSlept = () => {
    vibrate(100);
    handleCompleteWakeup(1);
  };

  const handleNext = () => {
    pause();
    vibrate(50);
    const nextStep = (step + 1) as Step;

    if (babyAge === '0-6m' && nextStep === 4) {
      setStep(5);
    } else {
      setStep(nextStep);
      if (nextStep === 2) {
        reset(0);
        setStopwatch();
      } else if (nextStep === 3) {
        reset(120);
        setCountdown(120);
        start();
      } else if (nextStep === 5) {
        reset(0);
        setStopwatch();
      }
    }
  };

  const handleResolved = (resolvedAt: ResolvedStep) => {
    vibrate(100);
    handleCompleteWakeup(resolvedAt);
  };

  const handleCompleteWakeup = (resolvedStep: ResolvedStep) => {
    const now = Date.now();
    const durationSeconds = Math.floor((now - startTime) / 1000);

    const wakeup: WakeupEntry = {
      id: generateId(),
      timestamp: new Date(startTime).toISOString(),
      resolvedAt: new Date(now).toISOString(),
      resolvedStep,
      durationSeconds,
      day: currentDay,
      date: new Date().toISOString().split('T')[0],
    };

    onComplete(wakeup);
    onExit();
  };

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/guide-silence.mp3');
    }
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setAudioPlaying(true);
      audioRef.current.onended = () => setAudioPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-6 py-8">
      <button onClick={onExit} className="absolute top-4 right-4 p-2 text-gray-500">
        <X className="w-6 h-6" />
      </button>

      {/* Step 0 */}
      {step === 0 && (
        <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
          <Moon className="w-16 h-16 text-coral-400 mb-8" />
          <h1 className="text-2xl font-semibold text-center mb-4">Respira.</h1>
          <p className="text-xl text-center text-gray-300 mb-8">
            Estamos aqui. Vamos passar por isto juntas.
          </p>
          <button
            onClick={handleStartWakeup}
            className="w-full max-w-sm py-5 rounded-xl font-bold text-xl bg-coral-400 text-black active:scale-95 transition-all"
          >
            {babyName} acordou
          </button>
        </div>
      )}

      {/* Step 1 - Pausa Consciente */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-4">Passo 1: Pausa Consciente</h2>
            <p className="text-lg text-gray-300 mb-4">
              Espera <span className="text-coral-400 font-bold">30 segundos</span> antes de te aproximares.
            </p>
            <p className="text-base text-gray-400">Muitas vezes ele volta a adormecer sozinho.</p>
          </div>

          <div className="w-40 h-40 rounded-full border-4 border-coral-400 flex items-center justify-center mb-8">
            <span className="text-5xl font-bold">{seconds}</span>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={handleSlept}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-green-500 text-white flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Adormeceu sozinho
            </button>
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-coral-400 text-black flex items-center justify-center gap-2"
            >
              Continua acordado <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 - Presenca Fisica */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-4">Passo 2: Presenca Fisica</h2>
            <p className="text-lg text-gray-300 mb-4">Aproxima-te. Mae no peito dele.</p>
            <p className="text-base text-gray-400">
              Diz baixinho: "<span className="text-white">mama esta aqui</span>". Nao pegues ao colo.
            </p>
          </div>

          <button
            onClick={toggleAudio}
            className="w-full max-w-sm py-4 rounded-xl font-medium text-base bg-gray-800 border-2 border-gray-700 flex items-center justify-center gap-2 mb-8"
          >
            {audioPlaying ? (
              <><Pause className="w-5 h-5" /> Pausar audio-guia</>
            ) : (
              <><Volume2 className="w-5 h-5" /> Ouvir audio-guia (90s)</>
            )}
          </button>

          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={() => handleResolved(2)}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-green-500 text-white flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Acalmou
            </button>
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-coral-400 text-black flex items-center justify-center gap-2"
            >
              Continua a chorar <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 - Embalo sem Colo */}
      {step === 3 && (
        <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-4">Passo 3: Embalo sem Colo</h2>
            <p className="text-lg text-gray-300 mb-4">Embala-o onde esta.</p>
            <p className="text-base text-gray-400">Mae suave no peito, ritmo lento. 2 minutos.</p>
          </div>

          <div className="w-40 h-40 rounded-full border-4 border-coral-400 flex items-center justify-center mb-8">
            <span className="text-4xl font-bold">{formatTime(seconds)}</span>
          </div>

          <div className="flex gap-4 mb-8">
            {!isRunning ? (
              <button onClick={start} className="w-14 h-14 rounded-full bg-coral-400 flex items-center justify-center">
                <Play className="w-6 h-6 text-black" />
              </button>
            ) : (
              <button onClick={pause} className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                <Pause className="w-6 h-6 text-white" />
              </button>
            )}
            <button onClick={() => reset(0)} className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={() => handleResolved(3)}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-green-500 text-white flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Adormeceu
            </button>
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-coral-400 text-black flex items-center justify-center gap-2"
            >
              Proximo passo <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4 - Oferta de Agua (condicional) */}
      {step === 4 && babyAge !== '0-6m' && (
        <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-4">Passo 4: Oferta de Agua</h2>
            <p className="text-lg text-gray-300 mb-4">Oferece o copo de agua.</p>
            <p className="text-base text-gray-400">
              Se aceitar = era habito de succao. Se recusar = passa adiante.
            </p>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={() => handleResolved(4)}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-green-500 text-white flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Aceitou
            </button>
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-coral-400 text-black flex items-center justify-center gap-2"
            >
              Recusou <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5 - Mama Consciente */}
      {step === 5 && (
        <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-4">Passo 5: Mama Consciente</h2>
            <p className="text-lg text-gray-300 mb-4">Esta bem. Mama em modo consciente.</p>
            <ul className="text-base text-gray-400 text-left space-y-2 mb-4">
              <li>- Luz apagada</li>
              <li>- Sem falar</li>
              <li>- Sem embalar</li>
              <li>- Mama curta</li>
              <li>- Volta a deitar antes de ele adormecer totalmente</li>
            </ul>
          </div>

          <div className="w-40 h-40 rounded-full border-4 border-coral-400 flex items-center justify-center mb-8">
            <span className="text-4xl font-bold">{formatTime(seconds)}</span>
          </div>

          <div className="flex gap-4 mb-8">
            {!isRunning ? (
              <button onClick={start} className="w-14 h-14 rounded-full bg-coral-400 flex items-center justify-center">
                <Play className="w-6 h-6 text-black" />
              </button>
            ) : (
              <button onClick={pause} className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                <Pause className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleResolved(5)}
            className="w-full max-w-sm py-4 rounded-xl font-semibold text-lg bg-coral-400 text-black"
          >
            Concluido
          </button>
        </div>
      )}
    </div>
  );
}
