import { useState, useEffect } from 'react';
import { Download, Share, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export function InstallPWA({ isNightMode }: { isNightMode: boolean }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    // Check if it's iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);
    
    if (isIosDevice) {
      // Don't spam iOS users, check if we showed it recently
      const dismissed = localStorage.getItem('pwa_ios_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }

    // Listen for Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    // We clear the prompt since it can only be used once
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (isIOS) {
      localStorage.setItem('pwa_ios_dismissed', 'true');
    }
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className={`mx-4 mt-4 mb-2 p-4 rounded-2xl relative shadow-md border ${
      isNightMode ? 'bg-indigo-900/40 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'
    }`}>
      <button 
        onClick={handleDismiss}
        className={`absolute top-2 right-2 p-1 rounded-full ${isNightMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-indigo-100'}`}
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl shrink-0 ${isNightMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
          <Smartphone className={`w-6 h-6 ${isNightMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </div>
        
        <div className="pr-4">
          <h3 className={`font-bold text-sm mb-1 ${isNightMode ? 'text-white' : 'text-indigo-900'}`}>
            Instalar o Aplicativo
          </h3>
          
          {isIOS ? (
            <div className={`text-xs space-y-2 ${isNightMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
              <p>Para uma melhor experiência durante a madrugada, adicione este app à tela inicial:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Toque no botão Partilhar <Share className="w-3 h-3 inline" /> abaixo</li>
                <li>Escolha <strong>"Ecrã principal"</strong></li>
              </ol>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <p className={`text-xs ${isNightMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                Instale o app para acesso rápido e funcionamento offline de madrugada.
              </p>
              <button 
                onClick={handleInstallClick}
                className="mt-1 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
              >
                <Download className="w-4 h-4" /> Instalar Agora
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
