import { useState } from 'react';
import { Moon, Check } from 'lucide-react';
import { useVibrate } from '../hooks/useVibrate';

interface RitualProps {
  onComplete: () => void;
  onBack: () => void;
  isNightMode: boolean;
}

const RITUAL_ITEMS = [
  { id: '1', text: 'Banho morno (10 min antes de deitar)' },
  { id: '2', text: 'Luz baixa em toda a casa' },
  { id: '3', text: 'Sem ecras para o bebe (TV, telemovel, tablet)' },
  { id: '4', text: 'Massagem suave nos pes/costas (3 min)' },
  { id: '5', text: 'Por a roupa de dormir' },
  { id: '6', text: 'Ultima mamada em ambiente calmo (nao na cama)' },
  { id: '7', text: 'Deitar com bebe sonolento mas acordado' },
];

export function Ritual({ onComplete, onBack, isNightMode }: RitualProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const { vibrate } = useVibrate();

  const isComplete = checkedItems.size === RITUAL_ITEMS.length;

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        vibrate(30);
      }
      return next;
    });
  };

  const handleComplete = () => {
    vibrate(100);
    onComplete();
  };

  return (
    <div className={`min-h-screen flex flex-col ${isNightMode ? 'bg-gray-900' : 'bg-cream'}`}>
      <header className={`px-4 py-4 flex items-center gap-4 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <Moon className={`w-6 h-6 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
        <h1 className={`font-semibold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
          Ritual Pre-sono
        </h1>
      </header>

      <main className="flex-1 px-4 py-6 pb-24">
        <p className={`text-center mb-6 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Disponivel das 17h as 21h. Marca cada passo.
        </p>

        <div className="space-y-3">
          {RITUAL_ITEMS.map((item, index) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full rounded-xl p-4 flex items-center gap-4 transition-all ${
                checkedItems.has(item.id)
                  ? 'bg-green-500 text-white'
                  : isNightMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700'
              } shadow-sm`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  checkedItems.has(item.id)
                    ? 'border-white bg-white'
                    : isNightMode
                      ? 'border-gray-600'
                      : 'border-gray-300'
                }`}
              >
                {checkedItems.has(item.id) && <Check className="w-5 h-5 text-green-500" />}
              </div>
              <span className="text-base text-left flex-1">
                {index + 1}. {item.text}
              </span>
            </button>
          ))}
        </div>

        {isComplete && (
          <div className="mt-6 animate-fade-in">
            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-coral-400 text-white active:scale-[0.98] transition-all"
            >
              Ritual completo
            </button>
            <p className={`text-center mt-4 text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Boa noite, mama. Estou aqui se precisares.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
