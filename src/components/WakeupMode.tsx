import { useState, useEffect, useRef } from 'react';
import { Moon, Play, Pause, Volume2, X, Check, ArrowRight } from 'lucide-react';
import type { WakeupEntry, ResolvedStep, BabyAge } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';
import { useTimer, formatTime } from '../hooks/useTimer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    document.body.style.backgroundColor = '#0F0F1A'; // night-900 for deep night mode
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

  const handleResolved = (resolved_step: ResolvedStep) => {
    vibrate(100);
    handleCompleteWakeup(resolved_step);
  };

  const handleCompleteWakeup = (resolved_step: ResolvedStep) => {
    const now = Date.now();
    const durationSeconds = Math.floor((now - startTime) / 1000);

    const wakeup: WakeupEntry = {
      id: crypto.randomUUID(),
      user_id: 'local',
      day_number: currentDay,
      timestamp: new Date(startTime).toISOString(),
      resolved_at: new Date().toISOString(),
      resolved_step,
      duration_seconds: durationSeconds,
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
    <div className="min-h-screen bg-night-900 text-white flex flex-col justify-center items-center px-4 py-8">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onExit} 
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X className="w-6 h-6" />
      </Button>

      <Card className="w-full max-w-md bg-night-800 border-night-700 text-white shadow-2xl">
        {/* Step 0 */}
        {step === 0 && (
          <CardContent className="flex flex-col items-center pt-10 pb-8 animate-in fade-in">
            <Moon className="w-16 h-16 text-primary mb-6" />
            <h1 className="text-2xl font-bold text-center mb-2">Respira.</h1>
            <p className="text-center text-gray-400 mb-8 px-4">
              Estamos aqui. Vamos passar por isto juntas.
            </p>
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold"
              onClick={handleStartWakeup}
            >
              {babyName} acordou
            </Button>
          </CardContent>
        )}

        {/* Step 1 - Pausa Consciente */}
        {step === 1 && (
          <>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Passo 1: Pausa Consciente</CardTitle>
              <CardDescription className="text-gray-400">
                Espera <span className="text-primary font-bold">30 segundos</span> antes de te aproximares.
                Muitas vezes ele volta a adormecer sozinho.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4 pb-6">
              <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center mb-8 bg-night-900/50">
                <span className="text-5xl font-bold text-white">{seconds}</span>
              </div>
              <div className="w-full space-y-3">
                <Button
                  size="lg"
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={handleSlept}
                >
                  <Check className="w-5 h-5 mr-2" /> Adormeceu sozinho
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 border-night-600 bg-night-700 hover:bg-night-600 text-white font-semibold"
                  onClick={handleNext}
                >
                  Continua acordado <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2 - Presenca Fisica */}
        {step === 2 && (
          <>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Passo 2: Presença Física</CardTitle>
              <CardDescription className="text-gray-400">
                Aproxima-te. Diz baixinho: "a mamã está aqui". Não pegues ao colo.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4 pb-6">
              <Button
                variant="secondary"
                size="lg"
                className="w-full mb-8 h-14"
                onClick={toggleAudio}
              >
                {audioPlaying ? (
                  <><Pause className="w-5 h-5 mr-2" /> Pausar áudio</>
                ) : (
                  <><Volume2 className="w-5 h-5 mr-2" /> Ouvir áudio-guia (90s)</>
                )}
              </Button>
              <div className="w-full space-y-3">
                <Button
                  size="lg"
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => handleResolved(2)}
                >
                  <Check className="w-5 h-5 mr-2" /> Acalmou
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 border-night-600 bg-night-700 hover:bg-night-600 text-white font-semibold"
                  onClick={handleNext}
                >
                  Continua a chorar <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3 - Embalo sem Colo */}
        {step === 3 && (
          <>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Passo 3: Embalo sem Colo</CardTitle>
              <CardDescription className="text-gray-400">
                Mão suave no peito, ritmo lento. 2 minutos.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4 pb-6">
              <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center mb-6 bg-night-900/50">
                <span className="text-4xl font-bold text-white">{formatTime(seconds)}</span>
              </div>
              <div className="flex gap-4 mb-8">
                {!isRunning ? (
                  <Button size="icon" className="w-14 h-14 rounded-full" onClick={start}>
                    <Play className="w-6 h-6" />
                  </Button>
                ) : (
                  <Button size="icon" variant="secondary" className="w-14 h-14 rounded-full" onClick={pause}>
                    <Pause className="w-6 h-6" />
                  </Button>
                )}
                <Button size="icon" variant="outline" className="w-14 h-14 rounded-full border-night-600 bg-night-700 hover:bg-night-600 text-gray-400" onClick={() => reset(0)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="w-full space-y-3">
                <Button
                  size="lg"
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => handleResolved(3)}
                >
                  <Check className="w-5 h-5 mr-2" /> Adormeceu
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 border-night-600 bg-night-700 hover:bg-night-600 text-white font-semibold"
                  onClick={handleNext}
                >
                  Próximo passo <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 4 - Oferta de Agua */}
        {step === 4 && babyAge !== '0-6m' && (
          <>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Passo 4: Oferta de Água</CardTitle>
              <CardDescription className="text-gray-400">
                Oferece o copo de água. Se aceitar = era hábito. Se recusar = passa adiante.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4 pb-6">
              <div className="w-full space-y-3">
                <Button
                  size="lg"
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => handleResolved(4)}
                >
                  <Check className="w-5 h-5 mr-2" /> Aceitou e acalmou
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 border-night-600 bg-night-700 hover:bg-night-600 text-white font-semibold"
                  onClick={handleNext}
                >
                  Recusou / Chora <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 5 - Mama Consciente */}
        {step === 5 && (
          <>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Passo 5: Mama Consciente</CardTitle>
              <CardDescription className="text-gray-400 text-left">
                Está bem. Mama em modo consciente:
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Luz apagada</li>
                  <li>Sem falar</li>
                  <li>Mama curta</li>
                  <li>Volta a deitar antes de ele adormecer totalmente</li>
                </ul>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4 pb-6">
              <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center mb-6 bg-night-900/50">
                <span className="text-4xl font-bold text-white">{formatTime(seconds)}</span>
              </div>
              <div className="flex gap-4 mb-8">
                {!isRunning ? (
                  <Button size="icon" className="w-14 h-14 rounded-full" onClick={start}>
                    <Play className="w-6 h-6" />
                  </Button>
                ) : (
                  <Button size="icon" variant="secondary" className="w-14 h-14 rounded-full" onClick={pause}>
                    <Pause className="w-6 h-6" />
                  </Button>
                )}
              </div>
              <Button
                size="lg"
                className="w-full h-14 font-semibold"
                onClick={() => handleResolved(5)}
              >
                Concluído
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
