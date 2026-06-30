import { useState } from 'react';
import { Baby, Moon, Heart, User, ArrowRight } from 'lucide-react';
import type { OnboardingData, BabyAge, WakeupsPerNight, SleepAssociation } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const AGE_OPTIONS: { value: BabyAge; label: string }[] = [
  { value: '0-6m', label: '0 a 6 meses' },
  { value: '7-12m', label: '7 a 12 meses' },
  { value: '13-24m', label: '13 a 24 meses' },
  { value: '2+', label: 'Mais de 2 anos' },
];

const WAKEUP_OPTIONS: { value: WakeupsPerNight; label: string }[] = [
  { value: '1-2', label: '1 a 2 vezes' },
  { value: '3-4', label: '3 a 4 vezes' },
  { value: '5+', label: '5 ou mais vezes' },
  { value: 'unknown', label: 'Nao conto' },
];

const ASSOCIATION_OPTIONS: { value: SleepAssociation; label: string; icon: string }[] = [
  { value: 'mama', label: 'Na mama', icon: 'O' },
  { value: 'arms', label: 'Ao colo', icon: 'U' },
  { value: 'pacifier', label: 'Chupeta', icon: 'o' },
  { value: 'stroller', label: 'Carrinho', icon: 'D' },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<Step>(0);
  const [babyName, setBabyName] = useState('');
  const [babyAge, setBabyAge] = useState<BabyAge | null>(null);
  const [wakeups, setWakeups] = useState<WakeupsPerNight | null>(null);
  const [association, setAssociation] = useState<SleepAssociation | null>(null);
  const [motherName, setMotherName] = useState('');
  const { vibrate } = useVibrate();

  const handleNext = () => {
    vibrate(50);
    setStep((prev) => (prev + 1) as Step);
  };

  const handleComplete = () => {
    if (!babyAge || !wakeups || !association) return;

    const data: OnboardingData = {
      babyName: babyName || 'Meu bebe',
      babyAge,
      wakeupsPerNight: wakeups,
      sleepAssociation: association,
      motherName: motherName || 'Mama',
      completedAt: new Date().toISOString(),
    };

    vibrate(100);
    onComplete(data);
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return babyName.length >= 2;
      case 1: return babyAge !== null;
      case 2: return wakeups !== null;
      case 3: return association !== null;
      case 4: return motherName.length >= 2;
      default: return false;
    }
  };

  const selectOption = <T extends string>(value: T, setter: (v: T) => void) => {
    vibrate(50);
    setter(value);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col px-6 py-12">
      {step === 0 && (
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-coral-400 rounded-full flex items-center justify-center">
              <Baby className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Qual o nome do teu bebe?
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Vamos personalizar a experiencia para ele
          </p>
          <input
            type="text"
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            placeholder="Nome do bebe"
            className="w-full px-6 py-4 text-lg bg-white border-2 border-coral-200 rounded-xl text-center focus:outline-none focus:border-coral-400 transition-colors"
            autoFocus
          />
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              canProceed() ? 'bg-coral-400 text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Continuar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-coral-400 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white font-bold">O</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Que idade tem o {babyName || 'bebe'}?
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Isto ajuda-nos a adaptar as tecnicas
          </p>
          <div className="grid grid-cols-2 gap-3">
            {AGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => selectOption(option.value, setBabyAge)}
                className={`py-4 px-4 rounded-xl font-medium text-lg transition-all ${
                  babyAge === option.value
                    ? 'bg-coral-400 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              canProceed() ? 'bg-coral-400 text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Continuar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-coral-400 rounded-full flex items-center justify-center">
              <Moon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Quantas vezes acordas numa noite?
          </h1>
          <p className="text-gray-500 text-center mb-8">Numa noite media</p>
          <div className="grid grid-cols-2 gap-3">
            {WAKEUP_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => selectOption(option.value, setWakeups)}
                className={`py-4 px-4 rounded-xl font-medium text-lg transition-all ${
                  wakeups === option.value
                    ? 'bg-coral-400 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              canProceed() ? 'bg-coral-400 text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Continuar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-coral-400 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Como o {babyName || 'bebe'} adormece habitualmente?
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Isto indica-nos a associacao de sono que ele criou
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ASSOCIATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => selectOption(option.value, setAssociation)}
                className={`py-4 px-4 rounded-xl font-medium text-lg flex flex-col items-center gap-2 transition-all ${
                  association === option.value
                    ? 'bg-coral-400 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              canProceed() ? 'bg-coral-400 text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Continuar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-coral-400 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Qual o teu nome, mama?
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Vamos conversar como irma mais velha
          </p>
          <input
            type="text"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
            placeholder="O teu nome"
            className="w-full px-6 py-4 text-lg bg-white border-2 border-coral-200 rounded-xl text-center focus:outline-none focus:border-coral-400 transition-colors"
            autoFocus
          />
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              canProceed() ? 'bg-coral-400 text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400'
            }`}
          >
            Continuar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-coral-400 rounded-full flex items-center justify-center">
              <span className="text-4xl text-white">O</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Ola, {motherName || 'mama'}
          </h1>
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            Pelo que me disseste, o {babyName || 'bebe'} criou uma{' '}
            <span className="font-semibold text-coral-500">associacao de sono</span>{' '}
            {association === 'mama' ? 'com a mama' :
             association === 'arms' ? 'com o colo' :
             association === 'pacifier' ? 'com a chupeta' : 'com o carrinho'}.
          </p>
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            Isto e <span className="font-semibold">normal</span> e tem{' '}
            <span className="font-semibold text-coral-500">solucao em 7 dias</span>.
          </p>
          <div className="bg-coral-50 border-2 border-coral-200 rounded-xl p-4 mb-8">
            <p className="text-center text-coral-600 font-semibold text-lg">
              O teu Dia 1 comeca hoje.
            </p>
          </div>
          <button
            onClick={handleComplete}
            className="w-full py-5 rounded-xl font-bold text-xl bg-coral-400 text-white active:scale-[0.98] transition-all shadow-lg"
          >
            COMECAR DIA 1
          </button>
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${i === step ? 'bg-coral-400 w-6' : 'bg-gray-300 w-2'}`}
          />
        ))}
      </div>
    </div>
  );
}
