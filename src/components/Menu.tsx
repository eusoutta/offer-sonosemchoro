import { X, Moon } from 'lucide-react';
import { useVibrate } from '../hooks/useVibrate';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  planoManutencao: boolean;
  currentDay: number;
  isNightMode: boolean;
  onPaywall: () => void;
}

export function Menu({
  isOpen,
  onClose,
  planoManutencao,
  currentDay,
  isNightMode,
  onPaywall,
}: MenuProps) {
  const { vibrate } = useVibrate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => { vibrate(30); onClose(); }}
      />
      <div className={`relative w-[80%] max-w-sm h-full ${isNightMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}
        style={{ animation: 'slideRight 0.3s ease-out' }}
      >
        <div className={`p-4 flex justify-between items-center border-b ${isNightMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`font-semibold text-lg ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
            Menu
          </h2>
          <button
            onClick={() => { vibrate(30); onClose(); }}
            className={`p-2 ${isNightMode ? 'text-white' : 'text-gray-600'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {currentDay > 7 && !planoManutencao && (
            <button
              onClick={() => {
                vibrate(50);
                onClose();
                onPaywall();
              }}
              className="w-full py-3 px-4 rounded-lg flex items-center gap-3 bg-coral-400 text-white"
            >
              <Moon className="w-5 h-5" />
              Continuar o sono (Plano Manutencao)
            </button>
          )}

          {planoManutencao && (
            <div className={`py-3 px-4 rounded-lg flex items-center gap-3 bg-green-500/20 text-green-500`}>
              <Moon className="w-5 h-5" />
              Plano Manutencao: Activo
            </div>
          )}
        </nav>

        <div className={`absolute bottom-8 left-4 right-4 text-center ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-xs">Sono sem Choro v1.0</p>
        </div>
      </div>

      <style>{`
        @keyframes slideRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
