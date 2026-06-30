import { Home, BookOpen, Wrench, User } from 'lucide-react';
import type { TabId } from '../lib/types';
import { useVibrate } from '../hooks/useVibrate';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isNightMode: boolean;
}

export function BottomNav({ activeTab, onTabChange, isNightMode }: BottomNavProps) {
  const { vibrate } = useVibrate();

  const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
    { id: 'hoje', label: 'Hoje', icon: Home },
    { id: 'metodo', label: 'Método', icon: BookOpen },
    { id: 'ferramentas', label: 'Ferramentas', icon: Wrench },
    { id: 'eu', label: 'Eu', icon: User },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 px-2 py-2 ${isNightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t shadow-lg safe-area-inset-bottom`}>
      <div className="max-w-md mx-auto flex justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                vibrate(30);
                onTabChange(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? isNightMode
                    ? 'bg-coral-500/20 text-coral-400'
                    : 'bg-coral-50 text-coral-500'
                  : isNightMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
