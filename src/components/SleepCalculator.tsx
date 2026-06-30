import { useState } from 'react';
import { Calendar, Clock, Baby } from 'lucide-react';
import { SLEEP_WINDOWS, type SleepWindows } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';

interface SleepCalculatorProps {
  isNightMode: boolean;
  babyAgeRange?: '0-6m' | '7-12m' | '13-24m' | '2+';
  onAgeChange?: (age: string) => void;
}

const AGE_TO_INDEX: Record<string, number> = {
  '0-6m': 0,
  '7-12m': 1,
  '13-24m': 2,
  '2+': 3,
};

const INDEX_TO_AGE = ['0-3 meses', '4-6 meses', '7-12 meses', '13-24 meses', '25-36 meses'];

export function SleepCalculator({ isNightMode, babyAgeRange, onAgeChange }: SleepCalculatorProps) {
  const { vibrate } = useVibrate();
  const [selectedIndex, setSelectedIndex] = useState(babyAgeRange ? AGE_TO_INDEX[babyAgeRange] : 1);

  const handleSelect = (index: number) => {
    vibrate(30);
    setSelectedIndex(index);
  };

  const selectedData = SLEEP_WINDOWS[selectedIndex];

  // Calculate suggested schedule
  const calculateSchedule = () => {
    const wakeTime = 7; // 7am wake
    const suggestions: { nap: number; awakeWindow: string; suggested: string }[] = [];

    switch (selectedIndex) {
      case 0: // 0-3 months
        return [
          { nap: 1, awakeWindow: '45-60 min', suggested: '7h45 - 8h30' },
          { nap: 2, awakeWindow: '45-60 min', suggested: '9h30 - 10h00' },
          { nap: 3, awakeWindow: '45-60 min', suggested: '11h30 - 12h00' },
          { nap: 4, awakeWindow: '45-60 min', suggested: '13h30 - 14h00' },
          { nap: 5, awakeWindow: '45-60 min', suggested: '16h00 - 16h30' },
          { bedtime: 'Noite', awakeWindow: '60 min', suggested: '18h30 - 19h30' },
        ];
      case 1: // 4-6 months
        return [
          { nap: 1, awakeWindow: '2h', suggested: '09h00' },
          { nap: 2, awakeWindow: '2h15', suggested: '11h45' },
          { nap: 3, awakeWindow: '2h30', suggested: '14h45' },
          { nap: 4, awakeWindow: '2h30', suggested: '17h30' },
          { bedtime: 'Noite', awakeWindow: '2h30', suggested: '19h30 - 20h00' },
        ];
      case 2: // 7-12 months
        return [
          { nap: 1, awakeWindow: '2h30', suggested: '09h30' },
          { nap: 2, awakeWindow: '3h', suggested: '13h00' },
          { nap: 3, awakeWindow: '3h30', suggested: '17h00' },
          { bedtime: 'Noite', awakeWindow: '3h30', suggested: '20h00 - 20h30' },
        ];
      case 3: // 13-24 months
        return [
          { nap: 1, awakeWindow: '4h', suggested: '11h00' },
          { nap: 2, awakeWindow: '4h30', suggested: '16h00' },
          { bedtime: 'Noite', awakeWindow: '4h30', suggested: '20h30 - 21h00' },
        ];
      case 4: // 25-36 months
        return [
          { nap: 1, awakeWindow: '5-6h', suggested: '12h00 - 13h00' },
          { bedtime: 'Noite', awakeWindow: '5-6h', suggested: '20h30 - 21h30' },
        ];
      default:
        return [];
    }
  };

  const schedule = calculateSchedule();

  return (
    <div className={`rounded-2xl p-5 ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isNightMode ? 'bg-coral-500/20' : 'bg-coral-100'}`}>
          <Baby className={`w-5 h-5 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
        </div>
        <div>
          <h3 className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
            Calculadora de Janelas de Sono
          </h3>
          <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Horários sugeridos baseados na idade
          </p>
        </div>
      </div>

      {/* Age Selector */}
      <div className="mb-5">
        <p className={`text-sm font-medium mb-2 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Idade do bebé:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {INDEX_TO_AGE.map((age, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                selectedIndex === index
                  ? 'bg-coral-400 text-white'
                  : isNightMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className={`rounded-xl p-4 mb-4 ${isNightMode ? 'bg-gray-700' : 'bg-coral-50'}`}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className={`text-lg font-bold ${isNightMode ? 'text-white' : 'text-coral-600'}`}>
              {selectedData.awake_window}
            </p>
            <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Janela acordado
            </p>
          </div>
          <div>
            <p className={`text-lg font-bold ${isNightMode ? 'text-white' : 'text-coral-600'}`}>
              {selectedData.naps_per_day}
            </p>
            <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sestas/dia
            </p>
          </div>
          <div>
            <p className={`text-lg font-bold ${isNightMode ? 'text-white' : 'text-coral-600'}`}>
              {selectedData.total_sleep}
            </p>
            <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sono total
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Suggestion */}
      <div>
        <p className={`text-sm font-medium mb-3 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Horários sugeridos (começando às 7h00):
        </p>
        <div className="space-y-2">
          {schedule.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                'bedtime' in item
                  ? isNightMode
                    ? 'bg-coral-500/20 border border-coral-500/30'
                    : 'bg-coral-100 border border-coral-200'
                  : isNightMode
                    ? 'bg-gray-700'
                    : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {'nap' in item ? (
                  <Clock className={`w-4 h-4 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <Calendar className={`w-4 h-4 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
                )}
                <div>
                  <p className={`font-medium text-sm ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                    {'nap' in item ? `Sesta ${item.nap}` : 'Deitar'}
                  </p>
                  <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Janela: {item.awakeWindow}
                  </p>
                </div>
              </div>
              <div className={`font-bold ${isNightMode ? 'text-coral-400' : 'text-coral-600'}`}>
                {item.suggested}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className={`text-xs mt-4 italic ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
        💡 Estes são valores aproximados. Cada bebé é único. Observa os sinais de sono e ajusta.
      </p>
    </div>
  );
}
